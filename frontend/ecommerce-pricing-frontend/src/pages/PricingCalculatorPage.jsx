import React, { useState } from 'react';
import api from '../api/axios';
import CouponInputField from '../components/CouponInputField';
import PriceSummaryBreakdown from '../components/PriceSummaryBreakdown';
import { Calculator, RefreshCcw } from 'lucide-react';

const CATEGORIES = ['Smartphones', 'Laptops', 'Audio', 'Cameras', 'TVs', 'Wearables', 'Gaming', 'Tablets', 'Accessories'];

const PricingCalculatorPage = () => {
  const [form, setForm] = useState({ basePrice: '10000', productId: '1', category: 'Smartphones', couponCode: '' });
  const [couponResult, setCouponResult] = useState(null);
  const [calc, setCalc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calculate = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.post('/api/pricing/calculate', {
        basePrice: parseFloat(form.basePrice),
        productId: form.productId || null,
        category: form.category || null,
        couponCode: form.couponCode || null,
        cartTotal: parseFloat(form.basePrice),
      });
      setCalc(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Calculation failed.');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-orange-500" /> Price Calculator
        </h1>
        <p className="text-sm text-gray-500 mt-1">Simulate product discounts + coupons + GST in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-800 text-sm">Product Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Base Price (₹)</label>
                <input type="number" min="0" value={form.basePrice} onChange={e => set('basePrice', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Product ID</label>
                <input type="text" value={form.productId} onChange={e => set('productId', e.target.value)} placeholder="e.g. 1"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">— No Category —</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Coupon Code</label>
              <CouponInputField
                cartTotal={parseFloat(form.basePrice) || 0}
                onApplied={(r) => { setCouponResult(r); set('couponCode', r?.code || ''); }}
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}

            <button onClick={calculate} disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Calculator className="h-4 w-4" />}
              Calculate Final Price
            </button>
          </div>

          {/* Quick coupon hints */}
          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
            <p className="text-xs font-semibold text-orange-700 mb-2">🏷️ Try these demo coupon codes:</p>
            <div className="flex flex-wrap gap-2">
              {['WELCOME20', 'FLAT200', 'FREESHIP', 'BIGBUY15', 'FLASH50'].map(c => (
                <button key={c} onClick={() => set('couponCode', c)}
                  className="text-xs font-mono px-2.5 py-1 bg-white border border-orange-200 text-orange-700 rounded-lg hover:bg-orange-100 transition">
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Result Panel */}
        {calc ? (
          <PriceSummaryBreakdown calc={calc} />
        ) : (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex items-center justify-center min-h-[280px]">
            <div className="text-center text-gray-400">
              <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-200" />
              <p className="font-medium text-gray-500">Enter product details and click Calculate</p>
              <p className="text-sm mt-1">Your price breakdown will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingCalculatorPage;
