import React from 'react';

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className="text-3xl font-extrabold text-white mt-1">{value ?? '—'}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

export default StatCard;
