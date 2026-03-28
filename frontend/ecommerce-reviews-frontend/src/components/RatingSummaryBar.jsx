import React from 'react';
import StarRating from './StarRating';

const RatingSummaryBar = ({ summary }) => {
  if (!summary) return null;
  const { averageRating, totalReviews, breakdown } = summary;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Big Average */}
        <div className="text-center flex-shrink-0">
          <p className="text-6xl font-extrabold text-gray-900">{averageRating?.toFixed(1) ?? '—'}</p>
          <StarRating value={Math.round(averageRating || 0)} size="md" />
          <p className="text-sm text-gray-500 mt-1">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
        </div>

        {/* Breakdown Bars */}
        <div className="flex-1 w-full space-y-1.5">
          {[5, 4, 3, 2, 1].map(star => {
            const count = breakdown?.[star] ?? 0;
            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-right text-gray-500">{star}</span>
                <span className="text-yellow-400 text-xs">★</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-gray-400 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RatingSummaryBar;
