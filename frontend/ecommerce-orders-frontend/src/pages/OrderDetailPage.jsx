import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import OrderStatusBadge from '../components/OrderStatusBadge';
import OrderTimeline from '../components/OrderTimeline';
import { Package, ArrowLeft, XCircle } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCanceling(true);
    try {
      const res = await api.put(`/orders/${id}/cancel`);
      setOrder(res.data); // Update with cancelled state
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to cancel order');
    } finally {
      setCanceling(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (error || !order) return <div className="text-red-500 text-center py-10">{error || 'Order not found'}</div>;

  const canCancel = order.status === 'PENDING' || order.status === 'CONFIRMED';
  const shippingAddress = order.shippingAddress ? JSON.parse(order.shippingAddress) : { line1: 'N/A' };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/" className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="flex justify-between items-center px-4 py-5 sm:px-6 border-b border-gray-200">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-500" />
              Order #{order.id}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <OrderStatusBadge status={order.status} />
            {canCancel && (
               <button
                 onClick={handleCancelOrder}
                 disabled={canceling}
                 className="flex items-center text-sm text-red-600 hover:text-red-800 transition"
               >
                 <XCircle className="h-4 w-4 mr-1" />
                 {canceling ? 'Canceling...' : 'Cancel Order'}
               </button>
            )}
          </div>
        </div>
        
        <div className="px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                ${Number(order.totalAmount).toFixed(2)}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {order.paymentId || 'N/A'}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Shipping Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                 <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                   {JSON.stringify(shippingAddress, null, 2)}
                 </pre>
              </dd>
            </div>
            
            <div className="py-4 sm:py-5 sm:px-6 bg-gray-50">
              <dt className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Items in Order</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 bg-white shadow-sm">
                  {order.items.map(item => (
                    <li key={item.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                      <div className="w-0 flex-1 flex items-center">
                        <span className="ml-2 flex-1 w-0 truncate font-medium">
                          {item.productName} (x{item.quantity})
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0 font-medium text-gray-900">
                        ${Number(item.totalPrice).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {/* Timeline view */}
      <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
        <OrderTimeline history={order.history} />
      </div>
    </div>
  );
};

export default OrderDetailPage;
