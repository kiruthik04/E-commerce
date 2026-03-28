import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Wifi, WifiOff } from 'lucide-react';
import useOrderTracking from '../hooks/useOrderTracking';
import TrackingTimeline from '../components/TrackingTimeline';
import LiveLocationBanner from '../components/LiveLocationBanner';
import DeliveryEstimate from '../components/DeliveryEstimate';

const TrackingPage = () => {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  // Use the WebSocket tracking hook
  const { trackingData, loading, error, connected } = useOrderTracking(paramOrderId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
       navigate(`/${searchInput.trim()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Search Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8 border border-gray-200">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between">
           <div>
             <h1 className="text-2xl font-bold text-gray-900">Track Your Package</h1>
             <p className="text-sm text-gray-500 mt-1">Enter your Order ID to see real-time updates.</p>
           </div>
           
           <form onSubmit={handleSearch} className="mt-4 sm:mt-0 relative flex shadow-sm rounded-md w-full sm:max-w-xs">
              <input
                type="text"
                placeholder="Order ID..."
                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2 border"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
              >
                <Search className="h-4 w-4 text-gray-400" />
                <span>Track</span>
              </button>
           </form>
         </div>
      </div>

      {!paramOrderId && !loading && (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm border-dashed">
           <PackageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
           <p className="text-gray-500 font-medium">Please enter an Order ID above to begin tracking.</p>
        </div>
      )}

      {loading && paramOrderId && (
        <div className="flex justify-center py-24">
           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-md">
           <div className="flex">
              <div className="ml-3">
                 <p className="text-sm text-red-700 font-medium">{error}</p>
                 <p className="text-xs text-red-500 mt-1">Check that you entered a valid Order Tracking ID.</p>
              </div>
           </div>
        </div>
      )}

      {trackingData && !loading && (
        <div className="space-y-6">
           <div className="flex justify-between items-center px-2">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                 Order <span className="text-indigo-600">#{trackingData.orderId}</span>
              </h2>
              <div className="flex items-center text-xs font-semibold px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100">
                 {connected ? (
                   <><Wifi className="h-3 w-3 text-green-500 mr-1.5" /> <span className="text-green-700">Live Connection</span></>
                 ) : (
                   <><WifiOff className="h-3 w-3 text-red-400 mr-1.5" /> <span className="text-red-600">Offline</span></>
                 )}
              </div>
           </div>

           <DeliveryEstimate 
             date={trackingData.estimatedDelivery} 
             isDelivered={trackingData.currentStatus === 'DELIVERED'} 
           />
           
           {trackingData.currentStatus !== 'DELIVERED' && trackingData.currentStatus !== 'ORDER_PLACED' && (
             <LiveLocationBanner 
               location={trackingData.currentLocation}
               driverName={trackingData.driverName}
               driverPhone={trackingData.driverPhone}
             />
           )}

           <TrackingTimeline 
             currentStatus={trackingData.currentStatus}
             history={trackingData.history}
           />
        </div>
      )}
    </div>
  );
};

// Helper SVG icon for initial empty state
const PackageIcon = (props) => (
  <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
)

export default TrackingPage;
