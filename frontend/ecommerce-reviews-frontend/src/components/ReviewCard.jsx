import React from 'react';
import StarRating from './StarRating';
import { ThumbsUp, ShieldCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import api from '../api/axios';

const ReviewCard = ({ review, onHelpful }) => {
  const handleHelpful = async () => {
    try {
      await api.put(`/api/reviews/${review.id}/helpful`);
      onHelpful && onHelpful();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition group">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <StarRating value={review.rating} size="sm" />
            <span className="text-sm font-bold text-gray-900">{review.title}</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="font-medium text-gray-700">{review.userName}</span>
            {review.isVerifiedPurchase && (
              <span className="flex items-center text-emerald-600">
                <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified Purchase
              </span>
            )}
            <span>•</span>
            <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed">{review.body}</p>

      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
        <p className="text-xs text-gray-400">Was this helpful?</p>
        <button
          onClick={handleHelpful}
          className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-indigo-600 transition"
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>Yes ({review.helpfulCount})</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
