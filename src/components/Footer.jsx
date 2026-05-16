import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';
import {
  FaInstagram, FaFacebookF, FaTwitter, FaPinterestP, FaYoutube,
  FaChevronRight, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock,
  FaArrowUp, FaCcVisa, FaCcMastercard, FaCcPaypal, FaLock,
  FaTruck, FaHeadset, FaRegCheckCircle, FaPaperPlane, FaCreditCard, FaWhatsapp
} from 'react-icons/fa';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trustBadges = [
    { icon: <FaRegCheckCircle />, title: "100% Original", desc: "Authentic & original products" },
    { icon: <FaTruck />, title: "Fast Delivery", desc: "Quick delivery to your doorstep" },
    { icon: <FaLock />, title: "Secure Payment", desc: "100% secure payment" },
    { icon: <FaHeadset />, title: "24/7 Support", desc: "Dedicated customer support" }
  ];

  return (
    <footer className="bg-black text-white relative mt-auto border-t border-zinc-800 overflow-hidden font-sans">

      {/* Glow Effect Overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8 relative z-10">

        {/* Trust Badges Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustBadges.map((badge, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 bg-zinc-900/50 backdrop-blur-md p-5 rounded-2xl border border-zinc-800 hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] transition-all duration-300 group"
            >
              <div className="text-3xl text-pink-500 group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-100">{badge.title}</h4>
                <p className="text-xs text-gray-400 mt-1">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand & About */}
          <div className="space-y-6">
            <Link to="/">
              <img src={assets.logo} className="w-40 mb-2 hover:scale-105 transition-transform duration-300" alt="Fancy Garments" />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Elevating your style with premium fabrics and modern aesthetics. Discover the perfect blend of comfort and luxury for every occasion.
            </p>

            <div>
              <h4 className="font-bold text-gray-200 mb-4 tracking-wide uppercase text-sm">Follow Us</h4>
              <div className="flex gap-4">
                {[
                  { icon: <FaInstagram />, href: "https://instagram.com" },
                  { icon: <FaFacebookF />, href: "https://facebook.com" },
                  { icon: <FaTwitter />, href: "https://twitter.com" },
                  { icon: <FaWhatsapp />, href: "https://wa.me/918318407559" },
                  { icon: <FaYoutube />, href: "#" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-gray-400 border border-zinc-800 hover:bg-pink-500 hover:text-white hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Company
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-pink-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'Collection', 'New Arrivals', 'Delivery', 'About Us', 'Contact Us', 'FAQs', 'Track Order'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="group flex items-center text-sm text-gray-400 hover:text-pink-500 transition-colors duration-300">
                    <FaChevronRight className="text-[10px] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Customer Care
              <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-pink-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['My Account', 'Orders', 'Returns & Exchanges', 'Shipping Policy', 'Privacy Policy', 'Terms & Conditions', 'Size Guide', 'Help Center'].map((link) => (
                <li key={link}>
                  <Link to="#" className="group flex items-center text-sm text-gray-400 hover:text-pink-500 transition-colors duration-300">
                    <FaChevronRight className="text-[10px] opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 mr-2 transition-all duration-300" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch & Newsletter */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
                Get In Touch
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-pink-500 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-400 group">
                  <FaMapMarkerAlt className="text-pink-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>The Souled Store<br />Civil Line, Prayagraj, 211001<br />Uttar Pradesh, India</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400 group">
                  <FaPhoneAlt className="text-pink-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href="tel:+918318407559" className="hover:text-white transition-colors">+91 8318407559</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400 group">
                  <FaEnvelope className="text-pink-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href="mailto:support@fancygarments.com" className="hover:text-white transition-colors">fancygarment9838@gmail.com</a>
                </li>
                <li className="flex items-center gap-3 text-sm text-gray-400 group">
                  <FaClock className="text-pink-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Mon - Fri: 9:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-200 mb-3 text-sm uppercase tracking-wide">Newsletter</h4>
              <p className="text-xs text-gray-400 mb-4">Subscribe to get updates on new collections and exclusive offers.</p>
              <form className="relative flex items-center" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-zinc-900 border border-zinc-800 text-sm text-white rounded-full py-3 pl-5 pr-14 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all placeholder-gray-600"
                />
                <button type="submit" className="absolute right-1 w-10 h-10 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg shadow-pink-500/30">
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center md:text-left">
            &copy; {new Date().getFullYear()} Fancy Garments. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-2xl text-gray-500">
            <FaCcVisa className="hover:text-white transition-colors" />
            <FaCcMastercard className="hover:text-white transition-colors" />
            <FaCcPaypal className="hover:text-white transition-colors" />
            <span className="text-xs font-bold border border-gray-500 rounded px-1 py-0.5 hover:text-white hover:border-white transition-colors">UPI</span>
            <span className="text-xs font-bold border border-gray-500 rounded px-1 py-0.5 hover:text-white hover:border-white transition-colors">RuPay</span>
          </div>
        </div>

      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-pink-500 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.4)] hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300"
        >
          <FaArrowUp />
        </motion.button>
      )}

    </footer>
  );
};

export default Footer;