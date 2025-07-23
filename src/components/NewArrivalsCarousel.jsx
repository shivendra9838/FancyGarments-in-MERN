import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { motion } from 'framer-motion';
import ProductItem from './ProductItem';

const NewArrivalsCarousel = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const sorted = [...products].sort((a, b) => (b.date || 0) - (a.date || 0));
    setLatestProducts(sorted.slice(0, 12));
  }, [products]);

  return (
    <section className="w-screen relative left-1/2 -ml-[50vw] my-16">
      {/* Heading */}
      <div className="text-center px-4 lg:px-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          🆕 New Arrivals
        </h2>
        <p className="text-sm text-gray-500">
          Discover the latest trends and fresh drops. Shop our newest arrivals!
        </p>
      </div>

      {/* Horizontal Scroll List */}
      <motion.div
        className="flex gap-6 overflow-x-auto px-4 lg:px-8 scrollbar-hide pb-4"
        whileTap={{ cursor: 'grabbing' }}
      >
        {latestProducts.map((item) => (
          <motion.div
            key={item._id}
            className="relative min-w-full max-w-full md:min-w-[220px] md:max-w-[240px] bg-white dark:bg-gray-900 rounded-2xl shadow-md p-3 flex flex-col items-center transition-all border-b-4 border-indigo-200 hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <span className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">New</span>
            <ProductItem item={item} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default NewArrivalsCarousel;