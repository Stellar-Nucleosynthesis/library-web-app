import jwt from "jsonwebtoken";
import User from "../models/User";

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({success: false, message: 'Authentication required'});
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({success: false, message: 'User not found'});
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({success: false, message: 'Token expired'});
        }
        return res.status(401).json({success: false, message: 'Invalid token'});
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({success: false, message: 'Admin access required'});
    }
    next();
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            req.user = user || null;
        }
    } catch {
        req.user = null;
    }
    next();
};

module.exports = {authenticate, requireAdmin, optionalAuth};
