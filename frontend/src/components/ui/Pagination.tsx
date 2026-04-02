import React from 'react';
import {PaginationInfo} from '@/models/api';

interface Props {
    pagination: PaginationInfo;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({pagination, onPageChange}) => {
    const {page, totalPages, total, limit} = pagination;
    if (totalPages <= 1)
        return null;

    const start = (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3)
            pages.push('...');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++){
            pages.push(i);
        }
        if (page < totalPages - 2)
            pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8">
            <p className="font-sans text-sm text-ink-400">
                Showing <span className="font-medium text-ink">{start}–{end}</span> of <span
                className="font-medium text-ink">{total}</span> books
            </p>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-parchment-300 text-ink-400 hover:bg-parchment-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>

                {pages.map((p) =>
                    p === '...' ? (
                        <span key={`ellipsis-${p}`}
                              className="w-8 h-8 flex items-center justify-center font-sans text-sm text-ink-300">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded font-sans text-sm transition-colors border ${
                                p === page
                                    ? 'bg-leather-500 text-parchment-100 border-leather-500 font-medium'
                                    : 'border-parchment-300 text-ink-500 hover:bg-parchment-100'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-parchment-300 text-ink-400 hover:bg-parchment-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Pagination;
