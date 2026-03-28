import React, { useState } from 'react';
import api from '../api/axios';

const OrderStatusManager = ({ orderId, currentStatus, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const statuses = [
    'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'
  ];

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/admin/orders/${orderId}/status`, { newStatus });
      onStatusUpdate(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const isTerminal = currentStatus === 'CANCELLED' || currentStatus === 'REFUNDED';

  return (
    <div className="flex items-center space-x-3">
      <label htmlFor={`status-${orderId}`} className="text-sm font-medium text-gray-700">
        Change Status:
      </label>
      <select
        id={`status-${orderId}`}
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={loading || isTerminal}
        className="block w-40 pl-3 pr-10 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm border"
      >
        {statuses.map(status => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      {loading && <span className="text-xs text-gray-500 animate-pulse">Updating...</span>}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default OrderStatusManager;
