import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const ProductItem = ({ item }) => {
  if (!item) return null;

  const { _id, name, price, images, bestseller, isNewArrival } = item;
  const { currency, backendUrl, addToWishlist, wishlist } = useContext(ShopContext);

  const imgSrc = images?.[0]
    ? (images[0].startsWith('http') ? images[0] : `${backendUrl}/${images[0].replace(/^\/+/, '')}`)
    : '/placeholder.jpg';

  // Optional: check if already in wishlist to toggle icon color
  const inWishlist = wishlist?.some(w => w.productId === _id);

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(item);
  };

  return (
    <div className='group relative flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden border border-gray-100 dark:border-gray-700 w-full'>
      
      {/* Link Wraps the Entire Card */}
      <Link className='flex flex-col h-full cursor-pointer' to={`/product/${_id}`}>
        
        {/* Fixed Aspect Ratio Image Container */}
        <div className='relative w-full h-[280px] sm:h-[320px] overflow-hidden bg-gray-50 dark:bg-gray-900'>
          <img
            className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out'
            src={imgSrc}
            alt={name}
            loading="lazy"
          />
          
          {/* Overlay gradient for premium feel on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
            {bestseller && (
              <span className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded shadow-sm">
                Best Seller
              </span>
            )}
            {isNewArrival && !bestseller && (
              <span className="bg-pink-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider rounded shadow-sm">
                New
              </span>
            )}
          </div>
        </div>
        
        {/* Product Info Container */}
        <div className='p-4 flex flex-col flex-grow justify-between gap-2'>
          <div>
            <h3 className='text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-pink-600 transition-colors duration-200'>
              {name}
            </h3>
          </div>
          
          <div className="flex items-end justify-between mt-1">
            <div className="flex flex-col">
              <span className='text-lg font-bold text-gray-900 dark:text-white tracking-tight'>
                {currency}{price}
              </span>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Wishlist Button (Absolutely positioned so it doesn't navigate) */}
      <button
        onClick={handleAddToWishlist}
        className={`absolute top-3 right-3 rounded-full p-2.5 shadow-md transition-all duration-300 z-20 focus:outline-none hover:scale-110 active:scale-95 ${
          inWishlist 
            ? 'bg-pink-50 text-pink-500 border border-pink-100' 
            : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-pink-500 hover:bg-white border border-transparent'
        }`}
        title={inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
      >
        <FaHeart className='text-base' />
      </button>
    </div>
  );
};

export default ProductItem;
