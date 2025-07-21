import React, { useState } from 'react';
import { assets } from '../assets/assets';

const beforeImg = assets.p_img1;
const afterImg = assets.p_img13;

const BeforeAfterSlider = () => {
  const [slider, setSlider] = useState(50); // percent

  return (
    <div className="my-12">
      <div className="text-center mb-8">
        <span className="inline-block text-2xl font-bold mb-2">↔️ Before / After Style</span>
        <p className="text-gray-500 text-sm">See the transformation! Slide to reveal the Fancy Garments effect.</p>
      </div>
      <div className="relative w-full max-w-xl mx-auto h-80 rounded-2xl shadow-lg overflow-hidden bg-gray-100">
        {/* After (Styled) */}
        <img
          src={afterImg}
          alt="After Style"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />
        {/* Before (Casual) */}
        <img
          src={beforeImg}
          alt="Before Style"
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${slider}%`, zIndex: 2, transition: 'width 0.2s' }}
        />
        {/* Slider */}
        <input
          type="range"
          min={0}
          max={100}
          value={slider}
          onChange={e => setSlider(Number(e.target.value))}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 z-10 accent-pink-500"
        />
        {/* Labels */}
        <span className="absolute left-4 top-4 bg-white/80 px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow">Before</span>
        <span className="absolute right-4 top-4 bg-pink-500/80 px-3 py-1 rounded-full text-xs font-bold text-white shadow">After</span>
      </div>
    </div>
  );
};

export default BeforeAfterSlider; 