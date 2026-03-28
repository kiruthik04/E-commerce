import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, Tag, DollarSign } from 'lucide-react';
import CategoryTree from './CategoryTree';

const ProductFilter = ({ categories, selectedCategory, onSelectCategory, filters, onFilterChange, onSearchSubmit }) => {
    const hasActiveFilters = selectedCategory || filters.keyword || filters.minPrice || filters.maxPrice;

    const handleClear = () => {
        onFilterChange({ keyword: '', minPrice: '', maxPrice: '' });
        onSelectCategory(null);
        setTimeout(onSearchSubmit, 50);
    };

    return (
        <div className="flex flex-col gap-0">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-display font-bold text-slate-800">
                    <SlidersHorizontal size={16} className="text-brand-500" />
                    Filters
                </div>
                {hasActiveFilters && (
                    <button onClick={handleClear} className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold transition-colors">
                        <RotateCcw size={12} /> Clear all
                    </button>
                )}
            </div>

            {/* Keyword search */}
            <div className="px-5 py-4 border-b border-slate-100">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                    <Search size={12} /> Search
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="input text-sm py-2.5"
                        placeholder="Search products…"
                        value={filters.keyword}
                        onChange={e => onFilterChange({ ...filters, keyword: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && onSearchSubmit()}
                    />
                    <button onClick={onSearchSubmit} className="btn-primary px-3 py-2.5 text-sm rounded-xl">
                        <Search size={16} />
                    </button>
                </div>
            </div>

            {/* Categories */}
            <div className="px-5 py-4 border-b border-slate-100">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    <Tag size={12} /> Categories
                </label>
                {categories.length === 0 ? (
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton h-8 rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <CategoryTree
                        categories={categories}
                        selectedCategoryId={selectedCategory}
                        onSelectCategory={onSelectCategory}
                    />
                )}
            </div>

            {/* Price range */}
            <div className="px-5 py-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                    <DollarSign size={12} /> Price Range
                </label>
                <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                            type="number"
                            className="input text-sm py-2.5 pl-7"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={e => onFilterChange({ ...filters, minPrice: e.target.value })}
                        />
                    </div>
                    <span className="text-slate-400 text-sm shrink-0">–</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                            type="number"
                            className="input text-sm py-2.5 pl-7"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={e => onFilterChange({ ...filters, maxPrice: e.target.value })}
                        />
                    </div>
                </div>
                <button onClick={onSearchSubmit} className="btn-primary w-full mt-3 text-sm py-2.5">
                    Apply Filters
                </button>
            </div>
        </div>
    );
};

export default ProductFilter;
