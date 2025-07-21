import React, { useState } from 'react';
import Title from '../components/Title';
import NewsLetterBox from '../components/NewsLetterBox';
import { assets } from '../assets/assets';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTwitter, FaTrophy, FaSmile, FaLock, FaLightbulb, FaUsers, FaLeaf, FaUserTie, FaTshirt, FaShoppingBag, FaStar, FaFemale } from 'react-icons/fa';
import Slider from 'react-slick';
import CountUp from 'react-countup';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductItem from '../components/ProductItem';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const About = () => {
  const [showMore, setShowMore] = useState(false);
  // Parallax effect for hero
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 300], [0, 80]);

  const testimonials = [
    {
      name: "Aman Gupta",
      photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgdyzzpzkOm8vfDeyi8HIJQaPQBc9TDTYcOg&s",
      text: "Fancy Garments is amazing! I found the perfect outfit for my special occasion, and the delivery was super fast.",
    },

    {
      name: "Rahul Kumar",
      photo: "https://randomuser.me/api/portraits/men/44.jpg",
      text: "The quality of the clothes is incredible. I love shopping here for all my fashion needs!",
    },

    {
      name: "Rahul Tiwari",
      photo: "https://randomuser.me/api/portraits/men/46.jpg",
      text: "Customer service was top-notch, and the shopping experience was smooth and enjoyable.",
    },

    {
      name: "Abhay Mehta",
      photo: "data:image/jpeg;base64,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", // Example: assets.michael_photo = 'path/to/photo.jpg'
      text: "Fast delivery and great prices! I've recommended Fancy Garments to all my friends.",
    },
    {
      name: "Sarah Wilson",
      photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwe4kzPRLWNBj34mlrylYKJ2O5IUJwXbQjGA&s",
      text: "I absolutely love the variety of styles. There's something for everyone, and the service is unbeatable.",
    },
  ];

  // Carousel settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 900,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Parallax */}
      <motion.div style={{ y: yHero }} className="relative h-[350px] md:h-[420px] flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 mb-12 overflow-hidden">
        {/* Attractive background photo overlay */}
        <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" alt="Fashion background" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        {/* Garment-related icons overlay */}
        <FaTshirt className="absolute left-10 top-10 text-white text-5xl opacity-80 drop-shadow-lg animate-bounce-slow" />
        <FaShoppingBag className="absolute right-16 top-16 text-pink-200 text-4xl opacity-80 drop-shadow-lg animate-bounce-slower" />
        <FaStar className="absolute left-1/2 top-6 text-yellow-300 text-3xl opacity-90 drop-shadow-lg animate-spin-slow" />
        <FaUserTie className="absolute right-10 bottom-10 text-blue-200 text-4xl opacity-80 drop-shadow-lg animate-bounce-slow" />
        <FaFemale className="absolute left-16 bottom-16 text-pink-300 text-4xl opacity-80 drop-shadow-lg animate-bounce-slower" />
        {/* Existing overlay */}
        <div className="relative z-10 text-center text-white">
          <motion.h1 initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} className="text-4xl md:text-6xl font-bold drop-shadow-lg mb-4">
            Welcome to Fancy Garments
          </motion.h1>
          <motion.p initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="text-lg md:text-2xl font-medium drop-shadow">
            Fashion Innovation. Quality. Community.
          </motion.p>
        </div>
      </motion.div>
      {/* SVG Wave Divider */}
      <div className="-mt-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-2xl text-center pt-8 border-t border-gray-200'>
          <Title text1={'ABOUT'} text2={'US'} />
        </div>
        <motion.div
          className='my-10 flex flex-col md:flex-row gap-10 md:gap-16 items-center'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img className='max-w-[350px] md:max-w-[450px] rounded-xl shadow-xl' src={assets.about_img} alt="About us" />
          <div className='flex flex-col justify-center gap-6 w-full md:w-2/4 text-gray-700'>
            <p className="text-lg"><b>Fancy Garments</b> was founded by <b>Anupam Patel</b>, whose vision and passion for fashion innovation led to the creation of this brand. Our head office is located in <b>Prayagraj, Uttar Pradesh</b>, and our shop is situated in the heart of the city at <b>Civil Lines, Prayagraj</b>.</p>
            <p className="text-lg">We focus on creating trendy, high-quality clothing for every occasion. Our journey started in <b>2018</b>, and since then, we've been committed to offering the best shopping experience for our customers.</p>
            <p className="text-lg">Our mission is simple: to empower you to look and feel great while enjoying a seamless shopping experience online.</p>
            <b className='text-gray-700 text-xl mt-2'>Our Vision</b>
            <p className="text-lg">We aim to become a global leader in fashion, providing timeless styles and unparalleled quality to fashion-conscious individuals everywhere.</p>
          </div>
        </motion.div>
      </section>
      {/* SVG Wave Divider */}
      <div className="-mb-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24 rotate-180">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Impact Stats Section with Animated Counters */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'OUR'} text2={'IMPACT'} />
        </div>
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mb-20'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <FaTrophy className="text-4xl text-yellow-500 mb-2" />
            <h3 className='text-3xl font-bold'><CountUp end={500} duration={2} />+</h3>
            <p className='text-gray-600'>Orders Delivered</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <FaSmile className="text-4xl text-green-500 mb-2" />
            <h3 className='text-3xl font-bold'><CountUp end={300} duration={2} />+</h3>
            <p className='text-gray-600'>Happy Customers</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <FaLock className="text-4xl text-blue-500 mb-2" />
            <h3 className='text-3xl font-bold'><CountUp end={100} duration={2} />%</h3>
            <p className='text-gray-600'>Secure Transactions</p>
          </div>
        </motion.div>
      </section>
      {/* SVG Wave Divider */}
      <div className="-mt-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Achievements / Badges Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'OUR'} text2={'ACHIEVEMENTS'} />
        </div>
        <div className="flex flex-wrap justify-center gap-8 mb-12">
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[220px] max-w-xs hover:scale-105 transition-transform border border-green-200">
            <span className="text-3xl mb-2">✔️</span>
            <span className="text-xl font-bold text-green-700">25,000+ Orders Delivered</span>
            <span className="text-gray-500 mt-1 text-sm">Trusted by thousands of happy customers</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[220px] max-w-xs hover:scale-105 transition-transform border border-blue-200">
            <span className="text-3xl mb-2">🏆</span>
            <span className="text-xl font-bold text-blue-700">Rated 4.9/5 on Google</span>
            <span className="text-gray-500 mt-1 text-sm">Top-rated fashion brand</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[220px] max-w-xs hover:scale-105 transition-transform border border-yellow-200">
            <span className="text-3xl mb-2">🧵</span>
            <span className="text-xl font-bold text-yellow-700">50+ Tailors Employed</span>
            <span className="text-gray-500 mt-1 text-sm">Empowering local artisans</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[220px] max-w-xs hover:scale-105 transition-transform border border-purple-200">
            <span className="text-3xl mb-2">📣</span>
            <span className="text-xl font-bold text-purple-700">Featured in Media</span>
            <span className="text-gray-500 mt-1 text-sm">Times of India, Fashion Today, Vogue</span>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 min-w-[220px] max-w-xs hover:scale-105 transition-transform border border-pink-200">
            <span className="text-3xl mb-2">🎖️</span>
            <span className="text-xl font-bold text-pink-700">Awarded "Best Local Brand"</span>
            <span className="text-gray-500 mt-1 text-sm">Prayagraj Fashion Awards 2023</span>
          </div>
            </div>
      </section>
      {/* SVG Wave Divider */}
      <div className="-mb-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24 rotate-180">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Why Choose Us Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
        </div>
        <motion.div
          className='flex flex-col md:flex-row text-sm mb-20 gap-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className='bg-white border rounded-xl px-8 py-10 flex-1 flex flex-col gap-5 shadow-md hover:shadow-xl transition-shadow'>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>We meticulously select and vet each product...</p>
          </div>
          <div className='bg-white border rounded-xl px-8 py-10 flex-1 flex flex-col gap-5 shadow-md hover:shadow-xl transition-shadow'>
            <b>Convenience:</b>
            <p className='text-gray-600'>With our user-friendly interface...</p>
          </div>
          <div className='bg-white border rounded-xl px-8 py-10 flex-1 flex flex-col gap-5 shadow-md hover:shadow-xl transition-shadow'>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Our team is here to assist you, ensuring satisfaction...</p>
          </div>
        </motion.div>
      </section>

      {/* Shop/Team Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'MEET'} text2={'THE SHOP'} />
        </div>
        <motion.div
          className='flex flex-col gap-4 text-gray-600 mb-20 bg-white rounded-xl shadow-lg p-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <p>Fancy Garments began as a collaboration with close friends who run a local fashion shop in Prayagraj. Our goal was to bring their physical store into the digital age, creating a powerful online presence that reflects their passion for fashion.</p>
          <p>Every feature, from advanced product filtering to secure online payments via Stripe and Razorpay, was custom-built to meet the needs of their growing business. This platform is more than a website—it's a digital transformation journey for a beloved local brand.</p>
        </motion.div>
      </section>

      {/* Admin Dashboard Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'ADMIN'} text2={'DASHBOARD'} />
        </div>
        <motion.div
          className='flex flex-col gap-4 text-gray-600 mb-20 bg-white rounded-xl shadow-lg p-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <p>Behind the scenes, our admin dashboard helps the Fancy Garments team manage the store efficiently:</p>
          <ul className='list-disc pl-6'>
            <li>Add, update, or delete product listings with ease.</li>
            <li>Track all customer orders in real time.</li>
            <li>Manage inventory and ensure timely delivery updates.</li>
            <li>Monitor and respond to customer queries.</li>
          </ul>
        </motion.div>
      </section>

      {/* Tech Stack Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'TECH'} text2={'STACK'} />
        </div>
        <motion.div
          className='flex flex-col gap-4 text-gray-600 mb-20 bg-white rounded-xl shadow-lg p-8'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <p>Fancy Garments isn't just about fashion – it's powered by a modern, scalable full-stack architecture:</p>
          <ul className='list-disc pl-6 grid grid-cols-1 sm:grid-cols-2 gap-2'>
            <li><b>Frontend:</b> React.js for a dynamic and responsive user interface.</li>
            <li><b>Backend:</b> Node.js and Express.js for robust API development.</li>
            <li><b>Database:</b> MongoDB to efficiently store and manage product, user, and order data.</li>
            <li><b>Authentication:</b> JWT-based secure login system.</li>
            <li><b>Payments:</b> Stripe and Razorpay integration for seamless checkout experiences.</li>
          </ul>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'OUR'} text2={'VALUES'} />
        </div>
        <motion.div
          className='flex flex-col md:flex-row gap-8 mb-20'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 hover:scale-105 transition-transform">
            <FaLightbulb className="text-3xl text-yellow-400 mb-2" />
            <b className='text-gray-700 text-xl'>Innovation</b>
            <p className="text-gray-600">At Fancy Garments, we believe in pushing boundaries and constantly innovating to bring you the latest fashion trends.</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 hover:scale-105 transition-transform">
            <FaUsers className="text-3xl text-blue-400 mb-2" />
            <b className='text-gray-700 text-xl'>Customer-Centric</b>
            <p className="text-gray-600">Your satisfaction is at the core of everything we do. We listen to your feedback and work tirelessly to improve every aspect of our brand.</p>
          </div>
          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 hover:scale-105 transition-transform">
            <FaLeaf className="text-3xl text-green-500 mb-2" />
            <b className='text-gray-700 text-xl'>Sustainability</b>
            <p className="text-gray-600">We are committed to environmentally friendly practices, from using sustainable fabrics to reducing waste in our operations.</p>
          </div>
        </motion.div>
      </section>

      {/* Product Showcase Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='text-4xl py-4 text-center'>
          <Title text1={'OUR'} text2={'PRODUCTS'} />
        </div>
        <motion.div
          className='flex flex-wrap justify-center gap-8 mb-20'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        >
          {/* Render real products from context */}
          {useContext(ShopContext).products.slice(0, 8).map((item) => (
            <div key={item._id} className="w-[220px]">
              <ProductItem item={item} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials Section as Carousel */}
      <section className="max-w-6xl mx-auto px-4">
        <motion.div
          className='text-2xl text-center py-6'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <Title text1={'WHAT'} text2={'OUR CUSTOMERS SAY'} />
        </motion.div>
        <div className='w-full max-w-[900px] mx-auto mb-10'>
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className='px-3'>
                <motion.div
                  className='bg-white p-6 rounded-lg shadow-lg flex gap-4 items-center min-h-[140px] hover:scale-105 transition-transform'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <img src={testimonial.photo} alt={testimonial.name} className='w-16 h-16 rounded-full object-cover border-2 border-blue-400' />
                  <div>
                    <p className='text-lg text-gray-600 italic'>" {testimonial.text} "</p>
                    <p className='text-right mt-4 text-sm text-gray-500'>– {testimonial.name}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Quote Section */}
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <blockquote className="text-2xl italic text-gray-700 text-center mb-4">“Fashion is not just about clothes. It’s about self-expression.”</blockquote>
          <span className="text-blue-600 font-semibold">— Fancy Garments Philosophy</span>
        </div>
      </section>

      {/* Social Media Links as Icon Buttons */}
      <section className="max-w-6xl mx-auto px-4">
        <div className='flex justify-center mb-10'>
          <div className='flex gap-8'>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-pink-500 hover:text-pink-700 transition-colors"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-blue-700 hover:text-blue-900 transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-3xl text-blue-400 hover:text-blue-600 transition-colors"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </section>

      <NewsLetterBox />
    </div>
  );
};

export default About;
