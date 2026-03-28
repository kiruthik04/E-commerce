import React, { useState, useEffect } from 'react';
import { Activity, Zap, ShieldAlert } from 'lucide-react';
import api from '../api/axios';
import TrendingSection from '../components/TrendingSection';
import RecommendationCarousel from '../components/RecommendationCarousel';
import SimilarProducts from '../components/SimilarProducts';

const RecommendationsDemoPage = () => {
  // We mock a logged in user ID for the sake of the algorithm demo
  const mockUserId = 999; 
  
  const [personalRecs, setPersonalRecs] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const fetchPersonalized = async () => {
      try {
        const res = await api.get(`/user/${mockUserId}`);
        setPersonalRecs(res.data);
      } catch (err) {
        console.error('Failed to fetch personalized', err);
      }
  };

  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [personalRes, arrivalsRes] = await Promise.all([
           api.get(`/user/${mockUserId}`),
           api.get('/new-arrivals')
        ]);
        setPersonalRecs(personalRes.data);
        setNewArrivals(arrivalsRes.data);
      } catch (err) {
        console.error('Failed to init recommendations', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBaseData();
  }, [mockUserId]);

  const showToast = (message, weight) => {
     setToast({ message, weight });
     setTimeout(() => setToast(null), 3000);
  };

  // Helper to trigger the tracking API
  const trackBehavior = async (productId, eventType, weight) => {
     try {
       await api.post('/track', { productId, eventType });
       showToast(`${eventType} tracked on Product #${productId}`, weight);
       // Refresh personalized pool to show impact immediately
       fetchPersonalized();
     } catch (err) {
       console.error("Failed to track event", err);
     }
  };

  const handleSimulateCart = (productId) => trackBehavior(productId, 'CART_ADD', 3);
  const handleSimulateView = (productId) => trackBehavior(productId, 'VIEW', 1);
  const handleSimulatePurchase = () => {
     // Pick a random ID to pump for trending
     const randomTopId = Math.floor(Math.random() * 5) + 1;
     trackBehavior(randomTopId, 'PURCHASE', 5);
  };

  return (
    <div className="relative pb-20">
      
      {/* Toast Notification for Tracking Feedback */}
      {toast && (
         <div className="fixed bottom-6 right-6 bg-gray-900 border border-gray-700 text-white p-4 rounded-xl shadow-2xl flex items-center space-x-4 z-50 animate-bounce">
            <div className="bg-indigo-500 rounded-full p-2">
               <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
               <p className="text-sm font-semibold">{toast.message}</p>
               <p className="text-xs text-gray-400">Score Impact: +{toast.weight} points</p>
            </div>
         </div>
      )}

      {/* Hero Control Panel */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 sm:p-12 mb-12 shadow-2xl text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 -tr-10 opacity-10 pointer-events-none">
            <Zap className="h-96 w-96 text-white" />
         </div>
         <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
               AI Recommendations Engine
            </h1>
            <p className="text-lg text-indigo-100 mb-8 max-w-xl">
               Interact with the products below to train your personalized model. Views award 1pt, Cart Adds award 3pts. Watch the Trending section update globally across the cluster.
            </p>
            
            <div className="flex flex-wrap gap-4">
               <button 
                 onClick={handleSimulatePurchase}
                 className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-full shadow-sm text-indigo-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
               >
                 <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                 Simulate Global Purchase (+5 pts)
               </button>
               <button 
                 onClick={() => { localStorage.clear(); window.location.reload(); }}
                 className="inline-flex items-center px-6 py-3 border border-indigo-400 text-base font-semibold rounded-full text-white hover:bg-white/10 transition-all"
               >
                 <ShieldAlert className="h-5 w-5 mr-2" />
                 Reset Local State
               </button>
            </div>
         </div>
      </div>

      <div className="space-y-16">
         {/* Personalized Section */}
         <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <RecommendationCarousel 
              title="Recommended For You" 
              recommendations={personalRecs} 
              loading={loading}
              onSimulateCart={handleSimulateCart}
              onSimulateView={handleSimulateView}
            />
         </div>

         {/* Trending Section (Self-polling component) */}
         <TrendingSection 
            onSimulateCart={handleSimulateCart}
            onSimulateView={handleSimulateView}
         />

         {/* Mixed Demo Context Section */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <SimilarProducts 
                  productId={10} 
                  onSimulateCart={handleSimulateCart}
                  onSimulateView={handleSimulateView}
               />
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
               <RecommendationCarousel 
                 title="New Arrivals" 
                 recommendations={newArrivals} 
                 loading={loading}
                 onSimulateCart={handleSimulateCart}
                 onSimulateView={handleSimulateView}
               />
            </div>
         </div>
      </div>

    </div>
  );
};

export default RecommendationsDemoPage;
