import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Add error state

  // Add useEffect to check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Update the handleSubmit function to include the total with GST
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          total: getTotal() * 1.18,
          address
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      clearCart();
      navigate('/orders');
    } catch (error) {
      setError(error.message || 'Failed to place order');
      console.error('Order error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add error display in the return statement
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={user?.name || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Delivery Address"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.quantity}x {item.name}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>GST (18%)</span>
                <span>₹{(getTotal() * 0.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{(getTotal() * 1.18).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;