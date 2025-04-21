import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { user } = useAuth();
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        navigate('/login');
        return;
      }

      navigate('/checkout');
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button
          onClick={() => navigate('/menu')}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/menu" className="text-red-600 hover:text-red-700">
            Browse our menu
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">₹{item.price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-4">
              <span>Subtotal:</span>
              <span>₹{getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span>GST (18%):</span>
              <span>₹{(getTotal() * 0.18).toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg font-bold">
              <span>Total:</span>
              <span>₹{(getTotal() * 1.18).toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
      {cart.map((item) => (
        <li key={item.id} className="text-gray-600">
          {item.quantity}x {item.name} - ₹{(item.price * item.quantity).toFixed(2)}
        </li>
      ))}
      <div className="mt-2 font-semibold">
        Total: ₹{getTotal().toFixed(2)}
      </div>
    </div>
  );
};

export default Cart;