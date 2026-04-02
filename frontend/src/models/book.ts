export const CATEGORIES = [
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
] as const;

export type Category = typeof CATEGORIES[number];

export interface Book {
    _id: string;
    title: string;
    author: string;
    description?: string;
    category: Category;
    path?: string;
    coverImage?: string;
    isActive: boolean;
    publishedYear?: number;
    isbn?: string;
    language?: string;
    pageCount?: number;
    createdBy?: {
        _id: string;
        firstName: string;
        lastName: string;
        email?: string;
    };
    createdAt: string;
    updatedAt: string;
}

export interface BookFilters {
    search?: string;
    category?: string;
    author?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    isActive?: string;
}

export interface BookFormData {
    title: string;
    author: string;
    description: string;
    category: string;
    path: string;
    coverImage: string;
    publishedYear: string;
    isbn: string;
    language: string;
    pageCount: string;
}