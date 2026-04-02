import React, {useState, useEffect} from 'react';
import {Book, BookFormData, CATEGORIES} from '@/models/book.ts';

interface Props {
    isOpen: boolean;
    book?: Book | null;
    onSave: (data: Partial<BookFormData>) => Promise<void>;
    onClose: () => void;
}

const empty: BookFormData = {
    title: '', author: '', description: '', category: 'Fiction',
    path: '', coverImage: '', publishedYear: '', isbn: '', language: 'English', pageCount: '',
};

const BookFormModal: React.FC<Props> = ({isOpen, book, onSave, onClose}) => {
    const [form, setForm] = useState<BookFormData>(empty);
    const [errors, setErrors] = useState<Partial<BookFormData>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (book) {
            setForm({
                title: book.title,
                author: book.author,
                description: book.description || '',
                category: book.category,
                path: book.path || '',
                coverImage: book.coverImage || '',
                publishedYear: book.publishedYear ? String(book.publishedYear) : '',
                isbn: book.isbn || '',
                language: book.language || 'English',
                pageCount: book.pageCount ? String(book.pageCount) : '',
            });
        } else {
            setForm(empty);
        }
        setErrors({});
    }, [book, isOpen]);

    const validate = (): boolean => {
        const e: Partial<BookFormData> = {};
        if (!form.title.trim()) e.title = 'Title is required';
        if (!form.author.trim()) e.author = 'Author is required';
        if (!form.category) e.category = 'Category is required';
        if (form.publishedYear && (Number.isNaN(+form.publishedYear)
            || +form.publishedYear < 1000
            || +form.publishedYear > new Date().getFullYear())) {
            e.publishedYear = 'Invalid year';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        try {
            const payload: Partial<BookFormData> = {...form};
            await onSave(payload);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const set = (key: keyof BookFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({...prev, [key]: e.target.value}));
        if (errors[key]) setErrors((prev) => ({...prev, [key]: undefined}));
    };

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
                <div
                    className="flex items-center justify-between px-6 py-4 border-b border-parchment-200 bg-parchment-50 rounded-t-xl">
                    <div>
                        <h2 className="font-display text-xl font-bold text-ink">{book ? 'Edit Book' : 'Add New Book'}</h2>
                        <p className="font-sans text-xs text-ink-400 mt-0.5">{book ? 'Update the book details below' : 'Fill in the details to add a book to the catalog'}</p>
                    </div>
                    <button onClick={onClose}
                            className="p-2 hover:bg-parchment-200 rounded transition-colors text-ink-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Title<span className="text-red-500">*</span></label>
                            <input value={form.title} onChange={set('title')}
                                   className={`input-field ${errors.title ? 'border-red-400' : ''}`}
                                   placeholder="Book title"/>
                            {errors.title && <p className="text-red-500 text-xs mt-1 font-sans">{errors.title}</p>}
                        </div>
                        <div>
                            <label className="label">Author <span className="text-red-500">*</span></label>
                            <input value={form.author} onChange={set('author')}
                                   className={`input-field ${errors.author ? 'border-red-400' : ''}`}
                                   placeholder="Author name"/>
                            {errors.author && <p className="text-red-500 text-xs mt-1 font-sans">{errors.author}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Category <span className="text-red-500">*</span></label>
                            <select value={form.category} onChange={set('category')}
                                    className={`input-field ${errors.category ? 'border-red-400' : ''}`}>
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Published Year</label>
                            <input value={form.publishedYear} onChange={set('publishedYear')}
                                   className={`input-field ${errors.publishedYear ? 'border-red-400' : ''}`}
                                   placeholder="e.g. 2023" type="number" min="1000" max={new Date().getFullYear()}/>
                            {errors.publishedYear &&
                                <p className="text-red-500 text-xs mt-1 font-sans">{errors.publishedYear}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="label">Description</label>
                        <textarea value={form.description} onChange={set('description')} rows={3}
                                  className="input-field resize-none" placeholder="Brief description of the book…"/>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="label">ISBN</label>
                            <input value={form.isbn} onChange={set('isbn')} className="input-field" placeholder="ISBN"/>
                        </div>
                        <div>
                            <label className="label">Language</label>
                            <input value={form.language} onChange={set('language')} className="input-field"
                                   placeholder="English"/>
                        </div>
                        <div>
                            <label className="label">Pages</label>
                            <input value={form.pageCount} onChange={set('pageCount')} className="input-field"
                                   placeholder="350" type="number" min="1"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">File Path</label>
                            <input value={form.path} onChange={set('path')} className="input-field"
                                   placeholder="/files/book.pdf"/>
                            <p className="font-sans text-xs text-ink-300 mt-1">Server path to the book file</p>
                        </div>
                        <div>
                            <label className="label">Cover Image URL</label>
                            <input value={form.coverImage} onChange={set('coverImage')} className="input-field"
                                   placeholder="https://…"/>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-parchment-200">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={saving} className="btn-primary min-w-[120px]">
                            {saving ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4"/>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                </svg>
                            ) : (book ? 'Save Changes' : 'Add Book')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookFormModal;
