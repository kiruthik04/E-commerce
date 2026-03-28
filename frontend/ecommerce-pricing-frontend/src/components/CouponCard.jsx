import React from 'react';
import { Tag, Percent, Truck } from 'lucide-react';

const typeIcon = { PERCENT: Percent, FLAT: Tag, FREE_SHIPPING: Truck };
const typeColor = { PERCENT: 'text-purple-600 bg-purple-50 border-purple-200', FLAT: 'text-blue-600 bg-blue-50 border-blue-200', FREE_SHIPPING: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
const fmt = (n) => n != null ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

const CouponCard = ({ coupon, onDeactivate }) => {
  const Icon = typeIcon[coupon.type] || Tag;
  const color = typeColor[coupon.type] || 'text-gray-600 bg-gray-50 border-gray-200';
  const usagePct = coupon.usageLimit > 0 ? Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100) : 0;

  return (
    <div className={`border rounded-2xl p-5 ${coupon.isActive ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-gray-900 font-mono text-lg tracking-wider">{coupon.code}</p>
            <p className="text-xs text-gray-500 capitalize">{coupon.type.replace('_', ' ').toLowerCase()}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-gray-900">
            {coupon.type === 'PERCENT' ? `${coupon.value}%` : coupon.type === 'FLAT' ? fmt(coupon.value) : 'FREE'}
          </p>
          <p className="text-[11px] text-gray-400">discount</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-gray-500 my-3">
        {coupon.minOrderAmount && <p>Min order: <span className="font-semibold text-gray-700">{fmt(coupon.minOrderAmount)}</span></p>}
        {coupon.maxDiscountAmount && <p>Max discount: <span className="font-semibold text-gray-700">{fmt(coupon.maxDiscountAmount)}</span></p>}
        {coupon.validUntil && <p>Valid until: <span className="font-semibold text-gray-700">{new Date(coupon.validUntil).toLocaleDateString('en-IN')}</span></p>}
      </div>

      {coupon.usageLimit > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Usage: {coupon.usedCount}/{coupon.usageLimit}</span>
            <span>{Math.round(usagePct)}% used</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${usagePct}%` }} />
          </div>
        </div>
      )}

      {coupon.isActive && onDeactivate && (
        <button onClick={() => onDeactivate(coupon.id)}
          className="w-full text-xs py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">
          Deactivate
        </button>
      )}
    </div>
  );
};

export default CouponCard;
