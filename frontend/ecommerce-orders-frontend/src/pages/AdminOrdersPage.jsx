import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import OrderCard from '../components/OrderCard';
import OrderStatusManager from '../components/OrderStatusManager';
import { ShieldCheck, Loader2 } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Basic pagination state
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const fetchOrders = async (pageNum) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/orders?page=${pageNum}&size=10&sort=createdAt,desc`);
      setOrders(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admin orders. Ensure you have the ADMIN role.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderInState = (updatedOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
  };

  if (loading && orders.length === 0) return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin h-12 w-12 text-blue-600 mb-4" />
      <p className="text-gray-500 font-medium">Loading administrative dashboard...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-red-700 bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg max-w-4xl mx-auto shadow-sm">
      <div className="flex items-center mb-2">
        <ShieldCheck className="h-6 w-6 mr-2" />
        <h3 className="font-bold text-lg">Access Denied</h3>
      </div>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8 pb-4 border-b border-gray-200">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate flex items-center">
            <ShieldCheck className="h-8 w-8 mr-3 text-red-600" />
            Admin Order Management
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            View and mutate the status of all orders across the platform.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-10 bg-white rounded-lg shadow-sm border border-gray-100">No orders found in the system.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="relative">
              <OrderCard order={order} isAdmin={true} />
              <div className="absolute top-24 right-6 sm:top-6 bg-white p-2 rounded-md shadow-sm border border-gray-200 z-10">
                <OrderStatusManager 
                  orderId={order.id} 
                  currentStatus={order.status} 
                  onStatusUpdate={updateOrderInState} 
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${page === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm'}`}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 text-sm font-medium flex items-center">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className={`px-4 py-2 border rounded-md text-sm font-medium ${page === totalPages - 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
