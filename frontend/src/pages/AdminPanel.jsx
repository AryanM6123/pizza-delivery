import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Truck, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/login');
      return;
    }
    
    console.log('Fetching orders...');
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      console.log('Making API request...');
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: status.toLowerCase()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }

      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Bell className="w-6 h-6 text-yellow-500" />;
      case 'Preparing':
        return <Package className="w-6 h-6 text-blue-500" />;
      case 'Out for Delivery':
        return <Truck className="w-6 h-6 text-purple-500" />;
      case 'Delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(orders) && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getStatusIcon(order.status)}
                  <span className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'Preparing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold">Customer Details</h3>
                <p className="text-gray-600">{order.customerName}</p>
                <p className="text-gray-600">{order.address}</p>
                <p className="text-gray-600">{order.phone}</p>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold">Order Items</h3>
                <ul className="mt-2">
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
              <div className="flex gap-2">
                <select
                  className="flex-1 px-4 py-2 border rounded-lg"
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="delivering">Out for Delivery</option>
                  <option value="completed">Delivered</option>
                </select>
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