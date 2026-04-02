import path from "node:path";
import fs from "node:fs";
import express from "express";
import {body, validationResult} from "express-validator";
import sanitize from "mongo-sanitize";
import Book from "../models/Book.js";
import {authenticate, optionalAuth, requireAdmin} from "../utils/authChecks.js";

const router = express.Router();

router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            search,
            category,
            author,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12,
            isActive,
        } = sanitize(req.query);

        const filter = {};

        if (req.user?.role !== 'admin') {
            filter.isActive = true;
        } else if (isActive !== undefined) {
            filter.isActive = isActive === 'true';
        }

        if (search)
            filter.$text = {$search: search};
        if (category)
            filter.category = category;
        if (author)
            filter.author = {$regex: author, $options: 'i'};

        const sortOptions = {};
        const allowedSortFields = ['title', 'author', 'createdAt', 'publishedYear'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;

        const pageNum = Math.max(1, page);
        const limitNum = Math.min(50, Math.max(1, limit));
        const skip = (pageNum - 1) * limitNum;

        const [books, total] = await Promise.all([
            Book.find(filter)
                .populate('createdBy', 'firstName lastName email')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Book.countDocuments(filter),
        ]);

        res.json({
            success: true,
            data: books,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

router.get('/categories', async (req, res) => {
    try {
        const categories = await Book.distinct('category', {isActive: true});
        res.json({success: true, data: categories.toSorted()});
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const book = await
            Book.findById(req.params.id)
                .populate('createdBy', 'firstName lastName');

        if (!book) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }

        if (!book.isActive && (req.user?.role !== 'admin')) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }

        res.json({success: true, data: book});
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({success: false, message: 'Book not found'});
        }
        res.status(500).json({success: false, message: 'Server error'});
    }
});

router.post(
    '/',
    authenticate,
    requireAdmin,
    [
        body('title').trim().notEmpty().withMessage('Title is required').isLength({max: 200}),
        body('author').trim().notEmpty().withMessage('Author is required').isLength({max: 100}),
        body('category').notEmpty().withMessage('Category is required'),
        body('description').optional().isLength({max: 2000}),
        body('publishedYear').optional().isInt({min: 1000, max: new Date().getFullYear()}),
        body('pageCount').optional().isInt({min: 1}),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        try {
            const bookData = sanitize({...req.body, createdBy: req.user._id});
            const book = new Book(bookData);
            await book.save();
            await book.populate('createdBy', 'firstName lastName');

            res.status(201).json({success: true, data: book, message: 'Book created successfully'});
        } catch (error) {
            if (error.code === 11000) {
                return res.status(409).json({success: false, message: 'A book with this ISBN already exists'});
            }
            console.error('Create book error:', error);
            res.status(500).json({success: false, message: 'Server error'});
        }
    }
);

router.put(
    '/:id',
    authenticate,
    requireAdmin,
    [
        body('title').optional().trim().notEmpty().isLength({max: 200}),
        body('author').optional().trim().notEmpty().isLength({max: 100}),
        body('description').optional().isLength({max: 2000}),
        body('publishedYear').optional().isInt({min: 1000, max: new Date().getFullYear()}),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({success: false, errors: errors.array()});
        }

        try {
            const allowedFields = ['title', 'author', 'description', 'category', 'path', 'coverImage', 'publishedYear', 'isbn', 'language', 'pageCount'];
            const updateData = {};
            allowedFields.forEach((field) => {
                if (req.body[field] !== undefined) updateData[field] = req.body[field];
            });

            const book = await Book.findByIdAndUpdate(
                req.params.id,
                sanitize(updateData),
                {new: true, runValidators: true}
            ).populate('createdBy', 'firstName lastName');

            if (!book) {
                return res.status(404).json({success: false, message: 'Book not found'});
            }

            res.json({success: true, data: book, message: 'Book updated successfully'});
        } catch (error) {
            if (error.name === 'CastError') {
                return res.status(404).json({success: false, message: 'Book not found'});
            }
            console.error('Update book error:', error);
            res.status(500).json({success: false, message: 'Server error'});
        }
    }
);

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }
        res.json({success: true, message: 'Book deleted successfully'});
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({success: false, message: 'Book not found'});
        }
        console.error('Delete book error:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

router.patch('/:id/toggle-status', authenticate, requireAdmin, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }

        book.isActive = !book.isActive;
        await book.save();

        res.json({
            success: true,
            data: book,
            message: `Book ${book.isActive ? 'activated' : 'deactivated'} successfully`,
        });
    } catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

router.get('/:id/download', authenticate, requireAdmin, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({success: false, message: 'Book not found'});
        }

        if (!book.path) {
            return res.status(404).json({success: false, message: 'No file path associated with this book'});
        }

        const filePath = path.resolve(book.path);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({success: false, message: 'File not found on server'});
        }

        res.download(filePath);
    } catch (error) {
        console.error('Download book error:', error);
        res.status(500).json({success: false, message: 'Server error'});
    }
});

export default router;
