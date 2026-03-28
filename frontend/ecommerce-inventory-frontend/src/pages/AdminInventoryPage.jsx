import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import InventoryTable from '../components/InventoryTable';
import StockUpdateModal from '../components/StockUpdateModal';
import StockMovementHistory from '../components/StockMovementHistory';
import LowStockAlert from '../components/LowStockAlert';
import { RefreshCcw, Plus, Package } from 'lucide-react';

// Mock product IDs for initial demo seeding
const DEMO_PRODUCT_IDS = [1, 2, 3, 4, 5];

const AdminInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [historyProductId, setHistoryProductId] = useState(null);
  const [addProductId, setAddProductId] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        DEMO_PRODUCT_IDS.map(id => api.get(`/${id}`))
      );
      const loaded = results
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value.data);
      setItems(loaded);
      setLowStockItems(loaded.filter(i => i.lowStock));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleAddProduct = async () => {
    if (!addProductId) return;
    setSaving(true);
    try {
      await api.put(`/${addProductId}`, {
        quantity: 100,
        notes: 'Initial stock',
        referenceType: 'MANUAL'
      });
      setAddProductId('');
      fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-600" />
            Inventory & Warehouse
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage stock levels, reserve items, and track all movements across warehouses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={addProductId}
            onChange={e => setAddProductId(e.target.value)}
            placeholder="Product ID"
            className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button onClick={handleAddProduct} disabled={saving}
            className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition disabled:opacity-50">
            <Plus className="w-4 h-4 mr-1" /> Add Product
          </button>
          <button onClick={fetchAll} disabled={loading}
            className="p-2 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 transition">
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <LowStockAlert items={lowStockItems} />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">All SKUs</h2>
          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{items.length} products</span>
        </div>
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <RefreshCcw className="animate-spin h-8 w-8 mx-auto mb-3 text-slate-300" />
            Loading inventory…
          </div>
        ) : (
          <InventoryTable
            items={items}
            onEdit={item => setEditItem(item)}
            onHistory={id => setHistoryProductId(id)}
          />
        )}
      </div>

      {editItem && (
        <StockUpdateModal
          item={editItem}
          onClose={() => setEditItem(null)}
          onSaved={fetchAll}
        />
      )}

      {historyProductId && (
        <StockMovementHistory
          productId={historyProductId}
          onClose={() => setHistoryProductId(null)}
        />
      )}
    </div>
  );
};

export default AdminInventoryPage;
