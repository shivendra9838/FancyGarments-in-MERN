import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const categories = [
  {
    label: 'T-Shirts',
    icon: '👕',
    image: assets.p_img1,
    value: 'T-Shirts',
  },
  {
    label: 'Bottomwear',
    icon: '👖',
    image: assets.p_img7,
    value: 'Bottomwear',
  },
  {
    label: 'Ethnic Wear',
    icon: '👗',
    image: assets.p_img13,
    value: 'Ethnic Wear',
  },
  {
    label: 'Hoodies',
    icon: '🧥',
    image: assets.p_img21,
    value: 'Hoodies',
  },
];

const ShopByCategory = () => {
  const navigate = useNavigate();
  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <span className="inline-block text-2xl font-bold mb-2">🛍️ Shop by Category</span>
        <p className="text-gray-500 text-sm">Explore our key segments and find your style</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center w-48 hover:scale-105 hover:shadow-2xl transition-all border-b-4 border-pink-200"
            onClick={() => navigate(`/collection?category=${encodeURIComponent(cat.value)}`)}
          >
            <span className="text-4xl mb-2">{cat.icon}</span>
            <img src={cat.image} alt={cat.label} className="w-24 h-24 object-cover rounded mb-3 border shadow group-hover:opacity-80" />
            <span className="font-semibold text-lg mb-1">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory; 