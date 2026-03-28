import React, { useState, useEffect } from 'react';
import ReviewCard from './ReviewCard';
import api from '../api/axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (p = 0) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/reviews/product/${productId}?page=${p}&size=5`);
      setReviews(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(p);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(0); }, [productId]);

  if (loading) return (
    <div className="space-y-4">
      {[1,2,3].map(n => <div key={n} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  if (reviews.length === 0) return (
    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
      <p className="text-gray-500">No approved reviews yet. Be the first to review this product!</p>
    </div>
  );

  return (
    <div>
      <div className="space-y-4">
        {reviews.map(r => <ReviewCard key={r.id} review={r} onHelpful={() => fetchReviews(page)} />)}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button disabled={page === 0} onClick={() => fetchReviews(page - 1)}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => fetchReviews(page + 1)}
            className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
