import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ meta, searchParams, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const currentPage = meta.current_page;
    const lastPage = meta.last_page;

    const handlePage = (pageStr) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageStr);
        onPageChange(params);
    };

    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > lastPage) {
        endPage = lastPage;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl px-6 py-4 rounded-3xl mt-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-white/60 dark:border-zinc-800/60 transition-all">
            <div className="flex-shrink-0 text-center sm:text-left">
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    Showing <span className="font-extrabold text-zinc-900 dark:text-white">{(currentPage - 1) * meta.per_page + 1}</span> to{' '}
                    <span className="font-extrabold text-zinc-900 dark:text-white">{Math.min(currentPage * meta.per_page, meta.total)}</span> of{' '}
                    <span className="font-extrabold text-zinc-900 dark:text-white">{meta.total}</span> products
                </p>
            </div>

            <div className="flex flex-1 justify-center sm:justify-end">
                <nav className="inline-flex items-center gap-1.5 p-1.5 bg-zinc-100/50 dark:bg-zinc-950/50 rounded-full border border-zinc-200/50 dark:border-zinc-800/50">
                    <button
                        onClick={() => handlePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="group relative flex items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:cursor-not-allowed shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-5 h-5 group-active:-translate-x-1 transition-transform" />
                    </button>

                    <div className="flex items-center gap-1">
                        {pages.map(page => {
                            const isActive = page === currentPage;
                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePage(page)}
                                    className={`relative flex items-center justify-center w-10 h-10 rounded-full text-sm font-black transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-110 z-10'
                                            : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 hover:scale-105 hover:shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => handlePage(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className="group relative flex items-center justify-center w-10 h-10 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-300 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-zinc-400 disabled:cursor-not-allowed shadow-sm border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/50"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-5 h-5 group-active:translate-x-1 transition-transform" />
                    </button>
                </nav>
            </div>
        </div>
    );
}
