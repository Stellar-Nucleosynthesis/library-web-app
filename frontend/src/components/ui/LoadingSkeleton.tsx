import React from 'react';

export const BookCardSkeleton: React.FC = () => (
    <div className="card overflow-hidden animate-pulse">
        <div className="aspect-[2/3] shimmer"/>
        <div className="p-4 space-y-2">
            <div className="h-3 shimmer rounded w-16"/>
            <div className="h-4 shimmer rounded w-3/4"/>
            <div className="h-3 shimmer rounded w-1/2"/>
            <div className="h-3 shimmer rounded w-full"/>
            <div className="h-3 shimmer rounded w-2/3"/>
        </div>
    </div>
);

export const BookGridSkeleton: React.FC<{ count?: number }> = ({count = 12}) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: count }, (_, i) => (
            <BookCardSkeleton key={`bool_card_${i}`}/>
        ))}
    </div>
);

export const BookDetailSkeleton: React.FC = () => (
    <div className="page-container animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="aspect-[2/3] shimmer rounded-lg col-span-1"/>
            <div className="col-span-2 space-y-4">
                <div className="h-8 shimmer rounded w-3/4"/>
                <div className="h-5 shimmer rounded w-1/3"/>
                <div className="h-4 shimmer rounded w-1/4"/>
                <div className="space-y-2 mt-6">
                    <div className="h-3 shimmer rounded"/>
                    <div className="h-3 shimmer rounded"/>
                    <div className="h-3 shimmer rounded w-4/5"/>
                </div>
            </div>
        </div>
    </div>
);
