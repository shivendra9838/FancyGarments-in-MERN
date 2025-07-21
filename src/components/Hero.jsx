import React from 'react';
import { assets } from '../assets/assets';

const Hero = ({ shopRef }) => {
  const handleShopNow = (e) => {
    e.preventDefault();
    if (shopRef && shopRef.current) {
      shopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden">
      {/* Video background */}
      <video
        src={assets.hero_video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Optional overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-0" />
      {/* Overlay content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
        <div className="bg-black/40 rounded-xl p-6 inline-block">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome to Fancy Garments
          </h1>
          <p className="text-base md:text-xl text-gray-200 mb-6 drop-shadow">
            Discover the latest trends, exclusive drops, and style transformations.
          </p>
          <button
            onClick={handleShopNow}
            className="inline-block px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow transition text-lg"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
