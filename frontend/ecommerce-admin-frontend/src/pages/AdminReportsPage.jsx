import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart2, RefreshCcw } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';
import { format, subDays } from 'date-fns';

const fmt = (v) => `₹${(v / 1000).toFixed(0)}k`;

const AdminReportsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const from = format(subDays(new Date(), 29), 'yyyy-MM-dd');
  const to   = format(new Date(), 'yyyy-MM-dd');

  const fetchReport = () => {
    setLoading(true);
    api.get(`/api/admin/reports/sales?from=${from}&to=${to}`)
       .then(r => setData(Array.isArray(r.data) ? r.data : []))
       .catch(() => setData([]))
       .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, []);

  const chartData = data.map(d => ({
    date: format(new Date(d.date), 'dd MMM'),
    revenue: Number(d.revenue),
    orders: d.orders,
  }));

  const totalRev = data.reduce((s, d) => s + Number(d.revenue), 0);
  const totalOrd = data.reduce((s, d) => s + (d.orders || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><BarChart2 className="h-6 w-6 text-violet-400" /> Sales Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Proxied from Analytics Service (last 30 days).</p>
        </div>
        <button onClick={fetchReport} className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition">
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-extrabold text-white mt-1">₹{totalRev.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Orders</p>
          <p className="text-3xl font-extrabold text-white mt-1">{totalOrd.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Daily Revenue</h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-600">Loading chart…</div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-600">
            Analytics service is offline — no chart data available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(v) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
