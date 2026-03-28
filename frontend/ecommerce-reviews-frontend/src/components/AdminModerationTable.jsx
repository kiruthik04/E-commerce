import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import StarRating from './StarRating';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AdminModerationTable = ({ onUpdate }) => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/reviews/pending');
      setPending(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPending(); }, []);

  const handle = async (id, action) => {
    try {
      await api.put(`/api/admin/reviews/${id}/${action}`);
      fetchPending();
      onUpdate && onUpdate();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading moderation queue...</div>;

  if (pending.length === 0) return (
    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-10 text-center">
      <CheckCircle className="h-12 w-12 text-emerald-400 mx-auto mb-3" />
      <p className="text-emerald-800 font-semibold">All clear! No pending reviews.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {pending.map(r => (
        <div key={r.id} className="bg-white rounded-2xl p-5 shadow-sm border border-amber-100">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <StarRating value={r.rating} size="sm" />
                <span className="font-bold text-gray-900 text-sm">{r.title}</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                  <Clock className="h-3 w-3 mr-1" /> Pending
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                By <strong>{r.userName}</strong> (userId:{r.userId}) · Product #{r.productId} · {formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">{r.body}</p>
            </div>
            <div className="flex sm:flex-col gap-2">
              <button onClick={() => handle(r.id, 'approve')}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
              </button>
              <button onClick={() => handle(r.id, 'reject')}
                className="flex items-center px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition">
                <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminModerationTable;
