import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import RecommendationCarousel from './RecommendationCarousel';

const TrendingSection = ({ onSimulateCart, onSimulateView }) => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/trending');
        setTrending(res.data);
      } catch (err) {
        console.error('Failed to fetch trending', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
    
    // Auto-refresh trending every 10 seconds for demo purposes
    const intervalId = setInterval(fetchTrending, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <RecommendationCarousel 
      title="Trending Worldwide" 
      recommendations={trending} 
      loading={loading} 
      onSimulateCart={onSimulateCart}
      onSimulateView={onSimulateView}
    />
  );
};

export default TrendingSection;
