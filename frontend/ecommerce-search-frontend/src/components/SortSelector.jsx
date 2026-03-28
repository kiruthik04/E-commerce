import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'relevance',  label: 'Most Relevant' },
  { value: 'top_rated',  label: 'Top Rated' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest',     label: 'Newest First' },
];

const SortSelector = ({ value, onChange }) => (
  <div className="flex items-center gap-2">
    <ArrowUpDown className="h-4 w-4 text-gray-400" />
    <select value={value} onChange={e => onChange(e.target.value)}
      className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
      {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default SortSelector;
