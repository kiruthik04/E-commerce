import React from 'react';
import { MapPin, User, Phone } from 'lucide-react';

const LiveLocationBanner = ({ location, driverName, driverPhone }) => {
  if (!location) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-indigo-100 flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-sm animate-fade-in mb-6">
       <div className="flex items-start sm:items-center">
          <div className="flex-shrink-0 bg-white p-2 rounded-full shadow-sm text-indigo-600 relative">
             <MapPin className="h-6 w-6" />
             <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
          </div>
          <div className="ml-4">
             <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Last Known Location</h4>
             <p className="text-lg text-indigo-900 font-medium">{location}</p>
          </div>
       </div>

       {(driverName || driverPhone) && (
         <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center bg-white py-2 px-4 rounded-md shadow-sm border border-gray-100">
            <div className="flex flex-col mr-4 border-r border-gray-100 pr-4">
               <span className="text-xs text-gray-500 uppercase font-semibold">Driver</span>
               <span className="text-sm font-medium text-gray-900 flex items-center mt-0.5">
                  <User className="h-4 w-4 mr-1 text-gray-400" /> {driverName || 'Assigned'}
               </span>
            </div>
            {driverPhone && (
               <a href={`tel:${driverPhone}`} className="text-indigo-600 hover:text-indigo-800 transition p-1 bg-indigo-50 rounded-full hover:bg-indigo-100">
                  <Phone className="h-4 w-4" />
               </a>
            )}
         </div>
       )}
    </div>
  );
};

export default LiveLocationBanner;
