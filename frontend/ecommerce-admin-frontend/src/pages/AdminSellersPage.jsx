import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ApprovalTable from '../components/ApprovalTable';
import { Store, Plus, RefreshCcw } from 'lucide-react';

const AdminSellersPage = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ userId: '', storeName: '', gstNumber: '', bankAccount: '' });

  const fetchSellers = async () => {
    setLoading(true);
    try { const r = await api.get('/api/admin/sellers'); setSellers(r.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSellers(); }, []);

  const approve = async (userId) => {
    await api.post(`/api/admin/sellers/approve/${userId}`);
    fetchSellers();
  };

  const create = async (e) => {
    e.preventDefault();
    await api.post('/api/admin/sellers', { ...form, userId: parseInt(form.userId) });
    setShowForm(false); setForm({ userId: '', storeName: '', gstNumber: '', bankAccount: '' });
    fetchSellers();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Store className="h-6 w-6 text-violet-400" /> Sellers</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage seller accounts and approval workflow.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchSellers} className="p-2.5 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition">
            <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={() => setShowForm(s => !s)}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">
            <Plus className="h-4 w-4" /> Add Seller
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={create} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 grid grid-cols-2 gap-4">
          {[
            { key: 'userId', label: 'User ID', type: 'number' },
            { key: 'storeName', label: 'Store Name' },
            { key: 'gstNumber', label: 'GST Number' },
            { key: 'bankAccount', label: 'Bank Account' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs text-gray-500 mb-1 font-semibold uppercase">{label}</label>
              <input type={type || 'text'} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          ))}
          <div className="col-span-2 flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-700 rounded-xl text-gray-400 text-sm hover:bg-gray-800 transition">Cancel</button>
            <button type="submit" className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition">Create</button>
          </div>
        </form>
      )}

      <ApprovalTable sellers={sellers} onApprove={approve} />
    </div>
  );
};

export default AdminSellersPage;
