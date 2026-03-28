import React from 'react';

const CartSummaryPanel = ({ summary, itemsCount, onCheckout, checkingOut }) => {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8 border border-gray-200">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal ({itemsCount} items)</dt>
          <dd className="text-sm font-medium text-gray-900">${Number(summary.subtotal).toFixed(2)}</dd>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="flex items-center text-sm text-gray-600">
            <span>Tax estimate (18% GST)</span>
          </dt>
          <dd className="text-sm font-medium text-gray-900">${Number(summary.taxAmount).toFixed(2)}</dd>
        </div>
        
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-bold text-gray-900">Order total</dt>
          <dd className="text-base font-bold text-gray-900">${Number(summary.totalAmount).toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <button
          type="button"
          onClick={onCheckout}
          disabled={checkingOut || itemsCount === 0}
          className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {checkingOut ? 'Processing Checkout...' : 'Checkout Now'}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          * Checkout will reserve your items and convert your cart to a pending order.
        </p>
      </div>
    </div>
  );
};

export default CartSummaryPanel;
