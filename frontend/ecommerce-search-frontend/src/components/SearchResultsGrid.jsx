import React from 'react';
import { Star, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const stars = (r) => '★'.repeat(Math.round(r || 0)) + '☆'.repeat(5 - Math.round(r || 0));

const SearchResultsGrid = ({ results, totalElements }) => {
  if (!results || results.length === 0) return (
    <div className="col-span-full py-24 text-center text-gray-400">
      <p className="text-2xl">🔍</p>
      <p className="mt-3 font-semibold text-gray-600">No products found</p>
      <p className="text-sm mt-1">Try different keywords or clear the filters</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
      {results.map(product => (
        <div key={product.id}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group cursor-pointer">
          <div className="relative bg-gray-50 h-44 overflow-hidden">
            <img
              src={product.imageUrl || `https://picsum.photos/seed/${product.id}/300/300`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              onError={e => { e.target.src = `https://picsum.photos/seed/${product.id}/300/300`; }}
            />
            <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="p-4">
            <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide mb-1">{product.category}</p>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-yellow-500 text-xs tracking-tighter">{stars(product.rating)}</span>
              <span className="text-xs text-gray-400 ml-1">({product.reviewCount?.toLocaleString()})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold text-gray-900">{fmt(product.price)}</span>
              <button className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition">
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResultsGrid;
