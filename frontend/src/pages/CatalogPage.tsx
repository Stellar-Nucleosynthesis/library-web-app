import React, {useState, useEffect, useCallback} from 'react';
import {useSearchParams} from 'react-router-dom';
import toast from 'react-hot-toast';
import {booksApi} from '@/service/bookService';
import {Book, BookFilters} from '../models/book';
import {PaginationInfo} from '../models/api';
import BookCard from '../components/books/BookCard';
import SearchBar from '../components/books/SearchBar';
import Pagination from '../components/ui/Pagination';
import {BookGridSkeleton} from '../components/ui/LoadingSkeleton';

const CatalogPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState<Book[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const getFiltersFromParams = useCallback((): BookFilters => ({
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        author: searchParams.get('author') || undefined,
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
        page: Number.parseInt(searchParams.get('page') || '1'),
        limit: 12,
    }), [searchParams]);

    const fetchBooks = useCallback(async (filters: BookFilters) => {
        setLoading(true);
        try {
            const res = await booksApi.getBooks(filters);
            if (res.success && res.data) {
                setBooks(res.data);
                if (res.pagination)
                    setPagination(res.pagination);
            }
        } catch {
            toast.error('Failed to load books');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBooks(getFiltersFromParams());
    }, [searchParams, fetchBooks, getFiltersFromParams]);

    const handleFilterChange = (filters: BookFilters) => {
        const params: Record<string, string> = {};
        if (filters.search)
            params.search = filters.search;
        if (filters.category)
            params.category = filters.category;
        if (filters.author)
            params.author = filters.author;
        if (filters.sortBy && filters.sortBy !== 'createdAt')
            params.sortBy = filters.sortBy;
        if (filters.sortOrder && filters.sortOrder !== 'desc')
            params.sortOrder = filters.sortOrder;
        if (filters.page && filters.page > 1)
            params.page = String(filters.page);
        setSearchParams(params);
    };

    const currentFilters = getFiltersFromParams();

    return (
        <div className="page-container animate-fade-in">
            <div className="mb-6">
                <h1 className="section-title">Book Catalog</h1>
                <p className="font-body text-sm text-ink-400 italic mt-1">
                    Browse our collection — {pagination?.total ?? '…'} books available
                </p>
            </div>

            <div className="mb-6">
                <SearchBar filters={currentFilters} onChange={handleFilterChange}/>
            </div>

            {loading ? (
                <BookGridSkeleton count={12}/>
            ) : books.length === 0 ? (
                <div className="text-center py-24">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="font-display text-2xl text-ink mb-2">No books found</h3>
                    <p className="font-body text-sm text-ink-400 italic">
                        Try adjusting your search or filters
                    </p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {books.map((book) => (
                            <BookCard key={book._id} book={book}/>
                        ))}
                    </div>

                    {pagination && (
                        <Pagination
                            pagination={pagination}
                            onPageChange={(page) => handleFilterChange({...currentFilters, page})}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default CatalogPage;
