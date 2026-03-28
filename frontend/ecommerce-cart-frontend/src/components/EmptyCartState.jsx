import React from 'react';
import { ShoppingBag } from 'lucide-react';

const EmptyCartState = () => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 mb-4">
        <ShoppingBag className="h-12 w-12 text-blue-500" />
      </div>
      <h3 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h3>
      <p className="mt-1 text-sm text-gray-500 mb-6">
        Looks like you haven't added any items to your cart yet.
      </p>
      {/* In a real app this would link to the product catalog */}
      <button
        type="button"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        onClick={() => alert("Navigate to Product Catalog")}
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyCartState;
