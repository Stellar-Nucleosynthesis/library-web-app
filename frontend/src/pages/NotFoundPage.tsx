import React from 'react';
import {Link} from 'react-router-dom';

const NotFoundPage: React.FC = () => (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="text-center max-w-md">
            <div className="font-display text-9xl font-bold text-parchment-300 leading-none mb-2">404</div>
            <div className="text-5xl mb-4">📖</div>
            <h1 className="font-display text-3xl font-bold text-ink mb-3">Page Not Found</h1>
            <p className="font-body text-base text-ink-400 italic leading-relaxed mb-8">
                Like a book missing from the shelf, this page seems to have wandered off.
            </p>
            <div className="flex gap-3 justify-center">
                <Link to="/" className="btn-secondary">Go Home</Link>
                <Link to="/catalog" className="btn-primary">Browse Catalog</Link>
            </div>
        </div>
    </div>
);

export default NotFoundPage;
