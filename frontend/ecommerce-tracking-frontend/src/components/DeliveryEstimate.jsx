import React from 'react';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';

const DeliveryEstimate = ({ date, isDelivered }) => {
  if (!date) return null;

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-6 flex items-center justify-between mb-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${isDelivered ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
           <Clock className="h-6 w-6" />
        </div>
        <div className="ml-4">
           <h3 className="text-sm font-medium text-gray-500">
              {isDelivered ? 'Delivered On' : 'Estimated Delivery By'}
           </h3>
           <p className="text-xl font-bold text-gray-900">
             {format(new Date(date), 'EEEE, MMMM do')}
           </p>
        </div>
      </div>
      
      {!isDelivered && (
        <div className="hidden sm:block">
           <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              On Time
           </span>
        </div>
      )}
    </div>
  );
};

export default DeliveryEstimate;
