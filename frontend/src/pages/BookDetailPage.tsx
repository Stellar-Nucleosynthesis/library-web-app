import React, {useEffect, useState} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';
import {booksApi} from '@/service/bookService';
import {Book} from '../models/book';
import {BookDetailSkeleton} from '../components/ui/LoadingSkeleton';
import {useAuth} from '@/authContext/useAuth';
import BookFormModal from '../components/admin/BookFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const SPINE_COLORS = [
    'from-leather-400 to-leather-700',
    'from-amber-500 to-amber-800',
    'from-green-700 to-green-900',
    'from-blue-700 to-blue-900',
    'from-purple-700 to-purple-900',
];

function getSpineColor(title: string) {
    let s = 0;
    for (const c of title) s += c.codePointAt(0) ?? 63;
    return SPINE_COLORS[s % SPINE_COLORS.length];
}

const BookDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {isAdmin} = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        booksApi.getBook(id).then((res) => {
            if (res.success && res.data) setBook(res.data);
            else navigate('/catalog', {replace: true});
        }).finally(() => setLoading(false));
    }, [id, navigate]);

    const handleToggleStatus = async () => {
        if (!book) return;
        const res = await booksApi.toggleStatus(book._id);
        if (res.success && res.data) {
            setBook(res.data);
            toast.success(res.message || 'Status updated');
        }
    };

    const handleDelete = async () => {
        if (!book) return;
        const res = await booksApi.deleteBook(book._id);
        if (res.success) {
            toast.success('Book deleted');
            navigate('/admin');
        } else {
            toast.error('Failed to delete book');
        }
    };

    const handleEdit = async (data: any) => {
        if (!book) return;
        const res = await booksApi.updateBook(book._id, data);
        if (res.success && res.data) {
            setBook(res.data);
            toast.success('Book updated!');
        } else {
            toast.error('Update failed');
        }
    };

    const handleDownload = async () => {
        if (!book) return;
        try {
            await booksApi.downloadBook(book._id, book.title);
            toast.success('Download started');
        } catch {
            toast.error('Download failed — check file path');
        }
    };

    if (loading)
        return <BookDetailSkeleton/>;
    if (!book)
        return null;

    const spineColor = getSpineColor(book.title);
    const initials = book.title.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase()).join('');

    return (
        <div className="page-container animate-fade-in">
            <nav className="flex items-center gap-2 text-sm font-sans text-ink-400 mb-6">
                <Link to="/" className="hover:text-leather-600 transition-colors">Home</Link>
                <span>/</span>
                <Link to="/catalog" className="hover:text-leather-600 transition-colors">Catalog</Link>
                <span>/</span>
                <span className="text-ink truncate max-w-xs">{book.title}</span>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
                <div className="md:col-span-1">
                    <div
                        className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-book max-w-xs mx-auto md:mx-0">
                        {book.coverImage ? (
                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover"
                                 onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}/>
                        ) : (
                            <div
                                className={`w-full h-full bg-gradient-to-b ${spineColor} flex flex-col items-center justify-center relative`}>
                                <div className="absolute inset-0 opacity-10">
                                    {Array.from({length: 10}, (_, i) => (
                                        <div
                                            key={`elem_details_${i}`}
                                            className="border-b border-white/20"
                                            style={{height: '10%'}}
                                        />
                                    ))}
                                </div>
                                <span className="font-display text-6xl font-bold text-white/70 z-10">{initials}</span>
                                <div className="mt-4 w-14 h-0.5 bg-white/30 z-10"/>
                            </div>
                        )}
                        <div
                            className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/25 to-transparent"/>
                    </div>

                    <div className="mt-3 flex justify-center md:justify-start">
            <span className={book.isActive ? 'badge-active' : 'badge-inactive'}>
              {book.isActive ? '● Active' : '○ Inactive'}
            </span>
                    </div>
                    {isAdmin && (
                        <div className="mt-4 space-y-2">
                            {book.path && (
                                <button onClick={handleDownload} className="btn-primary w-full text-sm py-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                    </svg>
                                    Download File
                                </button>
                            )}
                            <button onClick={() => setEditOpen(true)} className="btn-secondary w-full text-sm py-2">Edit
                                Book
                            </button>
                            <button onClick={handleToggleStatus}
                                    className="btn-ghost w-full text-sm py-2 border border-parchment-300">
                                {book.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => setDeleteOpen(true)}
                                    className="btn-danger w-full text-sm py-2">Delete Book
                            </button>
                        </div>
                    )}
                </div>

                <div className="md:col-span-2 lg:col-span-3">
                    <span className="badge-category mb-3 inline-block">{book.category}</span>
                    <h1 className="font-display text-4xl font-bold text-ink leading-tight mb-2">{book.title}</h1>
                    <p className="font-body text-lg text-leather-600 mb-4">by {book.author}</p>

                    <div className="flex flex-wrap gap-4 mb-6 text-sm font-sans text-ink-400">
                        {book.publishedYear && (
                            <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                {book.publishedYear}
              </span>
                        )}
                        {book.pageCount && (
                            <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                {book.pageCount} pages
              </span>
                        )}
                        {book.language && (
                            <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
                                {book.language}
              </span>
                        )}
                        {book.isbn && (
                            <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path
                    strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
                ISBN: {book.isbn}
              </span>
                        )}
                    </div>

                    <div className="divider"/>

                    {book.description ? (
                        <div>
                            <h3 className="font-display text-xl font-semibold text-ink mb-3">About this Book</h3>
                            <p className="font-body text-base text-ink-500 leading-relaxed drop-cap">{book.description}</p>
                        </div>
                    ) : (
                        <p className="font-body italic text-ink-300">No description available for this title.</p>
                    )}

                    {book.createdBy && (
                        <div className="mt-8 pt-6 border-t border-parchment-200">
                            <p className="font-sans text-xs text-ink-300">
                                Added by <span
                                className="text-ink-500">{book.createdBy.firstName} {book.createdBy.lastName}</span>
                                {' · '}
                                {new Date(book.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <BookFormModal isOpen={editOpen} book={book} onSave={handleEdit} onClose={() => setEditOpen(false)}/>
            <ConfirmDialog
                isOpen={deleteOpen}
                title="Delete Book"
                message={`Are you sure you want to permanently delete "${book.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                dangerous
                onConfirm={handleDelete}
                onCancel={() => setDeleteOpen(false)}
            />
        </div>
    );
};

export default BookDetailPage;
