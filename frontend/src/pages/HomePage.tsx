import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {booksApi} from '@/service/bookService';
import type {Book} from '../models/book';
import BookCard from '../components/books/BookCard';
import {BookCardSkeleton} from '../components/ui/LoadingSkeleton';

const HERO_CATEGORIES = ['Fiction', 'Science', 'History', 'Philosophy', 'Technology'];

const HomePage: React.FC = () => {
    const [recentBooks, setRecentBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        booksApi.getBooks({limit: 6, sortBy: 'createdAt', sortOrder: 'desc'}).then((res) => {
            if (res.success && res.data) setRecentBooks(res.data);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen animate-fade-in">
            <section className="relative overflow-hidden bg-ink py-20 px-4">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(196,149,112,0.3) 39px, rgba(196,149,112,0.3) 40px)',
                    }}/>
                </div>
                <div
                    className="absolute top-0 left-0 w-64 h-64 bg-amber-book/10 rounded-full -translate-x-1/2 -translate-y-1/2"/>
                <div
                    className="absolute bottom-0 right-0 w-96 h-96 bg-leather-700/20 rounded-full translate-x-1/3 translate-y-1/3"/>

                <div className="relative max-w-4xl mx-auto text-center">
                    <div
                        className="inline-flex items-center gap-2 bg-amber-book/20 border border-amber-book/30 rounded-full px-4 py-1.5 mb-6">
                        <span className="text-amber-book text-sm font-sans">Welcome to the Library</span>
                    </div>
                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-parchment-100 leading-tight mb-6 text-balance">
                        Every Story
                        <br/>
                        <em className="text-amber-book not-italic">Finds Its Reader</em>
                    </h1>
                    <p className="font-body text-lg text-parchment-400 max-w-xl mx-auto leading-relaxed mb-10">
                        Discover thousands of books across every genre. Browse, search, and explore our curated digital
                        library catalog.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link to="/catalog" className="btn-primary text-base px-8 py-3">
                            Browse Catalog
                        </Link>
                        <Link to="/register"
                              className="inline-flex items-center gap-2 px-8 py-3 border border-parchment-600 text-parchment-300 rounded font-sans font-medium hover:border-amber-book hover:text-amber-book transition-colors text-base">
                            Join Free
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-parchment-100 border-b border-parchment-200 py-4 px-4">
                <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto pb-1">
                    <span className="font-sans text-xs font-medium text-ink-400 whitespace-nowrap flex-shrink-0">Browse by:</span>
                    {HERO_CATEGORIES.map((cat) => (
                        <Link
                            key={cat}
                            to={`/catalog?category=${cat}`}
                            className="flex-shrink-0 badge-category hover:bg-parchment-300 transition-colors text-xs px-3 py-1.5"
                        >
                            {cat}
                        </Link>
                    ))}
                    <Link to="/catalog"
                          className="flex-shrink-0 font-sans text-xs text-leather-500 hover:text-leather-700 transition-colors whitespace-nowrap">
                        View all →
                    </Link>
                </div>
            </section>

            <section className="page-container">
                <div className="flex items-baseline justify-between mb-6">
                    <div>
                        <h2 className="section-title">Recently Added</h2>
                        <p className="font-body text-sm text-ink-400 italic mt-1">The newest additions to our
                            collection</p>
                    </div>
                    <Link to="/catalog"
                          className="font-sans text-sm text-leather-500 hover:text-leather-700 transition-colors">
                        View all →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Array.from({length: 6}).map((_, i) => <BookCardSkeleton key={i}/>)}
                    </div>
                ) : recentBooks.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {recentBooks.map((book) => (
                            <BookCard key={book._id} book={book}/>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-ink-300">
                        <div className="text-5xl mb-3">📖</div>
                        <p className="font-body italic">The shelves are being filled…</p>
                    </div>
                )}
            </section>

            <section className="bg-leather-800 py-14 px-4 mt-8">
                <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    {[
                        {icon: '🔍', title: 'Advanced Search', desc: 'Find any book by title, author, or keyword'},
                        {icon: '📂', title: 'Rich Catalog', desc: 'Organized across 17 genres and categories'},
                        {icon: '🛡️', title: 'Secure & Private', desc: 'JWT-authenticated with role-based access'},
                    ].map((f) => (
                        <div key={f.title} className="text-parchment-200">
                            <div className="text-4xl mb-3">{f.icon}</div>
                            <h3 className="font-display text-lg font-semibold text-parchment-100 mb-1">{f.title}</h3>
                            <p className="font-body text-sm text-parchment-400 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
