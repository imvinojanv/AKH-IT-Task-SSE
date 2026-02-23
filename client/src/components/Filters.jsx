import React from 'react';
import { FilterX, Check } from 'lucide-react';

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

export default function Filters({ facets, searchParams, onFilterChange }) {
    if (!facets) return null;

    const currentBrands = searchParams.getAll('brand[]');
    const currentCategories = searchParams.getAll('category[]');
    const currentColours = searchParams.getAll('colour[]');
    const inStock = searchParams.get('in_stock');

    const handleCheckbox = (key, value) => {
        const params = new URLSearchParams(searchParams);
        const existing = params.getAll(key);

        params.delete(key);
        if (existing.includes(value)) {
            existing.filter(v => v !== value).forEach(v => params.append(key, v));
        } else {
            [...existing, value].forEach(v => params.append(key, v));
        }

        params.delete('page');
        onFilterChange(params);
    };

    const handleRadio = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value === '') {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        params.delete('page');
        onFilterChange(params);
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        if (searchParams.get('search')) params.set('search', searchParams.get('search'));
        if (searchParams.get('sort')) params.set('sort', searchParams.get('sort'));
        onFilterChange(params);
    };

    const renderColorFacet = (title, paramKey, facetData, currentValues) => {
        if (!facetData || Object.keys(facetData).length === 0) return null;

        return (
            <div className="mb-8 p-1">
                <h4 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase mb-4">{title}</h4>
                <div className="flex flex-col gap-1">
                    {Object.entries(facetData).map(([name, count]) => {
                        const isSelected = currentValues.includes(name);
                        const hexColor = colourMap[name] || '#cccccc';
                        const isWhite = name === 'White';
                        return (
                            <button
                                key={name}
                                onClick={() => handleCheckbox(paramKey, name)}
                                className={`group flex items-center justify-between w-full p-2 rounded-xl transition-all duration-300 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 shadow-sm' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`relative flex items-center justify-center w-6 h-6 rounded-full shadow-sm ${isSelected ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-zinc-900' : 'ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-110 transition-transform'}`}
                                        style={{ backgroundColor: hexColor }}
                                    >
                                        {isWhite && <div className="absolute inset-0 rounded-full border border-black/10 dark:border-white/10 pointer-events-none" />}
                                        {isSelected && <Check className={`w-3.5 h-3.5 ${isWhite || name === 'Yellow' ? 'text-zinc-900' : 'text-white'}`} />}
                                    </div>
                                    <span className={`text-[13px] font-bold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors'}`}>
                                        {name}
                                    </span>
                                </div>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500'}`}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        );
    };

    const renderPillFacet = (title, paramKey, facetData, currentValues) => {
        if (!facetData || Object.keys(facetData).length === 0) return null;

        return (
            <div className="mb-8 p-1">
                <h4 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase mb-4">{title}</h4>
                <div className="flex flex-wrap gap-2">
                    {Object.entries(facetData).map(([name, count]) => {
                        const isSelected = currentValues.includes(name);
                        return (
                            <button
                                key={name}
                                onClick={() => handleCheckbox(paramKey, name)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[13px] font-bold transition-all duration-300 border ${isSelected ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900 shadow-md shadow-zinc-950/20 dark:shadow-white/10 ring-2 ring-zinc-900/20 dark:ring-white/20 ring-offset-1 dark:ring-offset-zinc-900 scale-105 block' : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:border-zinc-300 dark:bg-zinc-800/40 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:border-zinc-600 dark:hover:text-zinc-200'}`}
                            >
                                {name} <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-white/20 dark:bg-black/10 text-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 dark:text-zinc-500'}`}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-2xl p-6 rounded-3xl border border-white/60 dark:border-zinc-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] sticky top-28 overflow-hidden">

            <div className="flex justify-between items-center mb-8 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/80">
                <h3 className="font-black text-xl text-zinc-900 dark:text-white tracking-tight">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-600/80 bg-rose-50/50 hover:bg-rose-100 hover:text-rose-700 dark:text-rose-400/80 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:hover:text-rose-300 transition-all active:scale-95"
                >
                    <FilterX className="w-3.5 h-3.5 group-hover:-rotate-12 transition-transform" />
                    Reset
                </button>
            </div>

            <div className="mb-8">
                <h4 className="text-[11px] font-black tracking-widest text-zinc-400 uppercase mb-4">Availability</h4>
                <div className="flex flex-col gap-3">
                    <label className="group flex items-center cursor-pointer p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors -mx-2">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shadow-sm ${(!inStock) ? 'bg-indigo-600 border-indigo-600 shadow-indigo-600/30' : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-indigo-400'}`}>
                            {!inStock && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input
                            type="radio"
                            name="in_stock"
                            className="hidden"
                            checked={!inStock}
                            onChange={() => handleRadio('in_stock', '')}
                        />
                        <span className={`ml-3 text-sm font-bold transition-colors ${(!inStock) ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`}>All Items</span>
                    </label>

                    <label className="group flex items-center cursor-pointer p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors -mx-2">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shadow-sm ${(inStock === 'true') ? 'bg-emerald-500 border-emerald-500 shadow-emerald-500/30' : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-emerald-400'}`}>
                            {(inStock === 'true') && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input
                            type="radio"
                            name="in_stock"
                            className="hidden"
                            checked={inStock === 'true'}
                            onChange={() => handleRadio('in_stock', 'true')}
                        />
                        <span className={`ml-3 text-sm font-bold transition-colors ${(inStock === 'true') ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`}>In Stock</span>
                    </label>

                    <label className="group flex items-center cursor-pointer p-2 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors -mx-2">
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 shadow-sm ${(inStock === 'false') ? 'bg-rose-500 border-rose-500 shadow-rose-500/30' : 'bg-white border-zinc-300 dark:bg-zinc-900 dark:border-zinc-700 group-hover:border-rose-400'}`}>
                            {(inStock === 'false') && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <input
                            type="radio"
                            name="in_stock"
                            className="hidden"
                            checked={inStock === 'false'}
                            onChange={() => handleRadio('in_stock', 'false')}
                        />
                        <span className={`ml-3 text-sm font-bold transition-colors ${(inStock === 'false') ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'}`}>Out of Stock</span>
                    </label>
                </div>
            </div>

            {renderPillFacet('Brand', 'brand[]', facets.brand, currentBrands)}
            {renderPillFacet('Category', 'category[]', facets.category, currentCategories)}
            {renderColorFacet('Color', 'colour[]', facets.colour, currentColours)}
        </div>
    );
}
