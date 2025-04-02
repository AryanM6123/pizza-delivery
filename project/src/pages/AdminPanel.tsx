import React, { useState, useEffect } from 'react';
import { Clock, ChefHat, Truck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Expected array of orders but got:', typeof data);
        setOrders([]);
        return;
      }

      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'preparing': return <ChefHat className="w-6 h-6 text-blue-500" />;
      case 'delivering': return <Truck className="w-6 h-6 text-purple-500" />;
      case 'completed': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      default: return null;
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>
      
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
        >
          All Orders
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('preparing')}
          className={`px-4 py-2 rounded ${filter === 'preparing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Preparing
        </button>
        <button
          onClick={() => setFilter('delivering')}
          className={`px-4 py-2 rounded ${filter === 'delivering' ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}
        >
          Delivering
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Completed
        </button>
      </div>

      <div className="grid gap-6">
        {filteredOrders && filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                  <p className="text-gray-600">Customer ID: {order.userId}</p>
                  <p className="text-gray-600">Total: ₹{(order.total).toFixed(2)}</p>
                  <p className="text-gray-600">Delivery Address: {order.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-2">Items:</h3>
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li key={index} className="text-gray-600">
                      {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
                <div className="mt-2 font-semibold">
                  Total: ₹{order.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                </div>
              </div>

              <div className="mt-4 flex space-x-4">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === 'preparing' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'delivering')}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  >
                    Ready for Delivery
                  </button>
                )}
                {order.status === 'delivering' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'completed')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Delivered Successfully
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-600">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;