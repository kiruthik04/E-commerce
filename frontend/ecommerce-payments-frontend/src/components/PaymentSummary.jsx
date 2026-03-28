import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PaymentSummary = ({ amount, orderId, onPay, loading, selectedMethod }) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 lg:p-8 mt-10 lg:mt-0 lg:sticky lg:top-24 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900">Payment Summary</h2>
      
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Order Reference</dt>
          <dd className="text-sm font-medium text-gray-900 border border-gray-300 px-2 py-1 rounded bg-white">
            #{orderId || 'PENDING'}
          </dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-bold text-gray-900">Total to Pay</dt>
          <dd className="text-2xl font-black text-indigo-600">${Number(amount).toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-8">
        <button
          onClick={onPay}
          disabled={loading || !selectedMethod}
          className="w-full flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center">
              Processing Securely...
            </span>
          ) : (
             <span className="flex items-center">
               Pay ${Number(amount).toFixed(2)}
             </span>
          )}
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-500">
        <ShieldCheck className="h-5 w-5 text-green-500" />
        <p>100% Encrypted & Secure checkout</p>
      </div>
      
      <div className="mt-4 text-xs tracking-tight text-gray-400 text-center">
         Test Mode: Amounts ending in .99 will automatically fail.
      </div>
    </div>
  );
};

export default PaymentSummary;
