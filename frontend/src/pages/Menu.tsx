import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { pizzas } from '../data/menuData';
import PizzaCard from '../components/PizzaCard';

const Menu = () => {
  const { addToCart } = useCart();
  const [category, setCategory] = useState('all');

  const filteredPizzas = category === 'all' 
    ? pizzas 
    : pizzas.filter(pizza => pizza.category === category);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pizzas.map((pizza) => (
          <div key={pizza.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={pizza.image} alt={pizza.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{pizza.name}</h2>
              <p className="text-gray-600 mb-4">{pizza.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">₹{pizza.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(pizza)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;