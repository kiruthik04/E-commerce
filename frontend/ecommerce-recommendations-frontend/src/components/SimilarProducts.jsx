import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import RecommendationCarousel from './RecommendationCarousel';

const SimilarProducts = ({ productId, onSimulateCart, onSimulateView }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/similar/${productId}`);
        setSimilar(res.data);
      } catch (err) {
        console.error('Failed to fetch similar', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [productId]);

  return (
    <RecommendationCarousel 
      title="Similar Products You May Like" 
      recommendations={similar} 
      loading={loading} 
      onSimulateCart={onSimulateCart}
      onSimulateView={onSimulateView}
    />
  );
};

export default SimilarProducts;
