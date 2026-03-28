import React from 'react';
import { Check, Package, MapPin, Truck, Home } from 'lucide-react';
import { format } from 'date-fns';

const milestoneConfig = {
  ORDER_PLACED: { icon: Package, color: 'bg-indigo-500', label: 'Order Placed' },
  PACKED: { icon: Check, color: 'bg-indigo-500', label: 'Packed' },
  DISPATCHED: { icon: Check, color: 'bg-amber-500', label: 'Dispatched' },
  IN_TRANSIT: { icon: Truck, color: 'bg-blue-500', label: 'In Transit' },
  OUT_FOR_DELIVERY: { icon: MapPin, color: 'bg-orange-500', label: 'Out for Delivery' },
  DELIVERED: { icon: Home, color: 'bg-green-500', label: 'Delivered' }
};

const MilestoneStep = ({ milestone, isLast, isCompleted, isCurrent }) => {
  const config = milestoneConfig[milestone.milestone] || milestoneConfig.ORDER_PLACED;
  const Icon = config.icon;

  return (
    <div className="relative pb-10">
      {!isLast && (
        <span className="absolute left-5 top-10 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
      )}
      <div className="relative flex items-start space-x-4">
        <div>
          <span className={`h-10 w-10 rounded-full flex items-center justify-center ring-8 ring-white ${isCompleted || isCurrent ? config.color : 'bg-gray-200'} transition-colors duration-500`}>
            {isCompleted || isCurrent ? (
               <Icon className="h-5 w-5 text-white" aria-hidden="true" />
            ) : (
               <div className="h-2.5 w-2.5 rounded-full bg-transparent border-2 border-gray-400" />
            )}
          </span>
        </div>
        <div className="min-w-0 flex-1 pt-1.5">
          <div className="text-sm text-gray-900 font-medium">
             {config.label} {isCurrent && <span className="ml-2 text-xs font-bold text-indigo-600 tracking-wider uppercase bg-indigo-50 px-2 py-0.5 rounded animate-pulse-slow">Current Status</span>}
          </div>
          <div className="mt-1 text-sm text-gray-500">
             {milestone.location && <span>{milestone.location}</span>}
             {milestone.location && milestone.notes && <span className="mx-2">&bull;</span>}
             {milestone.notes && <span className="italic">{milestone.notes}</span>}
          </div>
          {milestone.timestamp && (
            <div className="mt-1 text-xs text-gray-400">
               {format(new Date(milestone.timestamp), "MMM d, yyyy 'at' h:mm a")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneStep;
