import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, History } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const movementColor = {
  STOCK_IN:   'bg-emerald-100 text-emerald-800',
  STOCK_OUT:  'bg-red-100 text-red-800',
  RESERVED:   'bg-blue-100 text-blue-800',
  RELEASED:   'bg-indigo-100 text-indigo-800',
  ADJUSTMENT: 'bg-orange-100 text-orange-800',
};

const StockMovementHistory = ({ productId, onClose }) => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/${productId}/movements`)
      .then(r => setMovements(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-bold text-slate-900">Movement History — Product #{productId}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading...</div>
          ) : movements.length === 0 ? (
            <div className="p-8 text-center text-slate-400">No movements recorded yet.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Qty</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Reference</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Notes</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {movements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold ${movementColor[m.movementType] || 'bg-slate-100 text-slate-700'}`}>
                        {m.movementType}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">{m.quantity}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {m.referenceType && <span>{m.referenceType} #{m.referenceId}</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs max-w-[150px] truncate">{m.notes || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {formatDistanceToNow(new Date(m.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockMovementHistory;
