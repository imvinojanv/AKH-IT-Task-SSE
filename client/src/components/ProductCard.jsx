import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const colourMap = {
    Black: '#18181b',
    White: '#f8fafc',
    Blue: '#3b82f6',
    Red: '#ef4444',
    Green: '#22c55e',
    Grey: '#6b7280',
    Yellow: '#eab308',
    Navy: '#1e3a8a'
};

export default function ProductCard({ product, isSaved, onToggleSave }) {
    const sizes = Array.isArray(product.sizes)
        ? product.sizes
        : (() => { try { return JSON.parse(product.sizes); } catch (e) { return [] } })();

    const hexColor = colourMap[product.colour] || '#cccccc';
    const isWhite = product.colour === 'White';

    return (
        <div className="group flex flex-col relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl rounded-3xl p-5 border border-white/60 dark:border-zinc-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] dark:hover:shadow-[0_20px_40px_rgb(255,255,255,0.03)] overflow-hidden">

            {/* Background glow effect based on brand or color - subtle */}
            <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20 dark:opacity-30 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: hexColor }}
            />

            <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                        <span className="inline-flex w-fit items-center rounded-full bg-zinc-900 dark:bg-zinc-100 px-3 py-1 text-[10px] sm:text-xs font-black tracking-widest text-white dark:text-zinc-900 uppercase shadow-sm">
                            {product.brand}
                        </span>
                        <span className="inline-flex w-fit items-center rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 backdrop-blur-md">
                            {product.category}
                        </span>
                    </div>
                    <button
                        onClick={() => onToggleSave(product)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-sm border border-zinc-100 dark:border-zinc-700/50 text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:scale-110 active:scale-95"
                        title={isSaved ? "Remove from saved" : "Save product"}
                    >
                        {isSaved ? <BookmarkCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 fill-indigo-600/20" /> : <Bookmark className="w-5 h-5" />}
                    </button>
                </div>

                <h3 className="text-xl font-bold text-zinc-900 dark:text-white leading-tight mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-center gap-3 mb-6">
                    <div
                        className={`w-5 h-5 rounded-full border shadow-inner ring-2 ring-offset-2 ring-transparent ring-offset-white/50 dark:ring-offset-zinc-900/50 flex-shrink-0 ${isWhite ? 'border border-zinc-200 dark:border-zinc-700' : ''}`}
                        style={{ backgroundColor: hexColor }}
                        title={product.colour}
                    />
                    <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                        {product.colour}
                    </span>
                </div>

                <div className="mt-auto pt-6 border-t border-zinc-200/50 dark:border-zinc-700/50 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
                    <div>
                        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider">Price</p>
                        {product.sale_price ? (
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-rose-600 dark:text-rose-400">${product.sale_price}</span>
                                <span className="text-sm font-medium text-zinc-400 line-through decoration-rose-500/30">${product.price}</span>
                            </div>
                        ) : (
                            <span className="text-2xl font-black text-zinc-900 dark:text-white">${product.price}</span>
                        )}
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2">
                        {product.in_stock ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">In Stock</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Out of Stock</span>
                            </div>
                        )}

                        <div className="flex flex-wrap gap-1 justify-start sm:justify-end mt-1">
                            {sizes.slice(0, 3).map(size => (
                                <span key={size} className="flex items-center justify-center min-w-[24px] h-6 px-1 rounded bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm text-[10px] font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
                                    {size}
                                </span>
                            ))}
                            {sizes.length > 3 && (
                                <span className="flex items-center justify-center min-w-[24px] h-6 px-1 rounded bg-zinc-100/50 dark:bg-zinc-800/50 backdrop-blur-sm text-[10px] font-bold text-zinc-500 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50">
                                    +{sizes.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
