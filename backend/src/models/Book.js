import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
            maxlength: [100, 'Author name cannot exceed 100 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            enum: [
                'Fiction',
                'Non-Fiction',
                'Science',
                'History',
                'Technology',
                'Philosophy',
                'Biography',
                'Literature',
                'Art',
                'Poetry',
                'Children',
                'Mystery',
                'Fantasy',
                'Science Fiction',
                'Romance',
                'Self-Help',
                'Other',
            ],
        },
        path: {
            type: String,
            trim: true,
        },
        coverImage: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        publishedYear: {
            type: Number,
            min: [1000, 'Invalid year'],
            max: [new Date().getFullYear(), 'Year cannot be in the future'],
        },
        isbn: {
            type: String,
            trim: true,
            unique: true,
            sparse: true,
        },
        language: {
            type: String,
            trim: true,
            default: 'English',
        },
        pageCount: {
            type: Number,
            min: 1,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

bookSchema.index({title: 'text', author: 'text', description: 'text'});
bookSchema.index({category: 1});
bookSchema.index({isActive: 1});

module.exports = mongoose.model('Book', bookSchema);
