import React, { useState } from 'react';
import api from '../api/axios';
import { X, Save } from 'lucide-react';

const StockUpdateModal = ({ item, onClose, onSaved }) => {
  const [qty, setQty] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!qty) { setError('Quantity is required'); return; }
    setLoading(true);
    setError(null);
    try {
      await api.put(`/${item.productId}`, {
        quantity: parseInt(qty, 10),
        notes: notes || 'Manual admin adjustment',
        referenceType: 'MANUAL'
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Update Stock — Product #{item.productId}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Current Available</p>
              <p className="font-bold text-slate-900 text-xl">{item.quantityAvailable}</p>
            </div>
            <div>
              <p className="text-slate-500">Reserved</p>
              <p className="font-bold text-slate-900 text-xl">{item.quantityReserved}</p>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Quantity Adjustment <span className="font-normal text-slate-400">(use negative to deduct)</span>
            </label>
            <input
              type="number"
              value={qty}
              onChange={e => setQty(e.target.value)}
              placeholder="e.g. 50 or -10"
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Notes</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Optional reason for adjustment"
              className="block w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2.5 bg-emerald-600 rounded-lg text-sm font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-50">
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockUpdateModal;
