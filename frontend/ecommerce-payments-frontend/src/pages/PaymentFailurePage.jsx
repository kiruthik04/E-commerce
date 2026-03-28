import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentFailurePage = () => {
  const location = useLocation();
  const payment = location.state?.payment;

  return (
    <div className="max-w-lg mx-auto py-16 px-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-lg border border-red-100 overflow-hidden text-center p-8">
        <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-500 mb-8">
          We couldn't process your payment. Your linked account or card has not been charged.
        </p>

        {payment && (
           <div className="bg-gray-50 rounded-md p-4 mb-8 text-left text-sm text-gray-600">
             <p className="mb-1"><span className="font-semibold text-gray-900">Attempted Amount:</span> ${payment.amount}</p>
             <p className="mb-1"><span className="font-semibold text-gray-900">Reference:</span> #{payment.orderId}</p>
             <p><span className="font-semibold text-gray-900">Reason:</span> Gateway reported failure (Testing simulation).</p>
           </div>
        )}

        <div className="flex flex-col space-y-3">
          <Link
            to={payment ? `/pay/${payment.orderId}` : "/"}
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="w-full inline-flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
