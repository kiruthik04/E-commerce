import React from 'react';
import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';

const CartItemRow = ({ item, onQuantityChange, onRemove, updating }) => {
  return (
    <li className="flex py-6 px-4 sm:px-6 hover:bg-gray-50 transition-colors">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={item.productImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=200"}
          alt={item.productName}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col justify-between">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="line-clamp-2 pr-4">{item.productName}</h3>
            <p className="ml-4">${Number(item.totalPrice).toFixed(2)}</p>
          </div>
          {item.variantLabel && (
            <p className="mt-1 text-sm text-gray-500">{item.variantLabel}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">${Number(item.unitPrice).toFixed(2)} / each</p>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm mt-4">
          <QuantitySelector 
            quantity={item.quantity} 
            onQuantityChange={(newQty) => onQuantityChange(item.id, newQty)}
            disabled={updating}
          />

          <div className="flex bg-white">
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={updating}
              className="font-medium text-red-500 hover:text-red-600 flex items-center p-2 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItemRow;
