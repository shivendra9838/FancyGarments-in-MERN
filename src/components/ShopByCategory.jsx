import React from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const categories = [
  { label: 'Tops', image: assets.top1, value: 'Tops' },
  { label: 'Jeans', image: assets.p_img43, value: 'Jeans' },
  { label: 'Shirts', image: assets.p_img39, value: 'Shirts' },
  { label: 'Dresses', image: assets.dress, value: 'Dresses' },
  { label: 'Shorts', image: assets.short, value: 'Shorts' },
  { label: 'Skirts', image: assets.p_img9, value: 'Skirts' },
  { label: 'New Arrival', image: assets.p_img52, value: 'New Arrival', hot: true },
  { label: 'Men', image: assets.p_img11, value: 'Men' },
  { label: 'Women', image: assets.p_img1, value: 'Women' },
  { label: 'T-Shirts', image: assets.p_img2_2, value: 'T-Shirts' },
  { label: 'Trousers', image: assets.p_img7, value: 'Trousers' },
  { label: 'Trackpants', image: assets.p_img10, value: 'Trackpants' },
];

const ShopByCategory = () => {
  const navigate = useNavigate();
  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <span className="inline-block text-2xl font-bold mb-2">🛍 Shop by Category</span>
        <p className="text-gray-500 text-sm">Explore our key segments and find your style</p>
      </div>
      {/* Mobile: horizontal scroll, Desktop: grid */}
      <div className="sm:hidden flex overflow-x-auto gap-4 px-2 pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="flex-shrink-0 flex flex-col items-center w-24 cursor-pointer"
            onClick={() => {
              if (cat.label === 'New Arrival') {
                navigate('/collection?newArrival=true');
              } else {
                navigate(`/collection?category=${encodeURIComponent(cat.value)}`);
              }
            }}
          >
            <div className="relative flex items-center justify-center mb-2">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-20 h-20 object-cover rounded-full border-2 border-gray-200 shadow-md bg-white"
              />
              {cat.hot && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-0.5"><path d="M10 2C10 2 7 6 7 9C7 11.2091 8.79086 13 11 13C13.2091 13 15 11.2091 15 9C15 6 12 2 12 2H10Z" fill="white"/><path d="M10 2C10 2 7 6 7 9C7 11.2091 8.79086 13 11 13C13.2091 13 15 11.2091 15 9C15 6 12 2 12 2H10Z" fill="#ef4444"/></svg>
                  Hot
                </span>
              )}
            </div>
            <span className="font-medium text-center text-sm mt-1 whitespace-nowrap">{cat.label}</span>
          </div>
        ))}
      </div>
      {/* Desktop grid */}
      <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="group cursor-pointer flex flex-col items-center w-full max-w-[120px]"
            onClick={() => {
              if (cat.label === 'New Arrival') {
                navigate('/collection?newArrival=true');
              } else {
                navigate(`/collection?category=${encodeURIComponent(cat.value)}`);
              }
            }}
          >
            <div className="relative flex items-center justify-center mb-2">
              <img
                src={cat.image}
                alt={cat.label}
                className="w-24 h-24 object-cover rounded-full border-2 border-gray-200 shadow group-hover:opacity-80 transition bg-white"
              />
              {cat.hot && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-bounce">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-0.5"><path d="M10 2C10 2 7 6 7 9C7 11.2091 8.79086 13 11 13C13.2091 13 15 11.2091 15 9C15 6 12 2 12 2H10Z" fill="white"/><path d="M10 2C10 2 7 6 7 9C7 11.2091 8.79086 13 11 13C13.2091 13 15 11.2091 15 9C15 6 12 2 12 2H10Z" fill="#ef4444"/></svg>
                  Hot
                </span>
              )}
            </div>
            <span className="font-medium text-center text-base md:text-lg mt-1">{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopByCategory;