import Book from '../models/Book.js';
import sanitize from 'mongo-sanitize';

const resolvers = {
    books: async ({filter = {}}, context) => {
        const {
            search,
            category,
            author,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12,
            isActive,
        } = sanitize(filter);

        const query = {};

        if (context.user.role !== 'admin') {
            query.isActive = true;
        } else if (isActive !== undefined && isActive !== null) {
            query.isActive = isActive;
        }

        if (search)
            query.$text = {$search: search};
        if (category)
            query.category = category;
        if (author)
            query.author = {$regex: author, $options: 'i'};

        const allowedSortFields = ['title', 'author', 'createdAt', 'publishedYear'];
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const sortOptions = {[sortField]: sortOrder === 'asc' ? 1 : -1};

        const pageNum = Math.max(1, page);
        const limitNum = Math.min(50, Math.max(1, limit));
        const skip = (pageNum - 1) * limitNum;

        const [books, total] = await Promise.all([
            Book.find(query)
                .populate('createdBy', 'firstName lastName email role')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Book.countDocuments(query),
        ]);

        return {
            books,
            total,
            page: pageNum,
            totalPages: Math.ceil(total / limitNum),
        };
    },

    book: async ({id}, context) => {
        const book = await
            Book.findById(id)
                .populate('createdBy', 'firstName lastName email role')
                .lean();

        if (!book)
            return null;
        if (!book.isActive && context.user?.role !== 'admin')
            return null;

        return book;
    },

    categories: async () => {
        const categories = await
            Book.distinct('category', {isActive: true});
        return categories.sort();
    },

    createBook: async ({input}, context) => {
        if (!context.user)
            throw new Error('Authentication required');
        if (context.user.role !== 'admin')
            throw new Error('Admin access required');

        const book = new Book({...sanitize(input), createdBy: context.user._id});
        await book.save();
        await book.populate('createdBy', 'firstName lastName email role');

        return {success: true, message: 'Book created successfully', book};
    },

    updateBook: async ({id, input}, context) => {
        if (!context.user)
            throw new Error('Authentication required');
        if (context.user.role !== 'admin')
            throw new Error('Admin access required');

        const book = await Book.findByIdAndUpdate(id, sanitize(input), {
            new: true,
            runValidators: true,
        }).populate('createdBy', 'firstName lastName email role');

        if (!book)
            throw new Error('Book not found');

        return {success: true, message: 'Book updated successfully', book};
    },

    deleteBook: async ({id}, context) => {
        if (!context.user)
            throw new Error('Authentication required');
        if (context.user.role !== 'admin')
            throw new Error('Admin access required');

        const book = await Book.findByIdAndDelete(id);
        if (!book)
            throw new Error('Book not found');

        return {success: true, message: 'Book deleted successfully', book: null};
    },

    toggleBookStatus: async ({id}, context) => {
        if (!context.user)
            throw new Error('Authentication required');
        if (context.user.role !== 'admin')
            throw new Error('Admin access required');

        const book = await Book.findById(id);
        if (!book)
            throw new Error('Book not found');

        book.isActive = !book.isActive;
        await book.save();

        return {
            success: true,
            message: `Book ${book.isActive ? 'activated' : 'deactivated'} successfully`,
            book,
        };
    },
};

export default resolvers;
