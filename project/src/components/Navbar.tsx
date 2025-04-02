import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src="https://images.unsplash.com/photo-1590947132387-155cc02f3212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
              alt="Pizza Hub Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="ml-2 text-xl font-bold text-red-600">Pizza King</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/menu" className="text-gray-700 hover:text-red-600">Menu</Link>
            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-red-600">Orders</Link>
                {user.isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-red-600">Admin</Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center text-gray-700 hover:text-red-600">
                <User className="w-5 h-5 mr-1" />
                Login
              </Link>
            )}
            <Link to="/cart" className="flex items-center text-gray-700 hover:text-red-600">
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;