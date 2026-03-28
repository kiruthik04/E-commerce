import React, { useState } from 'react';
import api from '../api/axios';
import StarRating from './StarRating';
import { PenLine } from 'lucide-react';

const WriteReviewForm = ({ productId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a star rating.'); return; }
    setLoading(true); setError(null);
    try {
      await api.post('/api/reviews', { productId, rating, title, body });
      setSuccess(true);
      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Make sure you are logged in.');
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
        <p className="text-emerald-800 font-semibold text-lg">✅ Review submitted!</p>
        <p className="text-emerald-600 text-sm mt-1">Your review is pending moderation and will appear once approved.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
        <PenLine className="h-5 w-5 text-indigo-600" /> Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">{error}</p>}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Your Rating</label>
          <StarRating value={rating} interactive onChange={setRating} size="lg" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Review Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required maxLength={120}
            placeholder="Summarize your experience" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Review</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} required minLength={20} maxLength={2000} rows={5}
            placeholder="Tell others what you think (min 20 characters)"
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          <p className="text-xs text-gray-400 mt-1 text-right">{body.length}/2000</p>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition text-sm">
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReviewForm;
