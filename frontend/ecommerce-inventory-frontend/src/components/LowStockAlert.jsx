import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

const LowStockAlert = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-amber-800 text-sm">
          Low Stock Warning — {items.length} product{items.length > 1 ? 's' : ''} need restocking
        </h3>
        <p className="mt-1 text-xs text-amber-700">
          Products below threshold: {items.map(i => `#${i.productId} (${i.quantityAvailable} left)`).join(', ')}
        </p>
      </div>
    </div>
  );
};

export default LowStockAlert;
