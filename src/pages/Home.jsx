
import React, { useRef } from 'react';
import Hero from '../components/Hero';
import LatestComponent from '../components/LatestComponent';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsLetterBox from '../components/NewsLetterBox';
import ShopByCategory from '../components/ShopByCategory';
import NewArrivalsCarousel from '../components/NewArrivalsCarousel';
import GiftCardPromo from '../components/GiftCardPromo';
import TrustSection from '../components/TrustSection';
import TodaysLook from '../components/TodaysLook';
import PromoReels from '../components/PromoReels';
import BeforeAfterSlider from '../components/BeforeAfterSlider';

const Home = () => {
  const shopRef = useRef(null);

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen w-full">
      <Hero shopRef={shopRef} />
      <div className="w-full h-12 bg-gradient-to-b from-black/40 via-white/80 to-white dark:from-black/60 dark:via-gray-900/80 dark:to-gray-900 -mt-4 z-10 relative" />
      <main className="max-w-7xl mx-auto px-2 sm:px-6 md:px-10 lg:px-16 py-8">
        <section className="mb-16" ref={shopRef}>
          <ShopByCategory />
        </section>
        <section className="mb-16">
          <NewArrivalsCarousel />
        </section>
        <section className="mb-16">
          <GiftCardPromo />
        </section>
        <section className="mb-16">
          <TrustSection />
        </section>
        <section className="mb-16">
          <TodaysLook />
        </section>
        <section className="mb-16">
          <PromoReels />
        </section>
        <section className="mb-16">
          <BeforeAfterSlider />
        </section>
        <section className="mb-16">
          <BestSeller />
        </section>
        <section className="mb-16">
          <OurPolicy />
        </section>
        <section className="mb-16">
          <NewsLetterBox />
        </section>
      </main>
    </div>
  );
};

export default Home;
