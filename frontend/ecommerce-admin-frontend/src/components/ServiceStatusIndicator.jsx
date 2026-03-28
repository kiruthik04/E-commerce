import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const SERVICES = [
  { name: 'Analytics',  port: 8091, key: 'analyticsUp' },
  { name: 'Inventory',  port: 8089, key: 'inventoryUp' },
  { name: 'Orders',     port: 8086, key: null, assumed: true },
  { name: 'Auth/Users', port: 8085, key: null, assumed: true },
  { name: 'Reviews',    port: 8090, key: null, assumed: true },
  { name: 'Search',     port: 8092, key: null, assumed: true },
  { name: 'Pricing',    port: 8093, key: null, assumed: true },
];

const ServiceStatusIndicator = ({ summary }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Microservice Health</h3>
    <div className="space-y-2">
      {SERVICES.map(({ name, port, key, assumed }) => {
        const isUp = assumed ? null : (summary?.[key] ?? null);
        return (
          <div key={port} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isUp === null ? 'bg-gray-600 animate-pulse' : isUp ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-300">{name}</span>
              <span className="text-[11px] text-gray-600">:{port}</span>
            </div>
            <div className="flex items-center gap-1">
              {isUp === true  && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
              {isUp === false && <XCircle     className="h-3.5 w-3.5 text-red-500" />}
              {isUp === null  && <span className="text-[11px] text-gray-600">not checked</span>}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default ServiceStatusIndicator;
