import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import CartItemRow from '../components/CartItemRow';
import CartSummaryPanel from '../components/CartSummaryPanel';
import EmptyCartState from '../components/EmptyCartState';
import { Trash } from 'lucide-react';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [clearingCart, setClearingCart] = useState(false);

  useEffect(() => {
    fetchActiveCart();
  }, []);

  const fetchActiveCart = async () => {
    try {
      const res = await api.get('/');
      setCart(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setUpdatingItemId(itemId);
    try {
      const res = await api.put(`/items/${itemId}?quantity=${newQuantity}`);
      setCart(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update quantity');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItemId(itemId);
    try {
      const res = await api.delete(`/items/${itemId}`);
      setCart(res.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to remove item');
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to empty your cart?")) return;
    setClearingCart(true);
    try {
      await api.delete('/');
      fetchActiveCart(); // Re-fetch to get empty state
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to clear cart');
    } finally {
      setClearingCart(false);
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      const res = await api.post('/checkout');
      alert(`Checkout successful! Total: $${res.data.totalAmount}. In a complete platform, you would now be redirected to the Order flow.`);
      fetchActiveCart(); // Re-fetch, should yield a new active cart
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to checkout');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-32">
       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error && !cart) return (
    <div className="text-red-500 text-center py-10 bg-red-50 rounded-lg border border-red-100 max-w-2xl mx-auto">
      <p className="font-medium text-lg mb-2">Error Loading Cart</p>
      <p>{error}</p>
    </div>
  );

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Shopping Cart</h1>
        {hasItems && (
          <button 
            onClick={handleClearCart}
            disabled={clearingCart || checkingOut}
            className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center transition-colors disabled:opacity-50"
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear Cart
          </button>
        )}
      </div>

      {!hasItems ? (
        <EmptyCartState />
      ) : (
        <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7 xl:col-span-8">
            <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
            <ul role="list" className="divide-y divide-gray-200 border-t border-b border-gray-200 bg-white shadow-sm rounded-lg overflow-hidden">
              {cart.items.map((item) => (
                <CartItemRow 
                  key={item.id} 
                  item={item} 
                  onQuantityChange={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  updating={updatingItemId === item.id || checkingOut || clearingCart}
                />
              ))}
            </ul>
          </section>

          <section aria-labelledby="summary-heading" className="mt-16 bg-white shadow-sm rounded-lg lg:col-span-5 xl:col-span-4 lg:mt-0 lg:sticky lg:top-24">
            <h2 id="summary-heading" className="sr-only">Order summary</h2>
            <CartSummaryPanel 
               summary={cart.summary} 
               itemsCount={cart.summary.totalItems}
               onCheckout={handleCheckout}
               checkingOut={checkingOut}
            />
          </section>
        </div>
      )}
    </div>
  );
};

export default CartPage;
