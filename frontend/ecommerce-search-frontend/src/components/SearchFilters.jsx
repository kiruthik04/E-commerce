import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

const PRICE_RANGES = [
  { label: 'Under ₹1,000',    min: 0,    max: 999 },
  { label: '₹1,000 – ₹5,000',  min: 1000, max: 5000 },
  { label: '₹5,000 – ₹20,000', min: 5000, max: 20000 },
  { label: '₹20,000 – ₹50,000',min: 20000,max: 50000 },
  { label: 'Above ₹50,000',    min: 50000, max: null },
];

const SearchFilters = ({ facets, filters, onFilterChange }) => {
  const setFilter = (key, val) => onFilterChange({ ...filters, [key]: val });

  return (
    <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
      <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm">
        <SlidersHorizontal className="h-4 w-4 text-indigo-500" /> Filters
      </h3>

      {/* In-stock toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">In Stock Only</span>
        <button
          onClick={() => setFilter('inStock', !filters.inStock)}
          className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${filters.inStock ? 'bg-indigo-600' : 'bg-gray-200'}`}>
          <span className={`inline-block h-5 w-5 rounded-full bg-white shadow mt-0.5 transform transition-transform ${filters.inStock ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {/* Categories */}
      {facets?.categories?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</p>
          <div className="space-y-1">
            <button onClick={() => setFilter('category', '')}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${!filters.category ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              All Categories
            </button>
            {facets.categories.map(cat => (
              <button key={cat} onClick={() => setFilter('category', cat)}
                className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${filters.category === cat ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</p>
        <div className="space-y-1">
          <button onClick={() => onFilterChange({ ...filters, minPrice: '', maxPrice: '' })}
            className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${!filters.minPrice && !filters.maxPrice ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
            Any Price
          </button>
          {PRICE_RANGES.map(r => (
            <button key={r.label}
              onClick={() => onFilterChange({ ...filters, minPrice: r.min, maxPrice: r.max ?? '' })}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition ${
                filters.minPrice === r.min && (filters.maxPrice === r.max || (!filters.maxPrice && !r.max))
                  ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SearchFilters;
