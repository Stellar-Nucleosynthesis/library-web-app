import React from 'react';
import {Link} from 'react-router-dom';
import type {Book} from '@/models/book';

const SPINE_COLORS = [
    'from-leather-400 to-leather-600',
    'from-amber-400 to-amber-600',
    'from-green-700 to-green-900',
    'from-blue-700 to-blue-900',
    'from-red-700 to-red-900',
    'from-purple-700 to-purple-900',
    'from-teal-600 to-teal-800',
];

function getSpineColor(title: string): string {
    let sum = 0;
    for (const c of title) {
        sum += (c?.codePointAt(0) ?? 63);
    }
    return SPINE_COLORS[sum % SPINE_COLORS.length];
}

function getInitials(title: string): string {
    return title
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

interface Props {
    book: Book;
    isAdmin?: boolean;
    onToggleStatus?: (id: string) => void;
    onEdit?: (book: Book) => void;
    onDelete?: (id: string) => void;
}

const BookCard: React.FC<Props> = ({book, isAdmin, onToggleStatus, onEdit, onDelete}) => {
    const spineColor = getSpineColor(book.title);
    const initials = getInitials(book.title);

    return (
        <div
            className={`card book-card overflow-hidden animate-fade-in flex flex-col ${book.isActive ? '' : 'opacity-60'}`}>
            <Link to={`/book/${book._id}`}
                  className="block relative aspect-[2/3] overflow-hidden bg-parchment-200 flex-shrink-0">
                {book.coverImage ? (
                    <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                        }}
                    />
                ) : (
                    <div
                        className={`w-full h-full bg-gradient-to-b ${spineColor} flex flex-col items-center justify-center p-4 relative`}>
                        <div className="absolute inset-0 opacity-10">
                            {Array.from({length: 8}, (_, i) => (
                                <div
                                    key={`book_el_${i}`}
                                    className="border-b border-white/30"
                                    style={{height: `${100 / 8}%`}}
                                />
                            ))}
                        </div>
                        <span className="font-display text-4xl font-bold text-white/80 z-10">{initials}</span>
                        <div className="mt-3 w-10 h-0.5 bg-white/40 z-10"/>
                    </div>
                )}
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/20 to-transparent"/>

                {!book.isActive && (
                    <div className="absolute top-2 right-2">
                        <span className="badge-inactive text-xs px-2 py-0.5">Inactive</span>
                    </div>
                )}
            </Link>

            <div className="p-4 flex flex-col flex-1">
                <div className="flex-1">
                    <span className="badge-category text-xs mb-2 inline-block">{book.category}</span>
                    <Link to={`/book/${book._id}`}>
                        <h3 className="font-display text-base font-bold text-ink leading-tight mb-1 hover:text-leather-600 transition-colors line-clamp-2">
                            {book.title}
                        </h3>
                    </Link>
                    <p className="font-sans text-sm text-ink-400 mb-2">{book.author}</p>

                    {book.publishedYear && (
                        <p className="font-sans text-xs text-ink-300">{book.publishedYear}</p>
                    )}

                    {book.description && (
                        <p className="font-body text-xs text-ink-400 mt-2 line-clamp-2 italic leading-relaxed">
                            {book.description}
                        </p>
                    )}
                </div>

                {isAdmin && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-parchment-200">
                        <button
                            onClick={() => onEdit?.(book)}
                            className="flex-1 text-xs btn-secondary py-1.5 px-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onToggleStatus?.(book._id)}
                            className={`flex-1 text-xs py-1.5 px-2 rounded border font-sans font-medium transition-colors ${
                                book.isActive
                                    ? 'border-amber-500 text-amber-700 hover:bg-amber-50'
                                    : 'border-green-500 text-green-700 hover:bg-green-50'
                            }`}
                        >
                            {book.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                            onClick={() => onDelete?.(book._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookCard;
