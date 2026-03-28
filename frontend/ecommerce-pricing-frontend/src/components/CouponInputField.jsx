import React, { useState } from 'react';
import api from '../api/axios';
import { TagIcon, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const CouponInputField = ({ cartTotal, onApplied }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const apply = async () => {
    if (!code.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await api.post('/api/coupons/validate', { code: code.trim(), cartTotal });
      setResult(res.data);
      onApplied && onApplied(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid coupon code.');
    } finally { setLoading(false); }
  };

  const remove = () => { setCode(''); setResult(null); setError(null); onApplied && onApplied(null); };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <TagIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && apply()}
            disabled={!!result}
            placeholder="Enter coupon code"
            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl text-sm font-mono uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50" />
        </div>
        {result
          ? <button onClick={remove} className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-300 transition">Remove</button>
          : <button onClick={apply} disabled={loading} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition flex items-center gap-1.5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
            </button>
        }
      </div>

      {result && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-800">
          <CheckCircle className="h-4 w-4 flex-shrink-0" />
          <span>Coupon <strong>{result.code}</strong> applied! You save ₹{Number(result.discountAmount).toLocaleString('en-IN')}
          {result.freeShipping && ' + FREE Shipping'}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <XCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default CouponInputField;
