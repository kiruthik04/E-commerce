import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { TrendingUp } from 'lucide-react';

const PopularSearches = ({ onSelect }) => {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    api.get('/popular').then(r => setPopular(r.data)).catch(() => {});
  }, []);

  if (popular.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
        <TrendingUp className="h-3.5 w-3.5" /> Trending:
      </span>
      {popular.map(({ query }) => (
        <button key={query} onClick={() => onSelect(query)}
          className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition font-medium border border-indigo-100">
          {query}
        </button>
      ))}
    </div>
  );
};

export default PopularSearches;
