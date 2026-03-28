import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts';

const COLORS = ['#8b5cf6','#7c3aed','#6d28d9','#5b21b6','#4c1d95','#a78bfa','#c4b5fd','#ddd6fe','#ede9fe','#f5f3ff'];

const TopProductsBarChart = ({ data, title, valueKey = 'count', valueLabel = 'Views' }) => {
  const chartData = data?.slice(0, 10).map(d => ({
    name: `#${d.productId}`,
    value: d[valueKey] || 0,
  })) || [];

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">{title}</h3>
      {chartData.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          No data — fire some events to see this chart populate.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={45} />
            <Tooltip
              formatter={(val) => [val, valueLabel]}
              contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TopProductsBarChart;
