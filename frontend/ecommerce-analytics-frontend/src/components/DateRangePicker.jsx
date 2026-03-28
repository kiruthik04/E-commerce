import React from 'react';
import { Calendar } from 'lucide-react';

const DateRangePicker = ({ from, to, onChange }) => {
  return (
    <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
      <Calendar className="h-4 w-4 text-slate-400" />
      <input
        type="date"
        value={from}
        onChange={e => onChange(e.target.value, to)}
        className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
      />
      <span className="text-slate-500 text-sm">→</span>
      <input
        type="date"
        value={to}
        onChange={e => onChange(from, e.target.value)}
        className="bg-transparent text-sm text-slate-300 focus:outline-none cursor-pointer"
      />
    </div>
  );
};

export default DateRangePicker;
