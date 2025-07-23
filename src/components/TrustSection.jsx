import React from 'react';
import { assets } from '../assets/assets';

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
      <div className="flex flex-wrap justify-center gap-8 gap-y-6">
        {trustFeatures.map((f, i) => (
          <div
            key={f.title}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center w-full md:w-56 hover:scale-105 hover:shadow-2xl transition-all border-b-4 border-green-200"
          >
            <span className="text-4xl mb-2">{f.icon}</span>
            <span className="font-semibold text-lg mb-1">{f.title}</span>
            <span className="text-gray-500 text-sm text-center">{f.desc}</span>
          </div>
        ))}
      </div>
      {/* Live Chat Widget (floating button) */}
      <a
        href="https://wa.me/918318407559"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 flex items-center gap-2 animate-bounce"
        title="Chat with us on WhatsApp"
        style={{ boxShadow: '0 4px 24px 0 #22c55e55' }}
      >
        <span className="text-2xl">💬</span>
        <span className="font-bold hidden md:inline">Live Chat</span>
      </a>
    </div>
  );
};

export default TrustSection;