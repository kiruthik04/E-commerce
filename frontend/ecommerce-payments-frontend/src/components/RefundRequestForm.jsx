import React, { useState } from 'react';
import api from '../api/axios';

const RefundRequestForm = ({ paymentId, maxAmount, onSuccess, onCancel }) => {
  const [amount, setAmount] = useState(maxAmount);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError("Please provide a reason");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/${paymentId}/refund`, {
        amount: Number(amount),
        reason
      });
      onSuccess(res.data);
    } catch (err) {
       setError(err.response?.data?.error || 'Failed to submit refund request');
    } finally {
       setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Request Refund</h3>
        
        {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount ($)</label>
            <input 
               type="number"
               step="0.01"
               max={maxAmount}
               min="0.01"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
               required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
            <textarea 
               value={reason}
               onChange={(e) => setReason(e.target.value)}
               className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
               rows={3}
               placeholder="Why are you requesting a refund?"
               required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button 
               type="button" 
               onClick={onCancel}
               disabled={loading}
               className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
               type="submit"
               disabled={loading}
               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
            >
              {loading ? 'Submitting...' : 'Submit Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RefundRequestForm;
