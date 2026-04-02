import express from "express";
import jwt from "jsonwebtoken";
import {body, validationResult} from "express-validator";
import {v4 as uuidv4} from "uuid";
import User from "../models/User";
import {sendVerificationEmail} from "../utils/email";
import {authenticate} from "../utils/authChecks";

const router = express.Router();

const generateToken = (userId) =>
    jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

router.post(
    '/register',
    [
        body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
        body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters'),
        body('firstName').trim().notEmpty().withMessage('First name required'),
        body('lastName').trim().notEmpty().withMessage('Last name required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        const {email, password, firstName, lastName} = req.body;

        try {
            const existingUser = await User.findOne({email});
            if (existingUser) {
                return res.status(409).json({success: false, message: 'Email already registered'});
            }

            const verificationToken = uuidv4();

            const user = new User({
                email,
                passwordHash: password,
                firstName,
                lastName,
                verificationToken,
            });

            await user.save();

            try {
                await sendVerificationEmail(email, firstName, verificationToken);
            } catch (emailError) {
                console.error('Email send failed:', emailError.message);
            }

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please check your email to verify your account.',
            });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({success: false, message: 'Server error during registration'});
        }
    }
);

router.post(
    '/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').notEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        const {email, password} = req.body;

        try {
            const user = await User.findOne({email}).select('+passwordHash');
            if (!user) {
                return res.status(401).json({success: false, message: 'Invalid email or password'});
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({success: false, message: 'Invalid email or password'});
            }

            if (!user.isVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Please verify your email before logging in.',
                    needsVerification: true,
                });
            }

            const token = generateToken(user._id);

            res.json({
                success: true,
                token,
                user: user.toJSON(),
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({success: false, message: 'Server error during login'});
        }
    }
);

router.get('/verify-email', async (req, res) => {
    const {token} = req.query;
    if (!token) {
        return res.status(400).json({success: false, message: 'Verification token required'});
    }

    try {
        const user = await User.findOne({verificationToken: token});
        if (!user) {
            return res.status(400).json({success: false, message: 'Invalid or expired verification token'});
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        const authToken = generateToken(user._id);

        res.json({
            success: true,
            message: 'Email verified successfully!',
            token: authToken,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({success: false, message: 'Server error during verification'});
    }
});

router.get('/me', authenticate, async (req, res) => {
    res.json({success: true, user: req.user.toJSON()});
});

router.post('/resend-verification', async (req, res) => {
    const {email} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user || user.isVerified) {
            return res.json({success: true, message: 'If this email exists and is unverified, a new link was sent.'});
        }

        const verificationToken = uuidv4();
        user.verificationToken = verificationToken;
        await user.save();

        await sendVerificationEmail(email, user.firstName, verificationToken);

        res.json({success: true, message: 'Verification email resent.'});
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

module.exports = router;
