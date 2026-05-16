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
    <div className="relative w-full h-[50vh] sm:h-[65vh] md:h-[80vh] lg:h-screen overflow-hidden">
      {/* Video background */}
      <video
        src={assets.hero_video}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60 z-0" />
      {/* Overlay content */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg leading-tight">
            Welcome to Fancy Garments
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-200 mb-5 sm:mb-8 drop-shadow">
            Discover the latest trends, exclusive drops, and style transformations.
          </p>
          <button
            onClick={handleShopNow}
            className="inline-block px-6 sm:px-10 py-2.5 sm:py-3.5 bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white rounded-full font-bold shadow-lg transition text-base sm:text-lg"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

