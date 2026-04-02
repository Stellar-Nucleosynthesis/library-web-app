import React, {useState, useEffect} from 'react';
import {BookFilters, CATEGORIES} from '@/models/book';

interface Props {
    filters: BookFilters;
    onChange: (filters: BookFilters) => void;
    isAdmin?: boolean;
}

const SearchBar: React.FC<Props> = ({filters, onChange, isAdmin}) => {
    const [localSearch, setLocalSearch] = useState(filters.search || '');
    const filtersRef = React.useRef(filters);
    useEffect(() => {
        filtersRef.current = filters;
    }, [filters]);

    useEffect(() => {
        const timer = setTimeout(() => {
            onChange({...filtersRef.current, search: localSearch, page: 1});
        }, 400);
        return () => clearTimeout(timer);
    }, [localSearch, onChange]);

    const handleChange = (key: keyof BookFilters, value: string) => {
        onChange({...filters, [key]: value, page: 1});
    };

    const clearFilters = () => {
        setLocalSearch('');
        onChange({page: 1, limit: filters.limit});
    };

    const hasFilters = localSearch || filters.category || filters.author || filters.sortBy !== 'createdAt';

    return (
        <div className="bg-cream border border-parchment-200 rounded-lg p-4 shadow-sm space-y-3">
            <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-300" fill="none"
                     stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                    type="text"
                    placeholder="Search by title, author, or keyword…"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="input-field pl-9 pr-4 py-2.5"
                />
                {localSearch && (
                    <button
                        onClick={() => setLocalSearch('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                )}
            </div>

            <div className="flex flex-wrap gap-2">
                <select
                    value={filters.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="input-field py-2 flex-1 min-w-[140px] text-sm"
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                <select
                    value={filters.sortBy || 'createdAt'}
                    onChange={(e) => handleChange('sortBy', e.target.value)}
                    className="input-field py-2 flex-1 min-w-[130px] text-sm"
                >
                    <option value="createdAt">Recently Added</option>
                    <option value="title">Title A–Z</option>
                    <option value="author">Author A–Z</option>
                    <option value="publishedYear">Year</option>
                </select>

                <select
                    value={filters.sortOrder || 'desc'}
                    onChange={(e) => handleChange('sortOrder', e.target.value as 'asc' | 'desc')}
                    className="input-field py-2 min-w-[100px] text-sm"
                >
                    <option value="desc">Desc</option>
                    <option value="asc">Asc</option>
                </select>

                {isAdmin && (
                    <select
                        value={filters.isActive || ''}
                        onChange={(e) => handleChange('isActive', e.target.value)}
                        className="input-field py-2 min-w-[120px] text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                )}

                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="btn-ghost text-sm py-2 px-3 text-leather-500"
                    >
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
