import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import RatingSummaryBar from '../components/RatingSummaryBar';
import ReviewList from '../components/ReviewList';
import WriteReviewForm from '../components/WriteReviewForm';
import { Package } from 'lucide-react';

const DEMO_PRODUCT_IDS = [1, 2, 3];

const ReviewsPage = () => {
  const [selectedProductId, setSelectedProductId] = useState(1);
  const [summary, setSummary] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchSummary = async () => {
    try {
      const res = await api.get(`/api/reviews/product/${selectedProductId}/summary`);
      setSummary(res.data);
    } catch (err) {
      setSummary({ averageRating: 0, totalReviews: 0, breakdown: { 1:0, 2:0, 3:0, 4:0, 5:0 } });
    }
  };

  useEffect(() => { fetchSummary(); }, [selectedProductId, refreshKey]);

  const handleReviewSuccess = () => setRefreshKey(k => k + 1);

  return (
    <div>
      {/* Product Selector */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">Browse customer reviews and ratings.</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-600">Viewing Product:</label>
          <div className="flex items-center gap-1">
            {DEMO_PRODUCT_IDS.map(id => (
              <button
                key={id}
                onClick={() => setSelectedProductId(id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  selectedProductId === id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Package className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />#{id}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Summary + Write Form */}
        <div className="space-y-6">
          <RatingSummaryBar summary={summary} />
          <WriteReviewForm productId={selectedProductId} onSuccess={handleReviewSuccess} />
        </div>

        {/* Right: Review List */}
        <div className="lg:col-span-2">
          <ReviewList key={`${selectedProductId}-${refreshKey}`} productId={selectedProductId} />
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
