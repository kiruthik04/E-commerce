import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
        <p className="text-slate-400 mb-2">{label}</p>
        {payload.map(p => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
            {p.name}: {p.dataKey === 'revenue' ? `₹${Number(p.value).toLocaleString('en-IN')}` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const RevenueLineChart = ({ data }) => {
  const chartData = data?.map(d => ({
    date: format(new Date(d.date), 'dd MMM'),
    revenue: Number(d.revenue),
    orders: d.orders,
  })) || [];

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-slate-300 mb-5 uppercase tracking-wider">Revenue & Orders (Last 30 Days)</h3>
      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-slate-500">No data available</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#8b5cf6"
              strokeWidth={2} fill="url(#colorRevenue)" activeDot={{ r: 5 }} />
            <Area yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#3b82f6"
              strokeWidth={2} fill="url(#colorOrders)" activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default RevenueLineChart;
