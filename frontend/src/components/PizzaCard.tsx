import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface PizzaProps {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const PizzaCard: React.FC<PizzaProps> = ({ id, name, description, price, image }) => {
  const { addToCart } = useCart();
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    addToCart({ id, name, price });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      {showNotification && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
          Added to cart!
        </div>
      )}
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">₹{price.toFixed(2)}</span>
          <button
            onClick={handleAddToCart}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
