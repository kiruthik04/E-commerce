import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import ServiceStatusIndicator from '../components/ServiceStatusIndicator';
import ApprovalTable from '../components/ApprovalTable';
import {
  TrendingUp, ShoppingBag, Users, AlertTriangle, Store, RefreshCcw
} from 'lucide-react';

const fmt = (n) => n != null ? Number(n).toLocaleString('en-IN') : '—';
const fmtCur = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sumRes, sellRes] = await Promise.allSettled([
        api.get('/api/admin/dashboard'),
        api.get('/api/admin/sellers'),
      ]);
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
      if (sellRes.status === 'fulfilled') setSellers(sellRes.value.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const approveSeller = async (userId) => {
    await api.post(`/api/admin/sellers/approve/${userId}`);
    fetchAll();
  };

  const cards = [
    { label: 'Total Revenue (30d)', value: fmtCur(summary?.totalRevenue),  icon: TrendingUp,    color: 'bg-violet-500/15 text-violet-400' },
    { label: 'Total Orders (30d)',   value: fmt(summary?.totalOrders),      icon: ShoppingBag,   color: 'bg-blue-500/15 text-blue-400', sub: 'Last 30 days' },
    { label: 'New Users (30d)',      value: fmt(summary?.newUsers),         icon: Users,         color: 'bg-emerald-500/15 text-emerald-400' },
    { label: 'Low-Stock Items',      value: fmt(summary?.lowStockCount),    icon: AlertTriangle, color: 'bg-amber-500/15 text-amber-400' },
    { label: 'Total Sellers',        value: fmt(summary?.totalSellers),     icon: Store,         color: 'bg-pink-500/15 text-pink-400', sub: `${summary?.pendingSellers ?? 0} pending` },
  ];

  const pendingSellers = sellers.filter(s => !s.isApproved);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">Aggregated from all microservices</p>
        </div>
        <button onClick={fetchAll} className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition">
          <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {cards.map((c, i) => <StatCard key={i} {...c} />)}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ApprovalTable sellers={pendingSellers} onApprove={approveSeller} />
        </div>
        <ServiceStatusIndicator summary={summary} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;
