import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { fetchProducts } from '../api';
import { useDebounce } from '../hooks/useDebounce';
import { useSavedProducts } from '../hooks/useSavedProducts';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

export default function ProductExplorer() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [facets, setFacets] = useState({});
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);

    // Search input state locally, syncs with URL only after debounce
    const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(searchInput, 300);

    const { savedProducts, toggleSave } = useSavedProducts();

    // Load products whenever query params change
    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            try {
                const params = Object.fromEntries(searchParams.entries());
                const allParams = { ...params };

                for (const [key] of searchParams.entries()) {
                    if (key.endsWith('[]')) {
                        allParams[key] = searchParams.getAll(key);
                    }
                }

                const res = await fetchProducts(allParams);
                if (active) {
                    setProducts(res.data);
                    setFacets(res.facets);
                    setMeta(res.meta);
                }
            } catch (e) {
                console.error('Failed to load products', e);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => { active = false; };
    }, [searchParams]);

    // Sync debounced search to URL
    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearch) {
            if (params.get('search') !== debouncedSearch) {
                params.set('search', debouncedSearch);
                params.delete('page');
                setSearchParams(params);
            }
        } else {
            if (params.has('search')) {
                params.delete('search');
                params.delete('page');
                setSearchParams(params);
            }
        }
    }, [debouncedSearch, searchParams, setSearchParams]);

    const handleSort = (e) => {
        const params = new URLSearchParams(searchParams);
        if (e.target.value) {
            params.set('sort', e.target.value);
        } else {
            params.delete('sort');
        }
        params.delete('page');
        setSearchParams(params);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">Product Explorer</h1>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative group w-full sm:w-auto">
                        <div className="absolute z-10 inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                            <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Discover products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/60 dark:border-zinc-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] text-zinc-900 dark:text-white rounded-full pl-11 pr-10 py-2.5 w-full sm:min-w-[320px] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium text-[13px] sm:text-sm placeholder:text-zinc-400"
                        />
                        {searchInput && (
                            <button
                                onClick={() => setSearchInput('')}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-400 hover:text-rose-500 transition-colors focus:outline-none"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        )}
                    </div>

                    <div className="relative w-full sm:w-48 group">
                        <select
                            value={searchParams.get('sort') || 'name_asc'}
                            onChange={handleSort}
                            className="appearance-none cursor-pointer bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/60 dark:border-zinc-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] text-zinc-700 dark:text-zinc-200 font-bold text-[13px] rounded-full pl-5 pr-10 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:bg-white/60 dark:hover:bg-zinc-800/50 transition-all"
                        >
                            <option value="name_asc" className="bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-white">Sort: A-Z</option>
                            <option value="name_desc" className="bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-white">Sort: Z-A</option>
                            <option value="price_asc" className="bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-white">Price: Low to High</option>
                            <option value="price_desc" className="bg-white dark:bg-zinc-900 font-medium text-zinc-900 dark:text-white">Price: High to Low</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-64 shrink-0">
                    <Filters
                        facets={facets}
                        searchParams={searchParams}
                        onFilterChange={setSearchParams}
                    />
                </div>

                <div className="flex-1 w-full">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white dark:bg-zinc-800 rounded-3xl p-5 h-64 border border-zinc-200 dark:border-zinc-700 shadow-sm flex flex-col">
                                    <div className="bg-zinc-200 dark:bg-zinc-700 h-4 w-1/4 mb-4 rounded" />
                                    <div className="bg-zinc-200 dark:bg-zinc-700 h-6 w-3/4 mb-4 rounded" />
                                    <div className="bg-zinc-200 dark:bg-zinc-700 h-4 w-1/2 mb-auto rounded" />
                                    <div className="bg-zinc-200 dark:bg-zinc-700 h-6 w-1/3 mt-4 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => {
                                    const isSaved = savedProducts.some(p => p.product_id === product.id);
                                    return (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            isSaved={isSaved}
                                            onToggleSave={toggleSave}
                                        />
                                    );
                                })}
                            </div>
                            <Pagination
                                meta={meta}
                                searchParams={searchParams}
                                onPageChange={setSearchParams}
                            />
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
                            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-2">No products found matching your criteria.</p>
                            <button
                                onClick={() => setSearchParams({})}
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
