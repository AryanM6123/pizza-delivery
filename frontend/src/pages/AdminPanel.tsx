import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Making API request...');
      const response = await fetch('https://pizza-delivery-xgd1.onrender.com/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://pizza-delivery-xgd1.onrender.com/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      fetchOrders(); // Refresh orders after update
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Failed to update order status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h2>
              <span className="text-gray-600">₹{order.total.toFixed(2)}</span>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">Delivery Address: {order.address}</p>
              <div className="mt-2">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.name}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateOrderStatus(order._id, 'preparing')}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
                disabled={order.status !== 'pending'}
              >
                <ChefHat className="inline-block mr-2" />
                Preparing
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, 'delivering')}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={order.status !== 'preparing'}
              >
                <Truck className="inline-block mr-2" />
                Out for Delivery
              </button>
              <button
                onClick={() => updateOrderStatus(order._id, 'completed')}
                className="px-4 py-2 bg-green-500 text-white rounded"
                disabled={order.status !== 'delivering'}
              >
                <CheckCircle2 className="inline-block mr-2" />
                Completed
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
