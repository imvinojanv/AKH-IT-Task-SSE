import React from 'react';
import { useSavedProducts } from '../hooks/useSavedProducts';
import ProductCard from '../components/ProductCard';
import { Bookmark, ShoppingBag } from 'lucide-react';

export default function SavedProducts() {
    const { savedProducts, loading, toggleSave } = useSavedProducts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                <Bookmark className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mr-3" />
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Saved Products</h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white dark:bg-zinc-800 rounded-lg p-5 h-64 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
                            <div className="bg-zinc-200 dark:bg-zinc-700 h-4 w-1/4 mb-4 rounded" />
                            <div className="bg-zinc-200 dark:bg-zinc-700 h-6 w-3/4 mb-4 rounded" />
                            <div className="bg-zinc-200 dark:bg-zinc-700 h-4 w-1/2 mb-auto rounded" />
                            <div className="bg-zinc-200 dark:bg-zinc-700 h-6 w-1/3 mt-4 rounded" />
                        </div>
                    ))}
                </div>
            ) : savedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {savedProducts.map(saved => (
                        <ProductCard
                            key={saved.product_id}
                            product={saved.product}
                            isSaved={true}
                            onToggleSave={toggleSave}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
                    <ShoppingBag className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No saved products</h3>
                    <p className="text-md text-zinc-500 dark:text-zinc-400 mb-6">
                        You haven't saved any products yet. Browse our collection and save your favorites!
                    </p>
                    <a
                        href="/"
                        className="inline-flex max-w-sm justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors"
                    >
                        Explore Products
                    </a>
                </div>
            )}
        </div>
    );
}
