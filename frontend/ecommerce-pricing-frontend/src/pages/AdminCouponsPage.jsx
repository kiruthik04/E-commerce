import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CouponCard from '../components/CouponCard';
import CouponForm from '../components/CouponForm';
import { Tag, Plus, RefreshCcw } from 'lucide-react';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/coupons');
      setCoupons(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const deactivate = async (id) => {
    try { await api.delete(`/api/coupons/${id}`); fetchCoupons(); } catch (e) { console.error(e); }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="h-6 w-6 text-orange-500" /> Coupon Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create, view, and deactivate promotional coupon codes.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchCoupons} className="p-2.5 border border-gray-300 rounded-xl text-gray-500 hover:bg-gray-50 transition">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
            <Plus className="h-4 w-4" /> New Coupon
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6">
          <CouponForm onSaved={() => { setShowForm(false); fetchCoupons(); }} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(n => <div key={n} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <Tag className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p>No active coupons. Click "New Coupon" to create one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map(c => <CouponCard key={c.id} coupon={c} onDeactivate={deactivate} />)}
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;
