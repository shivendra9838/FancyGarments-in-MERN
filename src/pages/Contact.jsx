import React, { useState, useRef } from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsLetterBox from '../components/NewsLetterBox';
import aboutImg from '../assets/photo.png';
import abdul from '../assets/abdul.jpg';
import ishaan from '../assets/ishaan.jpg';
import yash from '../assets/yash.jpg';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaUserFriends, FaInstagram, FaFacebook, FaTwitter, FaBriefcase, FaClock, FaCopy, FaWhatsapp, FaCheckCircle, FaTimesCircle, FaLocationArrow, FaQuestionCircle, FaMoneyBillWave, FaUndo, FaEdit, FaHeadset, FaShippingFast, FaDirections, FaShoppingBag, FaTruck, FaGift, FaExclamationTriangle, FaStar } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

// Fix default marker icon for leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const storePosition = [25.4537554, 81.8347292];
const storeName = 'The Souled Store';
const storeAddress = 'Civil Line, Prayagraj, 211001';
const storePhoto = assets.contact_img;

const workingHours = [
  { day: 'Mon-Fri', hours: '10:00 AM - 8:00 PM' },
  { day: 'Sat', hours: '10:00 AM - 6:00 PM' },
  { day: 'Sun', hours: 'Closed' },
];

function isStoreOpen() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  if (day === 0) return false; // Sunday
  if (hour >= 10 && hour < 20) return true;
  return false;
}

function MapFlyTo({ userLocation }) {
  const map = useMap();
  React.useEffect(() => {
    if (userLocation) {
      map.flyTo(userLocation, 16, { duration: 2 });
    } else {
      map.flyTo(storePosition, 16, { duration: 2 });
    }
  }, [userLocation, map]);
  return null;
}

const faqData = [
  {
    question: 'How can I track my order?',
    answer: 'You can track your order using the link sent to your email or via the "Orders" section in your profile.',
    icon: <FaQuestionCircle className="text-blue-500 mr-2" />,
  },
  {
    question: 'Do you offer COD (Cash on Delivery)?',
    answer: 'Yes, we offer Cash on Delivery for most locations. You can select this option at checkout.',
    icon: <FaMoneyBillWave className="text-green-500 mr-2" />,
  },
  {
    question: 'How do I return an item?',
    answer: 'You can initiate a return from your order history or contact our support team for assistance.',
    icon: <FaUndo className="text-yellow-500 mr-2" />,
  },
  {
    question: 'Can I change my address after placing an order?',
    answer: 'Address changes are possible before your order is shipped. Please contact support as soon as possible.',
    icon: <FaEdit className="text-purple-500 mr-2" />,
  },
  {
    question: 'Where is your store located?',
    answer: 'Our shop is in Civil Lines, Prayagraj, Uttar Pradesh. See the map below for directions.',
    icon: <FaMapMarkerAlt className="text-red-500 mr-2" />,
  },
];

const urgentNotice = {
  message: "🚨 Due to high demand, orders may take 1–2 extra days to deliver. Thank you for your patience!",
};

// Floating WhatsApp Chat Button
function FloatingChatButton() {
  return (
    <a
      href="https://wa.me/918318407559"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center w-16 h-16 text-4xl animate-bounce-slow transition-all"
      title="Chat with us on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'মराठी' },
];

function ReviewForm() {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating && comment.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2000);
      setRating(0);
      setComment('');
    }
  };
  return (
    <section className="max-w-2xl mx-auto px-4 mb-16">
      <div className="text-2xl text-center font-bold mb-4">Leave Us a Review</div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4 items-center">
        <div className="flex gap-1 mb-2">
          {[1,2,3,4,5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
            >
              <FaStar className={`text-3xl transition ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
            </button>
          ))}
        </div>
        <textarea
          className="w-full min-h-[80px] border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Share your experience..."
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold rounded-full shadow-lg text-lg transition hover:scale-105"
          disabled={submitted}
        >
          {submitted ? 'Thank you!' : 'Submit Review'}
        </button>
        <div className="text-sm text-gray-500 mt-2">
          Want to read what others say? <a href="#testimonials" className="text-blue-600 underline">See all reviews</a>
        </div>
      </form>
    </section>
  );
}

function HelpModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-fade-in">
        <button onClick={onClose} className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-red-500 font-bold">×</button>
        <div className="text-xl font-bold mb-2 text-center">{title}</div>
        <div className="text-gray-700 text-base">{children}</div>
      </div>
    </div>
  );
}

const helpTopics = [
  {
    key: 'order',
    label: 'Order Help',
    icon: <FaShoppingBag className="text-4xl mb-2 group-hover:animate-bounce" />,
    info: (
      <>
        <b>Order Help</b><br />
        Need help with your order? Contact our support team for order status, payment issues, or modifications. You can also check your order status in the <b>Orders</b> section of your profile.
      </>
    ),
  },
  {
    key: 'return',
    label: 'Return/Exchange',
    icon: <FaUndo className="text-4xl mb-2 group-hover:animate-bounce" />,
    info: (
      <>
        <b>Return/Exchange</b><br />
        You can return or exchange items within 7 days of delivery. Go to your order history, select the item, and follow the return/exchange process. For assistance, contact our support team.
      </>
    ),
  },
  {
    key: 'track',
    label: 'Track My Order',
    icon: <FaTruck className="text-4xl mb-2 group-hover:animate-bounce" />,
    info: (
      <>
        <b>Track My Order</b><br />
        Track your order using the tracking link sent to your email or visit the <b>Orders</b> section in your profile. For real-time updates, contact our support team.
      </>
    ),
  },
  {
    key: 'gift',
    label: 'Gift Card Info',
    icon: <FaGift className="text-4xl mb-2 group-hover:animate-bounce" />,
    info: (
      <>
        <b>Gift Card Info</b><br />
        Learn about purchasing, redeeming, or checking the balance of your gift cards. For more details, visit our <b>Gift Cards</b> page or contact support.
      </>
    ),
  },
];

const Contact = () => {
  // Contact form state
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [copyMsg, setCopyMsg] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const markerRef = useRef();
  const [selectedLang, setSelectedLang] = React.useState('en');
  const [showNotice, setShowNotice] = React.useState(true);
  const [helpOpen, setHelpOpen] = React.useState(null);

  // Contact form validation and fake submit
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setFormError('Please fill in all fields.');
      return;
    }
    setFormError('');
    setFormSuccess(false);
    setTimeout(() => {
      setFormSuccess(true);
      setForm({ name: '', email: '', message: '' });
    }, 1200);
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 1200);
  };

  // Locate user
  const handleLocateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  // Social icons
  const socials = [
    { icon: <FaFacebook />, color: 'text-blue-700', url: 'https://facebook.com', label: 'Facebook' },
    { icon: <FaInstagram />, color: 'text-pink-500', url: 'https://instagram.com', label: 'Instagram' },
    { icon: <FaTwitter />, color: 'text-blue-400', url: 'https://twitter.com', label: 'Twitter' },
    { icon: <FaWhatsapp />, color: 'text-green-500', url: 'https://wa.me/918318407559', label: 'WhatsApp' },
  ];

  const supportAgents = [
    {
      name: 'Riya',
      avatar: abdul,
      status: 'Response time: ~1hr',
      online: false,
    },
    {
      name: 'Aman',
      avatar: ishaan,
      status: 'Available now',
      online: true,
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Urgent Notices Section */}
      {showNotice && (
        <div className="max-w-3xl mx-auto px-4 mb-4">
          <div className="flex items-center bg-gradient-to-r from-red-500 to-yellow-400 text-white rounded-lg shadow-lg px-6 py-3 relative animate-pulse">
            <FaExclamationTriangle className="text-2xl mr-3" />
            <span className="flex-1 font-semibold">{urgentNotice.message}</span>
            <button onClick={() => setShowNotice(false)} className="ml-4 text-white text-xl font-bold hover:text-yellow-200 focus:outline-none">×</button>
          </div>
        </div>
      )}
      {/* Animated Hero Section */}
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="relative h-[340px] md:h-[420px] flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-400 mb-12 overflow-hidden">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }} className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900/60 to-blue-400/60 z-0" />
        <img src={assets.contact_img} alt="Contact us" className="absolute inset-0 w-full h-full object-cover opacity-20 z-0" />
        <div className="relative z-10 text-center text-white">
          <motion.h1 initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }} className="text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-4 tracking-tight">
            Let’s Connect & Collaborate
          </motion.h1>
          <motion.p initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="text-lg md:text-2xl font-medium drop-shadow animate-pulse">
            We love hearing from you. Reach out, visit, or just say hi!
          </motion.p>
        </div>
      </motion.div>
      {/* SVG Wave Divider */}
      <div className="-mt-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Contact Info Cards & Working Hours */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 my-12">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 border-t-4 border-blue-500 relative">
            <FaMapMarkerAlt className="text-3xl text-blue-500 mb-2 animate-bounce" />
            <h3 className="font-bold text-lg">Our Store</h3>
            <p className="text-gray-600 text-center">{storeName}<br />{storeAddress}</p>
            <button onClick={() => handleCopy(storeAddress)} className="absolute top-2 right-2 text-gray-400 hover:text-blue-500" title="Copy address"><FaCopy /></button>
            {copyMsg && <span className="absolute top-2 left-2 text-green-500 text-xs">{copyMsg}</span>}
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 border-t-4 border-green-500 relative">
            <FaPhoneAlt className="text-3xl text-green-500 mb-2 animate-pulse" />
            <h3 className="font-bold text-lg">Call Us</h3>
            <p className="text-gray-600 text-center">+91 8318407559</p>
            <button onClick={() => handleCopy('+918318407559')} className="absolute top-2 right-2 text-gray-400 hover:text-green-500" title="Copy phone"><FaCopy /></button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 border-t-4 border-purple-500 relative">
            <FaEnvelope className="text-3xl text-purple-500 mb-2 animate-bounce" />
            <h3 className="font-bold text-lg">Email</h3>
            <p className="text-gray-600 text-center">Anupampatel21661@gmail.com<br />support@fancygarments.com</p>
            <button onClick={() => handleCopy('Anupampatel21661@gmail.com')} className="absolute top-2 right-2 text-gray-400 hover:text-purple-500" title="Copy email"><FaCopy /></button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 border-t-4 border-yellow-500">
            <FaUserFriends className="text-3xl text-yellow-500 mb-2 animate-pulse" />
            <h3 className="font-bold text-lg">Customer Service</h3>
            <p className="text-gray-600 text-center">Order inquiries, returns, or assistance.<br />We’re here to help!</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center gap-3 border-t-4 border-indigo-500">
            <FaClock className="text-3xl text-indigo-500 mb-2 animate-spin-slow" />
            <h3 className="font-bold text-lg">Working Hours</h3>
            <ul className="text-gray-600 text-center text-sm">
              {workingHours.map((wh, i) => (
                <li key={i}>{wh.day}: {wh.hours}</li>
              ))}
            </ul>
            <div className="flex items-center gap-2 mt-2">
              {isStoreOpen() ? (
                <><FaCheckCircle className="text-green-500 animate-pulse" /> <span className="text-green-600 font-bold">Open Now</span></>
              ) : (
                <><FaTimesCircle className="text-red-500 animate-pulse" /> <span className="text-red-600 font-bold">Closed</span></>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      {/* SVG Wave Divider */}
      <div className="-mb-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24 rotate-180">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* FAQ Accordion Section */}
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="text-2xl text-center font-bold mb-4">Frequently Asked Questions</div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {faqData.map((faq, idx) => (
            <AccordionItem key={idx} faq={faq} />
          ))}
        </div>
      </section>

      {/* How Can We Help You? Quick Help Buttons */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="text-2xl text-center font-bold mb-4">How Can We Help You?</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {helpTopics.map(topic => (
            <button
              key={topic.key}
              onClick={() => setHelpOpen(topic.key)}
              className={`flex flex-col items-center gap-2 bg-gradient-to-r text-white rounded-xl shadow-lg p-6 hover:scale-105 transition-transform group
                ${topic.key === 'order' ? 'from-orange-400 to-pink-500' : ''}
                ${topic.key === 'return' ? 'from-green-400 to-blue-500' : ''}
                ${topic.key === 'track' ? 'from-yellow-400 to-orange-500' : ''}
                ${topic.key === 'gift' ? 'from-pink-400 to-purple-500' : ''}
              `}
            >
              {topic.icon}
              <span className="font-bold text-lg">{topic.label}</span>
            </button>
          ))}
        </div>
        <HelpModal
          open={!!helpOpen}
          onClose={() => setHelpOpen(null)}
          title={helpTopics.find(t => t.key === helpOpen)?.label}
        >
          {helpTopics.find(t => t.key === helpOpen)?.info}
        </HelpModal>
      </section>

      {/* Team Member Spotlight Section */}
      <section className="max-w-2xl mx-auto px-4 mb-12">
        <div className="text-2xl text-center font-bold mb-4">Meet Our Support Team</div>
        <div className="flex flex-wrap justify-center gap-8">
          {supportAgents.map((agent, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 w-48">
              <img src={agent.avatar} alt={agent.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-400 mb-2" />
              <span className="font-semibold text-lg">{agent.name}</span>
              <span className={`text-xs mt-1 ${agent.online ? 'text-green-600 font-bold' : 'text-gray-500'}`}>{agent.status}</span>
              {agent.online && <span className="mt-1 text-green-500 text-xs">● Online</span>}
            </div>
          ))}
        </div>
      </section>

      {/* Customer Support Info Section */}
      <section className="max-w-4xl mx-auto px-4 mb-12">
        <div className="text-2xl text-center font-bold mb-4">Customer Support</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-2 border-t-4 border-blue-500">
            <FaHeadset className="text-3xl text-blue-500 mb-2" />
            <b>Order Inquiries</b>
            <span className="text-gray-600 text-center text-sm">Questions about your order, status, or payment? We're here to help.</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-2 border-t-4 border-green-500">
            <FaUndo className="text-3xl text-green-500 mb-2" />
            <b>Return Policy</b>
            <span className="text-gray-600 text-center text-sm">Easy returns within 7 days. Contact us for hassle-free returns and exchanges.</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-2 border-t-4 border-yellow-500">
            <FaShippingFast className="text-3xl text-yellow-500 mb-2" />
            <b>Shipping Issues</b>
            <span className="text-gray-600 text-center text-sm">Facing delays or delivery problems? Our team will resolve it quickly.</span>
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <a
            href="https://wa.me/918318407559"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg text-lg transition"
          >
            <FaWhatsapp className="text-2xl" /> Live Chat Support (WhatsApp)
          </a>
        </div>
      </section>

      {/* Dynamic Map Section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <h2 className="text-center text-2xl font-bold mb-6">Find Us on the Map</h2>
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleLocateMe}
            className="flex items-center gap-2 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow transition"
            disabled={locating}
          >
            <FaLocationArrow /> {locating ? 'Locating...' : 'Locate Me'}
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(storeAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow transition"
          >
            <FaDirections /> Get Directions
          </a>
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="rounded-xl overflow-hidden shadow-2xl border-4 border-blue-200 relative">
          <MapContainer center={storePosition} zoom={15} scrollWheelZoom={true} className="w-full h-96 z-0">
            <MapFlyTo userLocation={userLocation} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={storePosition} ref={markerRef} eventHandlers={{ click: () => setShowPopup(true) }} icon={L.divIcon({ className: 'animated-pin', html: `<div class='pin-bounce'></div>` })}>
              {showPopup && (
                <Popup position={storePosition} onClose={() => setShowPopup(false)}>
                  <b>{storeName}</b><br />{storeAddress}
                </Popup>
              )}
            </Marker>
            {userLocation && (
              <Marker position={userLocation} icon={L.divIcon({ className: 'user-pin', html: `<div class='user-pin-dot'></div>` })}>
                <Popup>You are here</Popup>
              </Marker>
            )}
          </MapContainer>
        </motion.div>
      </section>
      {/* SVG Wave Divider */}
      <div className="-mt-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Contact Form Section (Glassmorphism) */}
      <section className="max-w-2xl mx-auto px-4 mb-16">
        <div className="text-2xl text-center font-bold mb-4">Contact Us</div>
        <form onSubmit={handleFormSubmit} className="backdrop-blur-md bg-white/60 border border-blue-100 rounded-2xl shadow-2xl p-8 flex flex-col gap-4 items-center glassmorphism-card">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleFormChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleFormChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleFormChange}
            className="w-full min-h-[80px] border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 shadow-sm"
            required
          />
          {formError && <div className="text-red-500 text-sm">{formError}</div>}
          {formSuccess && <div className="text-green-600 text-sm font-semibold">Thank you for contacting us!</div>}
          <button
            type="submit"
            className="px-8 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-full shadow-lg text-lg transition hover:scale-105 hover:from-blue-600 hover:to-purple-600"
          >
            Send Message
          </button>
        </form>
      </section>
      {/* SVG Wave Divider */}
      <div className="-mb-8">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16 md:h-24 rotate-180">
          <path fill="#f3f4f6" d="M0,0 C480,100 960,0 1440,100 L1440,100 L0,100 Z" />
        </svg>
      </div>

      {/* Social Media & Chat Section */}
      <section className="max-w-6xl mx-auto px-4 mb-20">
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="text-2xl font-semibold">Connect with Us</div>
          <div className="flex gap-8">
            {socials.map((s, i) => (
              <Tooltip key={i} placement="top" overlay={s.label} arrowContent={<div className="rc-tooltip-arrow-inner" />}> 
                <a href={s.url} target="_blank" rel="noopener noreferrer" className={`text-3xl ${s.color} hover:scale-125 transition-transform`} aria-label={s.label}>{s.icon}</a>
              </Tooltip>
            ))}
          </div>
          <a href="https://wa.me/918318407559" target="_blank" rel="noopener noreferrer" className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full flex items-center gap-2 font-bold shadow-lg hover:bg-green-600 transition-all">
            <FaWhatsapp className="text-2xl" /> Chat with us on WhatsApp
          </a>
        </div>
      </section>

      {/* Newsletter Box */}
      <NewsLetterBox />
      <FloatingChatButton />
      {/* Customer Review Submission Section */}
      <ReviewForm />
    </div>
  );
};

// AccordionItem component
function AccordionItem({ faq }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b last:border-b-0">
      <button
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none hover:bg-gray-50 transition"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="flex items-center text-lg font-medium">{faq.icon}{faq.question}</span>
        <span className={`ml-2 transition-transform ${open ? 'rotate-90' : ''}`}>▶</span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 text-gray-600 ${open ? 'max-h-40 py-2' : 'max-h-0 py-0'}`}
        style={{}}
      >
        {open && <div>{faq.answer}</div>}
      </div>
    </div>
  );
}

export default Contact;
