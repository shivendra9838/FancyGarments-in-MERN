
import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';
// Import wishlist and setWishlist from NavBar
let wishlist = [];
let setWishlist = () => {};
try {
  const nav = require('./NavBar.jsx');
  wishlist = nav.wishlist;
  setWishlist = nav.setWishlist;
} catch {}

const ProductItem = ({ item }) => {
  if (!item) return null;

  const { _id, name, price, images } = item;
  const { currency, backendUrl, token, addToWishlist } = useContext(ShopContext);

  const imgSrc = images?.[0]
    ? (images[0].startsWith('http') ? images[0] : `${backendUrl}/${images[0].replace(/^\/+/, '')}`)
    : '/placeholder.jpg';

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(item);
  };

  return (
    <div className='relative'>
      <Link className='text-gray-700 cursor-pointer' to={`/product/${_id}`}>
        <div className='overflow-hidden'>
          <img
            className='hover:scale-110 transition ease-in-out'
            src={imgSrc}
            alt={name}
          />
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='text-sm font-medium'>{currency}{price}</p>
      </Link>
      <button
        onClick={handleAddToWishlist}
        className='absolute top-2 right-2 bg-white/80 rounded-full p-2 shadow hover:bg-pink-100 transition'
        title='Add to Wishlist'
      >
        <FaHeart className='text-pink-500 text-lg' />
      </button>
    </div>
  );
};

export default ProductItem;
