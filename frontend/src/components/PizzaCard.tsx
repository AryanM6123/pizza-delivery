import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

interface PizzaProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const PizzaCard: React.FC<PizzaProps> = ({ id, name, description, price, image }) => {
  const { addToCart } = useCart();
  const [buttonText, setButtonText] = useState('Add to Cart');

  const handleClick = () => {
    console.log(`Clicked Add to Cart for: ${name}`); // ✅ log click
    addToCart({ id, name, price, image, quantity: 1 });

    setButtonText('Added!');
    console.log(`Button text changed to "Added!" for: ${name}`); // ✅ log text change

    setTimeout(() => {
      setButtonText('Add to Cart');
      console.log(`Button text reset for: ${name}`); // ✅ log text reset
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">₹{price.toFixed(2)}</span>
          <button
            onClick={handleClick}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors border border-black"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;
