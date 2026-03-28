import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Search, X } from 'lucide-react';

const SearchBar = ({ query, onQueryChange, onSearch }) => {
  const [suggestions, setSuggestions] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [timer, setTimer] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (val) => {
    onQueryChange(val);
    clearTimeout(timer);
    if (val.length < 2) { setSuggestions(null); return; }
    setTimer(setTimeout(async () => {
      try {
        const res = await api.get('/autocomplete', { params: { q: val } });
        setSuggestions(res.data);
        setShowDropdown(true);
      } catch (e) {}
    }, 200));
  };

  const handleSelect = (val) => {
    onQueryChange(val);
    setShowDropdown(false);
    onSearch(val);
  };

  const hasSuggestions = suggestions?.productNames?.length > 0 || suggestions?.categories?.length > 0;

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl">
      <div className="flex items-center bg-white border-2 border-indigo-200 rounded-2xl shadow-sm focus-within:border-indigo-500 transition overflow-hidden">
        <Search className="ml-4 h-5 w-5 text-indigo-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={e => handleChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { setShowDropdown(false); onSearch(query); } }}
          onFocus={() => hasSuggestions && setShowDropdown(true)}
          placeholder="Search products, brands, categories..."
          className="flex-1 px-3 py-3.5 text-sm focus:outline-none bg-transparent"
        />
        {query && (
          <button onClick={() => { onQueryChange(''); setSuggestions(null); onSearch(''); }} className="mr-2 p-1 text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => { setShowDropdown(false); onSearch(query); }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3.5 text-sm font-semibold transition">
          Search
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && hasSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {suggestions.categories?.length > 0 && (
            <div>
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
              {suggestions.categories.map(cat => (
                <button key={cat} onClick={() => handleSelect(cat)}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 text-left gap-2">
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">Category</span>
                  {cat}
                </button>
              ))}
            </div>
          )}
          {suggestions.productNames?.length > 0 && (
            <div className="border-t border-gray-50 pb-2">
              <p className="px-4 pt-3 pb-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Products</p>
              {suggestions.productNames.map(name => (
                <button key={name} onClick={() => handleSelect(name)}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 text-left gap-2">
                  <Search className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
