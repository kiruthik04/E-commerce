import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import SalesSummaryCards from '../components/SalesSummaryCards';
import RevenueLineChart from '../components/RevenueLineChart';
import TopProductsBarChart from '../components/TopProductsBarChart';
import DateRangePicker from '../components/DateRangePicker';
import { RefreshCcw, Search, BarChart2, Send } from 'lucide-react';
import { format, subDays } from 'date-fns';

const AdminDashboardPage = () => {
  const today = format(new Date(), 'yyyy-MM-dd');
  const thirtyDaysAgo = format(subDays(new Date(), 29), 'yyyy-MM-dd');

  const [from, setFrom] = useState(thirtyDaysAgo);
  const [to, setTo] = useState(today);
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [topQueries, setTopQueries] = useState([]);

  // Simulator state
  const [simEvent, setSimEvent] = useState('PURCHASE');
  const [simProductId, setSimProductId] = useState('1');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const params = { from, to };
    try {
      const [sumRes, dailyRes, sellRes, viewRes, queryRes] = await Promise.allSettled([
        api.get('/sales/summary', { params }),
        api.get('/sales/daily', { params }),
        api.get('/products/top-selling', { params }),
        api.get('/products/most-viewed', { params }),
        api.get('/search/top-queries', { params }),
      ]);
      if (sumRes.status === 'fulfilled') setSummary(sumRes.value.data);
      if (dailyRes.status === 'fulfilled') setDailyRevenue(dailyRes.value.data);
      if (sellRes.status === 'fulfilled') setTopSelling(sellRes.value.data);
      if (viewRes.status === 'fulfilled') setMostViewed(viewRes.value.data);
      if (queryRes.status === 'fulfilled') setTopQueries(queryRes.value.data);
    } finally { setLoading(false); }
  }, [from, to]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDateChange = (f, t) => { setFrom(f); setTo(t); };

  const simulateEvent = async () => {
    try {
      await api.post('/event', {
        eventType: simEvent,
        productId: parseInt(simProductId) || null,
        userId: Math.floor(Math.random() * 100) + 1,
        metadata: simEvent === 'SEARCH' ? JSON.stringify({ query: 'sample product' }) : null,
      });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 className="h-6 w-6 text-violet-400" /> Analytics Overview
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">Sales intelligence & event reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker from={from} to={to} onChange={handleDateChange} />
          <button onClick={fetchAll} disabled={loading}
            className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white transition">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SalesSummaryCards summary={summary} />

      {/* Revenue Chart */}
      <RevenueLineChart data={dailyRevenue} />

      {/* Two Column Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsBarChart data={topSelling} title="Top Selling Products" valueKey="count" valueLabel="Purchases" />
        <TopProductsBarChart data={mostViewed} title="Most Viewed Products" valueKey="count" valueLabel="Views" />
      </div>

      {/* Bottom Row: Search Queries + Event Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Search Queries */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400" /> Top Search Queries
          </h3>
          {topQueries.length === 0 ? (
            <p className="text-slate-500 text-sm">No search queries recorded in this period.</p>
          ) : (
            <div className="space-y-2">
              {topQueries.map((q, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <span className="text-sm text-slate-300">"{q.query}"</span>
                  <span className="text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">
                    {q.count} searches
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Simulator */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider flex items-center gap-2">
            <Send className="h-4 w-4 text-slate-400" /> Event Simulator
          </h3>
          <p className="text-slate-500 text-xs mb-4">
            Fire mock events to populate the charts. PURCHASE events build the top sellers; PRODUCT_VIEW builds most-viewed.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Event Type</label>
              <select value={simEvent} onChange={e => setSimEvent(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="PAGE_VIEW">Page View</option>
                <option value="PRODUCT_VIEW">Product View</option>
                <option value="ADD_TO_CART">Add to Cart</option>
                <option value="PURCHASE">Purchase</option>
                <option value="SEARCH">Search</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Product ID</label>
              <input type="number" min="1" value={simProductId} onChange={e => setSimProductId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <button onClick={simulateEvent}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition flex items-center justify-center gap-2">
              <Send className="h-4 w-4" /> Fire Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
