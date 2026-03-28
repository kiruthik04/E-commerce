import React from 'react';
import { CreditCard, Smartphone, Building, Wallet } from 'lucide-react';

const PaymentMethodSelector = ({ selectedMethod, onMethodChange }) => {
  const methods = [
    { id: 'UPI', name: 'UPI (GPay, PhonePe, Paytm)', icon: Smartphone },
    { id: 'CARD', name: 'Credit / Debit Card', icon: CreditCard },
    { id: 'NETBANKING', name: 'Net Banking', icon: Building },
    { id: 'COD', name: 'Cash on Delivery', icon: Wallet },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <label
              key={method.id}
              className={`relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none transition-all duration-200 ease-in-out ${
                isSelected ? 'border-transparent ring-2 ring-indigo-600 shadow-md' : 'border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.id}
                className="sr-only"
                onChange={() => onMethodChange(method.id)}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-medium text-gray-900 flex items-center">
                    <Icon className={`h-5 w-5 mr-3 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {method.name}
                  </span>
                </span>
              </span>
              {isSelected && (
                <span className="pointer-events-none absolute -inset-px rounded-lg border-2 border-indigo-600" aria-hidden="true" />
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
