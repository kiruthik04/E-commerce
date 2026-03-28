import React from 'react';
import { TrendingDown, Percent, Truck } from 'lucide-react';

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const Row = ({ label, value, sub, green, bold, red }) => (
  <div className={`flex items-center justify-between py-2 ${bold ? 'border-t border-gray-200 mt-2 pt-3' : ''}`}>
    <span className={`text-sm ${sub ? 'text-gray-400 pl-4' : bold ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{label}</span>
    <span className={`text-sm font-semibold ${green ? 'text-emerald-600' : red ? 'text-red-500' : bold ? 'text-gray-900 text-base' : 'text-gray-800'}`}>{value}</span>
  </div>
);

const PriceSummaryBreakdown = ({ calc }) => {
  if (!calc) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-1">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-orange-500" /> Price Breakdown
      </h3>
      <Row label="Base Price" value={fmt(calc.basePrice)} />
      {calc.productDiscountAmount > 0 && (
        <Row label="Product / Category Discount" value={`-${fmt(calc.productDiscountAmount)}`} green sub />
      )}
      {calc.couponDiscountAmount > 0 && (
        <Row label={`Coupon [${calc.appliedCouponCode}]`} value={`-${fmt(calc.couponDiscountAmount)}`} green sub />
      )}
      <Row label={`GST (18%)`} value={`+${fmt(calc.gstAmount)}`} />
      {calc.freeShipping && (
        <div className="flex items-center gap-1.5 py-1.5 text-sm text-emerald-600">
          <Truck className="h-4 w-4" /> Free Shipping Applied
        </div>
      )}
      <Row label="Final Price (incl. GST)" value={fmt(calc.finalPrice)} bold />
      {calc.totalSavings > 0 && (
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-emerald-800">Total Savings</span>
          <span className="text-emerald-700 font-bold">{fmt(calc.totalSavings)} ({calc.savingsPercent}% off)</span>
        </div>
      )}
    </div>
  );
};

export default PriceSummaryBreakdown;
