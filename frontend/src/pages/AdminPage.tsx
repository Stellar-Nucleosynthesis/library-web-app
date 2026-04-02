import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {useAuth} from '@/authContext/useAuth';
import {booksApi} from '@/service/bookService';
import {graphqlApi} from '@/service/graphqlService';
import {Book, BookFilters, BookFormData} from '@/models/book';
import {PaginationInfo} from '@/models/api';
import SearchBar from '../components/books/SearchBar';
import BookFormModal from '../components/admin/BookFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Pagination from '../components/ui/Pagination';
import {BookGridSkeleton} from '../components/ui/LoadingSkeleton';

type ApiMode = 'rest' | 'graphql';

const AdminPage: React.FC = () => {
    const {user, isAdmin} = useAuth();
    const navigate = useNavigate();

    const [books, setBooks] = useState<Book[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<BookFilters>({page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc'});
    const [apiMode, setApiMode] = useState<ApiMode>('rest');

    const [formOpen, setFormOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deletingBook, setDeletingBook] = useState<Book | null>(null);

    const [stats, setStats] = useState({total: 0, active: 0, inactive: 0, categories: 0});

    useEffect(() => {
        if (!isAdmin) navigate('/', {replace: true});
    }, [isAdmin, navigate]);

    const fetchBooks = useCallback(async (f: BookFilters) => {
        setLoading(true);
        try {
            if (apiMode === 'graphql') {
                const data = await graphqlApi.getBooks({
                    ...f,
                    isActive: f.isActive ? (f.isActive === 'true') as unknown as string : undefined
                });
                setBooks(data.books);
                setPagination({total: data.total, page: data.page, limit: f.limit || 12, totalPages: data.totalPages});
            } else {
                const res = await booksApi.getBooks(f);
                if (res.success && res.data) {
                    setBooks(res.data);
                    if (res.pagination) setPagination(res.pagination);
                }
            }
        } catch (err) {
            toast.error('Failed to load books: ' + err);
        } finally {
            setLoading(false);
        }
    }, [apiMode]);

    useEffect(() => {
        fetchBooks(filters);
    }, [filters, fetchBooks]);

    const fetchStats = useCallback(async () => {
        const [all, active, inactive, cats] = await Promise.all([
            booksApi.getBooks({limit: 1}),
            booksApi.getBooks({limit: 1, isActive: 'true'}),
            booksApi.getBooks({limit: 1, isActive: 'false'}),
            booksApi.getCategories(),
        ]);
        setStats({
            total: all.pagination?.total || 0,
            active: active.pagination?.total || 0,
            inactive: inactive.pagination?.total || 0,
            categories: cats.data?.length || 0,
        });
    }, []);

    useEffect(() => {
        fetchStats().catch(() => {
        });
    }, [fetchStats]);

    const handleCreate = async (data: Partial<BookFormData>) => {
        if (apiMode === 'graphql') {
            const res = await graphqlApi.createBook(data);
            if (res.success)
                toast.success(res.message || 'Book created!');
            else
                throw new Error(res.message);
        } else {
            const res = await booksApi.createBook(data);
            if (res.success)
                toast.success(res.message || 'Book created!');
            else
                throw new Error(res.message);
        }
        await fetchBooks(filters);
        await fetchStats();
    };

    const handleUpdate = async (data: Partial<BookFormData>) => {
        if (!editingBook) return;
        if (apiMode === 'graphql') {
            const res = await graphqlApi.updateBook(editingBook._id, data);
            if (res.success)
                toast.success(res.message || 'Book updated!');
            else
                throw new Error(res.message);
        } else {
            const res = await booksApi.updateBook(editingBook._id, data);
            if (res.success)
                toast.success(res.message || 'Book updated!');
            else
                throw new Error(res.message);
        }
        await fetchBooks(filters);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            if (apiMode === 'graphql') {
                await graphqlApi.deleteBook(deleteId);
            } else {
                await booksApi.deleteBook(deleteId);
            }
            toast.success('Book deleted');
            setBooks((prev) => prev.filter((b) => b._id !== deleteId));
            setDeleteId(null);
            setDeletingBook(null);
        } catch {
            toast.error('Failed to delete book');
        }
        await fetchStats();
    };

    const handleToggleStatus = async (id: string) => {
        try {
            if (apiMode === 'graphql') {
                const res = await graphqlApi.toggleBookStatus(id);
                toast.success(res.message);
                setBooks((prev) => prev.map((b) => b._id === id ? {...b, isActive: res.book.isActive} : b));
            } else {
                const res = await booksApi.toggleStatus(id);
                if (res.success && res.data) {
                    toast.success(res.message || 'Status toggled');
                    setBooks((prev) => prev.map((b) => b._id === id ? res.data! : b));
                }
            }
        } catch {
            toast.error('Failed to toggle status');
        }
    };

    const openEdit = (book: Book) => {
        setEditingBook(book);
        setFormOpen(true);
    };

    const openDelete = (id: string) => {
        setDeleteId(id);
        setDeletingBook(books.find((b) => b._id === id) || null);
    };

    const handleFilterChange = useCallback((f: BookFilters) => {
        setFilters({...f, limit: 12});
    }, []);

    if (!isAdmin)
        return null;

    return (
        <div className="page-container animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="section-title">Admin Dashboard</h1>
                    <p className="font-body text-sm text-ink-400 italic mt-1">
                        Welcome back, {user?.firstName}. Manage the library catalog below.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-parchment-200 rounded-lg p-0.5">
                        {(['rest', 'graphql'] as ApiMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setApiMode(mode)}
                                className={`px-3 py-1.5 rounded-md font-sans text-xs font-medium transition-all ${
                                    apiMode === mode
                                        ? 'bg-cream shadow-sm text-leather-700'
                                        : 'text-ink-400 hover:text-ink-600'
                                }`}
                            >
                                {mode === 'rest' ? 'REST API' : 'GraphQL'}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => {
                            setEditingBook(null);
                            setFormOpen(true);
                        }}
                        className="btn-primary"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Book
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    {label: 'Total Books', value: stats.total, icon: '📚', color: 'bg-leather-50 border-leather-200'},
                    {label: 'Active', value: stats.active, icon: '✅', color: 'bg-green-50 border-green-200'},
                    {label: 'Inactive', value: stats.inactive, icon: '⏸️', color: 'bg-gray-50 border-gray-200'},
                    {label: 'Categories', value: stats.categories, icon: '🏷️', color: 'bg-amber-50 border-amber-200'},
                ].map((s) => (
                    <div key={s.label} className={`card ${s.color} p-5 flex items-center gap-4`}>
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                            <p className="font-display text-2xl font-bold text-ink">{s.value}</p>
                            <p className="font-sans text-xs text-ink-400">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-medium mb-4 ${
                    apiMode === 'graphql' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"/>
                Fetching via {apiMode === 'graphql' ? 'GraphQL' : 'REST API'}
            </div>

            <div className="mb-6">
                <SearchBar filters={filters} onChange={handleFilterChange} isAdmin/>
            </div>

            {loading ? (
                <BookGridSkeleton count={8}/>
            ) : books.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-5xl mb-3">📂</div>
                    <h3 className="font-display text-xl text-ink">No books found</h3>
                    <p className="font-body text-sm text-ink-400 italic mt-1">Try adjusting filters or add a new
                        book</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="bg-parchment-100 border-b border-parchment-200">
                                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-ink-500 uppercase tracking-wider">Book</th>
                                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-ink-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-ink-500 uppercase tracking-wider hidden md:table-cell">Year</th>
                                <th className="text-left px-4 py-3 font-sans text-xs font-semibold text-ink-500 uppercase tracking-wider">Status</th>
                                <th className="text-right px-4 py-3 font-sans text-xs font-semibold text-ink-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-parchment-100">
                            {books.map((book) => (
                                <tr key={book._id} className="hover:bg-parchment-50 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-body text-sm font-medium text-ink group-hover:text-leather-600 transition-colors line-clamp-1">{book.title}</p>
                                            <p className="font-sans text-xs text-ink-400">{book.author}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 hidden sm:table-cell">
                                        <span className="badge-category text-xs">{book.category}</span>
                                    </td>
                                    <td className="px-4 py-3 hidden md:table-cell">
                                        <span
                                            className="font-sans text-sm text-ink-400">{book.publishedYear || '—'}</span>
                                    </td>
                                    <td className="px-4 py-3">
                      <span className={book.isActive ? 'badge-active' : 'badge-inactive'}>
                        {book.isActive ? 'Active' : 'Inactive'}
                      </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEdit(book)}
                                                className="p-1.5 text-ink-400 hover:text-leather-600 hover:bg-parchment-100 rounded transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(book._id)}
                                                className={`p-1.5 rounded transition-colors ${
                                                    book.isActive
                                                        ? 'text-amber-600 hover:bg-amber-50'
                                                        : 'text-green-600 hover:bg-green-50'
                                                }`}
                                                title={book.isActive ? 'Deactivate' : 'Activate'}
                                            >
                                                {book.isActive ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                    </svg>
                                                )}
                                            </button>
                                            {book.path && (
                                                <button
                                                    onClick={() => booksApi.downloadBook(book._id, book.title).catch(() => toast.error('Download failed'))}
                                                    className="p-1.5 text-ink-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                    title="Download"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                         viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                                    </svg>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => openDelete(book._id)}
                                                className="p-1.5 text-ink-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor"
                                                     viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {pagination && (
                <Pagination
                    pagination={pagination}
                    onPageChange={(page) => setFilters((f) => ({...f, page}))}
                />
            )}

            <BookFormModal
                isOpen={formOpen}
                book={editingBook}
                onSave={editingBook ? handleUpdate : handleCreate}
                onClose={() => {
                    setFormOpen(false);
                    setEditingBook(null);
                }}
            />
            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Book"
                message={`Permanently delete "${deletingBook?.title}"? This cannot be undone.`}
                confirmLabel="Delete"
                dangerous
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteId(null);
                    setDeletingBook(null);
                }}
            />
        </div>
    );
};

export default AdminPage;
