import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, RefreshCcw } from 'lucide-react';
import RefundRequestForm from '../components/RefundRequestForm';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const payment = location.state?.payment;
  
  const [showRefund, setShowRefund] = useState(false);
  const [refundedState, setRefundedState] = useState(payment?.status === 'REFUNDED');

  if (!payment) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Session Expired</h2>
        <Link to="/" className="text-indigo-600 hover:underline mt-4 inline-block">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-100">
        <div className="bg-green-600 px-6 py-12 text-center text-white">
          <CheckCircle className="mx-auto h-16 w-16 text-green-100 mb-4" />
          <h1 className="text-3xl font-extrabold tracking-tight">Payment Successful!</h1>
          <p className="mt-2 text-lg font-medium text-green-100">
            Thank you for your order.
          </p>
        </div>
        
        <div className="px-6 py-8 sm:p-10">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-4 mb-4">Transaction Details</h3>
          
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
              <dd className="mt-1 text-sm text-gray-900 font-mono">{payment.transactionId}</dd>
            </div>
            <div>
               <dt className="text-sm font-medium text-gray-500">Order Reference</dt>
               <dd className="mt-1 text-sm text-gray-900">#{payment.orderId}</dd>
            </div>
            <div>
               <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
               <dd className="mt-1 text-sm font-bold text-gray-900">${payment.amount.toFixed(2)}</dd>
            </div>
            <div>
               <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
               <dd className="mt-1 text-sm text-gray-900">{payment.method}</dd>
            </div>
            <div>
               <dt className="text-sm font-medium text-gray-500">Date</dt>
               <dd className="mt-1 text-sm text-gray-900">{new Date().toLocaleString()}</dd>
            </div>
            <div>
               <dt className="text-sm font-medium text-gray-500">Status</dt>
               <dd className="mt-1">
                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${refundedState ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                   {refundedState ? 'REFUNDED' : 'SUCCESS'}
                 </span>
               </dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-col sm:flex-row sm:justify-between items-center sm:space-x-4 border-t border-gray-200 pt-6">
            <Link to="/" className="w-full sm:w-auto text-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition">
              Continue Shopping
            </Link>
            
            {!refundedState && (
              <button 
                onClick={() => setShowRefund(true)}
                className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition"
              >
                <RefreshCcw className="h-4 w-4 mr-2" />
                Request Refund
              </button>
            )}
          </div>
        </div>
      </div>

      {showRefund && (
        <RefundRequestForm 
           paymentId={payment.id}
           maxAmount={payment.amount}
           onCancel={() => setShowRefund(false)}
           onSuccess={(refund) => {
              setShowRefund(false);
              setRefundedState(true);
              alert('Refund processed successfully!');
           }}
        />
      )}
    </div>
  );
};

export default PaymentSuccessPage;
