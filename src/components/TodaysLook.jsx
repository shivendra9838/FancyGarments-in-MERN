import React, { useContext, useMemo } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductItem from './ProductItem';

function getRandomProducts(products, count = 3) {
  if (!products || products.length === 0) return [];
  const shuffled = [...products].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const TodaysLook = () => {
  const { products } = useContext(ShopContext);
  // Pick 2-3 products randomly for the look, memoized for the session
  const lookProducts = useMemo(() => getRandomProducts(products, Math.random() > 0.5 ? 3 : 2), [products]);

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <span className="inline-block text-2xl font-bold mb-2">👗 Today’s Look</span>
        <p className="text-gray-500 text-sm">A unique outfit suggestion curated for you. Mix, match, and shine!</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mb-6">
        {lookProducts.map((item) => (
          <div key={item._id} className="w-48">
            <ProductItem item={item} />
          </div>
        ))}
      </div>
      <div className="text-center">
        <a
          href="/cart"
          className="inline-block px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-bold shadow transition text-lg"
        >
          Get the Full Look
        </a>
        <p className="text-xs text-gray-400 mt-2">Refresh the page for a new suggestion!</p>
      </div>
    </div>
  );
};

export default TodaysLook; 