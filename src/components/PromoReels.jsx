import React from 'react';
import { assets } from '../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const reels = [
  {
    id: 1,
    brand: 'HIGHLANDER',
    category: 'Trousers',
    originalPrice: 2699,
    price: 859,
    discount: 1840,
    video: assets.vid1,
  },
  {
    id: 2,
    brand: 'HIGHLANDER',
    category: 'Trousers',
    originalPrice: 3199,
    price: 1159,
    discount: 2040,
    video: assets.vid2,
  },
  {
    id: 3,
    brand: 'HIGHLANDER',
    category: 'Trousers',
    originalPrice: 4399,
    price: 1249,
    discount: 3150,
    video: assets.vid3,
  },
  {
    id: 4,
    brand: 'HIGHLANDER',
    category: 'Trousers',
    originalPrice: 4399,
    price: 1249,
    discount: 3150,
    video: assets.vid4,
  },
];

const handleRemoveWishlist = async (id, video) => {
  setWishlist((prev) => {
    const updated = prev.filter(item => item._id !== id && item.id !== id);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    toast.success('Removed from wishlist!');
    return updated;
  });

  // Backend sync
  if (token) {
    try {
      await axios.post(
        `${backendUrl}/api/wishlist/remove`,
        { productId: id, video },
        { headers: { token } }
      );
    } catch (err) {
      // Optionally show a toast or log error
    }
  }
};

const PromoReels = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const handleAddToWishlist = async (item) => {
    const wishlistItem = item.video
      ? { video: item.video, brand: item.brand, price: item.price }
      : { productId: item.id, brand: item.brand, price: item.price };
    let current = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (current.find(i => i.id === item.id)) {
      toast.info('Already in your wishlist!');
      return;
    }
    const updated = [...current, wishlistItem];
    localStorage.setItem('wishlist', JSON.stringify(updated));
    toast.success('Added to your wishlist!');
    // Backend sync
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/add`,
          wishlistItem,
          { headers: { token } }
        );
      } catch (err) {
        // Optionally show a toast or log error
      }
    }
  };

  return (
    <section className="w-screen relative left-1/2 -ml-[50vw] my-16">
      {/* Heading */}
      <div className="text-center px-4 lg:px-8 mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-2">
          🎥 Exclusive Reels
        </h2>
        <p className="text-sm text-gray-500">
          Tap to shop these styles in motion – real fit, real fashion.
        </p>
      </div>

      {/* Horizontal Scroll Section */}
      <div className="flex overflow-x-auto gap-6 px-4 lg:px-8 scrollbar-hide pb-4">
        {reels.map((item) => (
          <div
            key={item.id}
            className="min-w-[260px] max-w-[280px] bg-white dark:bg-gray-900 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out flex-shrink-0"
          >
            {/* Video Preview */}
            <div className="relative rounded-t-3xl overflow-hidden h-[320px]">
              <video
                src={item.video}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <button
                aria-label="Add to wishlist"
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-900 px-2 py-1 rounded-full text-sm font-medium"
                onClick={() => handleAddToWishlist(item)}
              >
                ❤️
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-1">
              <h3 className="text-base font-semibold text-gray-800 dark:text-white">
                {item.brand}
              </h3>
              <p className="text-sm text-gray-500">{item.category}</p>

              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-black dark:text-white">
                  ₹{item.price}
                </span>
                <span className="text-sm line-through text-gray-400">
                  ₹{item.originalPrice}
                </span>
              </div>

              <p className="text-sm text-orange-600 font-medium">
                (Rs. {item.discount} OFF)
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PromoReels;
