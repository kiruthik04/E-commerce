import React from 'react';
import { Link } from 'react-router-dom';
import OrderStatusBadge from './OrderStatusBadge';
import { Package, Clock } from 'lucide-react';

const OrderCard = ({ order, isAdmin, onStatusUpdate }) => {
  const itemCount = order.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 bg-gray-50">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-gray-400" />
            Order #{order.id}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <OrderStatusBadge status={order.status} />
          <Link 
            to={`/orders/${order.id}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd className="mt-1 text-base font-semibold text-gray-900">${Number(order.totalAmount).toFixed(2)}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Items</dt>
            <dd className="mt-1 text-sm text-gray-900">{itemCount} items</dd>
          </div>
          {isAdmin && (
            <div className="sm:col-span-1 border-l pl-4 border-gray-200">
              <dt className="text-sm font-medium text-gray-500 mb-1">User ID</dt>
              <dd className="text-sm text-gray-900">User #{order.userId}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
};

export default OrderCard;
