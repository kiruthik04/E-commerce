import React, { useState } from 'react';
import api from '../api/axios';
import { X, Plus } from 'lucide-react';

const EMPTY = { code: '', type: 'PERCENT', value: '', minOrderAmount: '', maxDiscountAmount: '', usageLimit: 0, validFrom: '', validUntil: '' };

const CouponForm = ({ onSaved, onCancel }) => {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await api.post('/api/coupons', {
        ...form,
        value: parseFloat(form.value),
        minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : null,
        maxDiscountAmount: form.maxDiscountAmount ? parseFloat(form.maxDiscountAmount) : null,
        validFrom: form.validFrom ? form.validFrom + ':00' : null,
        validUntil: form.validUntil ? form.validUntil + ':00' : null,
        isActive: true,
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create coupon.');
    } finally { setLoading(false); }
  };

  const Field = ({ label, name, type = 'text', min, placeholder }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      <input type={type} min={min} value={form[name]} onChange={e => set(name, e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-gray-900 flex items-center gap-2"><Plus className="h-4 w-4 text-orange-500" /> New Coupon</h3>
        <button onClick={onCancel}><X className="h-4 w-4 text-gray-400 hover:text-gray-600" /></button>
      </div>
      {error && <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <Field label="Coupon Code" name="code" placeholder="e.g. SAVE50" />
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            <option value="PERCENT">Percent (%)</option>
            <option value="FLAT">Flat (₹)</option>
            <option value="FREE_SHIPPING">Free Shipping</option>
          </select>
        </div>
        <Field label="Discount Value" name="value" type="number" min="0" placeholder="e.g. 20" />
        <Field label="Min Order (₹)" name="minOrderAmount" type="number" min="0" placeholder="e.g. 500" />
        <Field label="Max Discount Cap (₹)" name="maxDiscountAmount" type="number" min="0" placeholder="optional" />
        <Field label="Usage Limit (0=unlimited)" name="usageLimit" type="number" min="0" />
        <Field label="Valid From" name="validFrom" type="datetime-local" />
        <Field label="Valid Until" name="validUntil" type="datetime-local" />
        <div className="col-span-2 flex gap-3 pt-2">
          <button type="button" onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition">
            {loading ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
