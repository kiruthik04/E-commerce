import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import PaymentSummary from '../components/PaymentSummary';
import api from '../api/axios';
import { ShieldAlert } from 'lucide-react';

const PaymentPage = ({ simulateMode }) => {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();

  // In simulate mode, we mock the orderId and amount for testing
  const [orderId, setOrderId] = useState(paramOrderId || (simulateMode ? Math.floor(Math.random() * 100000) : null));
  const [amount, setAmount] = useState(simulateMode ? (Math.random() * 100).toFixed(2) : 0);
  
  const [method, setMethod] = useState('CARD');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // In a real app, if amount wasn't in state, we would fetch it from the Order microservice here.
  
  const handlePayment = async () => {
    setLoading(true);
    setGlobalError(null);
    try {
      // Step 1: Initiate Payment
      const initRes = await api.post('/initiate', {
        orderId: Number(orderId),
        amount: Number(amount),
        method: method
      });

      const transactionId = initRes.data.transactionId;

      // Small delay to simulate gateway redirect
      setTimeout(async () => {
         try {
           // Step 2: Confirm Payment via webhook simulation
           const confirmRes = await api.post(`/confirm?transactionId=${transactionId}`);
           if (confirmRes.data.status === 'SUCCESS') {
               navigate('/success', { state: { payment: confirmRes.data } });
           } else {
               navigate('/failure', { state: { payment: confirmRes.data } });
           }
         } catch (err) {
             setGlobalError(err.response?.data?.error || 'Gateway callback failed');
             setLoading(false);
         }
      }, 1500);

    } catch (err) {
      setGlobalError(err.response?.data?.error || 'Failed to initiate payment');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Complete your Payment</h1>
        <p className="mt-2 text-sm text-gray-500">
          Choose a payment method to securely finalize your order.
        </p>
      </div>

      {globalError && (
        <div className="mb-8 rounded-md bg-red-50 p-4 border border-red-200 flex items-start">
          <ShieldAlert className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
          <p className="text-sm text-red-700">{globalError}</p>
        </div>
      )}

      {simulateMode && (
         <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
            <h4 className="font-bold text-yellow-800 text-sm">Testing Mode Active</h4>
            <div className="mt-2 flex items-center space-x-4">
              <div>
                 <label className="text-xs font-semibold text-yellow-700 block">Test Amount</label>
                 <input 
                   type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)}
                   className="mt-1 p-1 px-2 border border-yellow-300 rounded w-24 text-sm"
                 />
              </div>
            </div>
         </div>
      )}

      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section className="lg:col-span-7">
          <PaymentMethodSelector selectedMethod={method} onMethodChange={setMethod} />
        </section>

        <section className="lg:col-span-5">
           <PaymentSummary 
             amount={amount}
             orderId={orderId}
             onPay={handlePayment}
             loading={loading}
             selectedMethod={method}
           />
        </section>
      </div>
    </div>
  );
};

export default PaymentPage;
