import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductRecommendationCard from './ProductRecommendationCard';

const RecommendationCarousel = ({ title, recommendations, loading, onSimulateCart, onSimulateView }) => {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
       <div className="py-8">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="flex space-x-6 overflow-hidden">
             {[1, 2, 3, 4].map(n => (
                <div key={n} className="min-w-[240px] h-[380px] bg-gray-100 rounded-2xl animate-pulse"></div>
             ))}
          </div>
       </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
     return null;
  }

  return (
    <div className="py-8 relative animate-fade-in group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
           {title}
        </h2>
        <div className="flex space-x-2">
           <button 
             onClick={scrollLeft}
             className="p-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition disabled:opacity-50"
           >
             <ChevronLeft className="h-5 w-5" />
           </button>
           <button 
             onClick={scrollRight}
             className="p-1.5 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:text-indigo-600 transition"
           >
             <ChevronRight className="h-5 w-5" />
           </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {recommendations.map((rec) => (
          <div key={`${rec.productId}-${rec.score}`} className="shrink-0" style={{ scrollSnapAlign: 'start' }}>
            <ProductRecommendationCard 
               recommendation={rec} 
               onSimulateCart={onSimulateCart}
               onSimulateView={onSimulateView}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCarousel;
