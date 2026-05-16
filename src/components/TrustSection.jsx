import React from 'react';

const trustFeatures = [
  {
    icon: '✅',
    title: 'Easy Returns',
    desc: '7-day hassle-free returns on all orders.',
  },
  {
    icon: '🚚',
    title: 'Free Delivery',
    desc: 'Free shipping on orders over ₹999.',
  },
  {
    icon: '🛡',
    title: 'Secure Checkout',
    desc: '100% secure payment with trusted gateways.',
  },
  {
    icon: '💬',
    title: '24/7 Support',
    desc: 'We are here for you anytime, anywhere.',
  },
];

const TrustSection = () => {
  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <span className="inline-block text-2xl font-bold mb-2">📦 Why Shop With Us?</span>
        <p className="text-gray-500 text-sm">Shop confidently with Fancy Garments</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        {trustFeatures.map((f) => (
          <div
            key={f.title}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 flex flex-col items-center w-full hover:scale-105 hover:shadow-2xl transition-all border-b-4 border-green-200"
          >
            <span className="text-4xl mb-2">{f.icon}</span>
            <span className="font-semibold text-lg mb-1">{f.title}</span>
            <span className="text-gray-500 text-sm text-center">{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustSection;
