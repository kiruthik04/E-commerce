import React from 'react';
import { ShoppingCart, Heart, Eye } from 'lucide-react';

const ProductRecommendationCard = ({ recommendation, onSimulateCart, onSimulateView }) => {
  // In a real scenario, we would join `recommendation.productId` with a Catalog API.
  // For the demo, we generate a mock presentation based on the ID.
  const imageUrl = `https://picsum.photos/seed/${recommendation.productId}/300/300`;
  const price = `${((recommendation.productId * 13 % 100) + 19.99).toFixed(2)}`;

  return (
    <div 
      className="group relative flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden min-w-[240px] max-w-[240px] cursor-pointer"
      onClick={() => onSimulateView(recommendation.productId)}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={`Product ${recommendation.productId}`}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {recommendation.reason && (
           <div className="absolute top-2 left-2 right-2 flex justify-start">
             <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-white/90 text-indigo-700 backdrop-blur-sm shadow-sm ring-1 ring-black/5">
                {recommendation.reason}
             </span>
           </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
           <button 
             className="p-2 bg-white rounded-full shadow-md hover:bg-indigo-50 hover:text-indigo-600 transition"
             onClick={(e) => { e.stopPropagation(); onSimulateCart(recommendation.productId); }}
           >
              <ShoppingCart className="h-5 w-5" />
           </button>
           <button className="p-2 bg-white rounded-full shadow-md hover:bg-rose-50 hover:text-rose-600 transition">
              <Heart className="h-5 w-5" />
           </button>
           <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 hover:text-gray-900 transition flex items-center">
              <Eye className="h-5 w-5 mr-1" />
              <span className="text-xs font-bold">{recommendation.score} pts</span>
           </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pb-5">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
          Trending Product #{recommendation.productId}
        </h3>
        <p className="mt-1 text-xs text-gray-500">Unisex Collection</p>
        <div className="mt-auto flex items-end justify-between pt-4">
          <p className="text-lg font-bold text-gray-900">${price}</p>
          <p className="text-sm font-medium text-indigo-600 group-hover:underline">Shop Now</p>
        </div>
      </div>
    </div>
  );
};

export default ProductRecommendationCard;
