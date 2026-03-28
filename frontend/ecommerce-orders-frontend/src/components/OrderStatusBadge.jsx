import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getStatusConfig = (s) => {
    switch (s) {
      case 'PENDING': return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' };
      case 'CONFIRMED': return { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' };
      case 'PROCESSING': return { color: 'bg-indigo-100 text-indigo-800', label: 'Processing' };
      case 'SHIPPED': return { color: 'bg-purple-100 text-purple-800', label: 'Shipped' };
      case 'DELIVERED': return { color: 'bg-green-100 text-green-800', label: 'Delivered' };
      case 'CANCELLED': return { color: 'bg-red-100 text-red-800', label: 'Cancelled' };
      case 'REFUNDED': return { color: 'bg-gray-100 text-gray-800', label: 'Refunded' };
      default: return { color: 'bg-gray-100 text-gray-800', label: s };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
