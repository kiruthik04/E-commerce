import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity, onQuantityChange, disabled }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded-md w-28">
      <button
        type="button"
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={disabled || quantity <= 1}
        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-r border-gray-300"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="flex-1 text-center text-sm font-medium py-1">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={disabled}
        className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed border-l border-gray-300"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;
