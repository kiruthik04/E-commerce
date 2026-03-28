import React from 'react';
import { Edit2, History, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const stockBadge = (avail, threshold) => {
  if (avail === 0) return { cls: 'bg-red-100 text-red-800 font-bold', label: 'Out of Stock' };
  if (avail <= threshold) return { cls: 'bg-amber-100 text-amber-800 font-semibold', label: 'Low Stock' };
  return { cls: 'bg-emerald-100 text-emerald-800', label: 'In Stock' };
};

const InventoryTable = ({ items, onEdit, onHistory }) => {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-medium">No inventory records found.</p>
        <p className="text-sm mt-1">Add products to start tracking stock levels.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Product ID</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Warehouse</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-600">Available</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-600">Reserved</th>
            <th className="px-4 py-3 text-right font-semibold text-slate-600">Threshold</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-600">Status</th>
            <th className="px-4 py-3 text-center font-semibold text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map(item => {
            const badge = stockBadge(item.quantityAvailable, item.lowStockThreshold);
            return (
              <tr key={item.id} className={`hover:bg-slate-50 transition ${item.quantityAvailable === 0 ? 'bg-red-50/40' : item.lowStock ? 'bg-amber-50/40' : ''}`}>
                <td className="px-4 py-4">
                  <span className="font-mono font-semibold text-slate-800">#{item.productId}</span>
                  {item.variantId && <span className="ml-2 text-xs text-slate-400">v{item.variantId}</span>}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-slate-100 font-medium">
                    {item.warehouseLocation}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className={`text-lg font-bold ${item.quantityAvailable === 0 ? 'text-red-600' : item.lowStock ? 'text-amber-600' : 'text-slate-900'}`}>
                    {item.quantityAvailable}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-semibold text-slate-500">{item.quantityReserved}</td>
                <td className="px-4 py-4 text-right text-slate-400">{item.lowStockThreshold}</td>
                <td className="px-4 py-4 text-center">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${badge.cls}`}>
                    {badge.label}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button onClick={() => onEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition"
                      title="Update stock">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => onHistory(item.productId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="View movement history">
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryTable;
