import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { FaGift, FaHeart } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';

function SaleBanner() {
  const [show, setShow] = useState(() => localStorage.getItem('hideSaleBanner') !== '1');
  if (!show) return null;
  return (
    <div className='w-full bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold text-center py-2 relative animate-pulse'>
      <span className='mr-8'>⚡ Independence Day Sale Live! Use code: <b>FREEDOM30</b></span>
      <button
        onClick={() => { setShow(false); localStorage.setItem('hideSaleBanner', '1'); }}
        className='absolute right-4 top-1/2 -translate-y-1/2 text-white text-xl font-bold hover:text-yellow-200 focus:outline-none'
        title='Dismiss'
      >×</button>
    </div>
  );
}

const NavBar = () => {
  const { showSearch, setShowSearch, getCartCount, token, setToken, setCartItems, backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [showGiftCards, setShowGiftCards] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });

  // Theme toggle state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const languageOptions = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी' },
  ];
  const [selectedLang, setSelectedLang] = useState('en');

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleRemoveWishlist = async (id, video) => {
    setWishlist((prev) => {
      const updated = prev.filter(item => item._id !== id && item.id !== id);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      toast.success('Removed from wishlist!');
      return updated;
    });
    // Backend sync
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/remove`,
          { productId: id, video },
          { headers: { token } }
        );
      } catch (err) {
        // Optionally show a toast or log error
      }
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for wishlist changes in localStorage
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'wishlist') {
        setWishlist(event.newValue ? JSON.parse(event.newValue) : []);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Add this function to handle gift card application
  function applyGiftCard(code) {
    localStorage.setItem('appliedGiftCard', code);
    toast.success('Your gift card has been added successfully!');
  }

  return (
    <>
      <div className='sticky top-0 z-50 bg-white flex items-center justify-between py-5 px-6 font-medium shadow-md'>
        <Link to='/'>
          <img src={assets.logo} className='w-36' alt='Logo' />
        </Link>

        <ul className='flex gap-5'>
          <NavLink to='/' className='flex flex-col items-center gap-1'>
            <p>HOME</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/collection' className='flex flex-col items-center gap-1'>
            <p>COLLECTION</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1'>
            <p>ABOUT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1'>
            <p>CONTACT</p>
            <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
          </NavLink>
          <button
            type='button'
            onClick={() => setShowGiftCards((v) => !v)}
            className='flex flex-col items-center gap-1 relative focus:outline-none'
          >
            <span className='flex items-center gap-1 text-pink-600 font-bold'><FaGift className='text-lg' />GIFT CARDS</span>
            <hr className='w-2/4 border-none h-[1.5px] bg-pink-500 hidden' />
          </button>
        </ul>
        {/* Wishlist Icon/Button */}
        <button
          type='button'
          onClick={() => setShowWishlist((v) => !v)}
          className='relative ml-2 focus:outline-none'
          title='Wishlist'
        >
          <FaHeart className='text-2xl text-pink-500 hover:text-pink-600 transition' />
          {wishlist.length > 0 && (
            <span className='absolute -top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-1'>{wishlist.length}</span>
          )}
        </button>
        {/* Wishlist Modal/Dropdown */}
        {showWishlist && (
          <div className='absolute right-0 top-20 z-50 bg-white rounded-xl shadow-2xl p-6 w-80 border border-pink-200 animate-fade-in'>
            <div className='font-bold text-lg text-pink-700 mb-2'>My Wishlist</div>
            {wishlist.length === 0 ? (
              <div className='text-gray-500 text-center'>No items in your wishlist yet.</div>
            ) : (
              <ul className='flex flex-col gap-3'>
                {wishlist.map((item, idx) => (
                  <li key={idx} className='flex items-center gap-3 border-b pb-2 last:border-b-0'>
                    <Link to={`/product/${item._id || item.id}`} className='flex items-center gap-3 flex-1 hover:bg-gray-50 rounded p-1 transition'>
                      {item.image ? (
                        <img src={item.image} alt={item.name || item.brand} className='w-12 h-12 object-cover rounded' />
                      ) : item.video ? (
                        <video src={item.video} className='w-12 h-12 object-cover rounded' autoPlay muted loop playsInline />
                      ) : (
                        <img src='/placeholder.jpg' alt='Wishlist' className='w-12 h-12 object-cover rounded' />
                      )}
                      <div>
                        <div className='font-semibold'>{item.name || item.brand}</div>
                        <div className='text-sm text-gray-500'>₹{item.price}</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleRemoveWishlist(item._id || item.id, item.video)}
                      className='ml-2 px-2 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold hover:bg-pink-200 transition'
                      title='Remove from wishlist'
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setShowWishlist(false)}
              className='mt-4 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold transition w-full'
            >Close</button>
          </div>
        )}
        {/* Gift Card Modal/Dropdown */}
        {showGiftCards && (
          <div className='absolute left-1/2 top-20 transform -translate-x-1/2 z-50 bg-white rounded-xl shadow-2xl p-6 w-80 border border-pink-200 animate-fade-in'>
            <div className='flex flex-col gap-4'>
              <button
                onClick={() => { applyGiftCard('WELCOME200'); setShowGiftCards(false); }}
                className='flex items-center gap-3 bg-gradient-to-r from-pink-400 to-yellow-300 rounded-lg p-4 shadow hover:scale-105 transition'
              >
                <FaGift className='text-3xl text-pink-600' />
                <div>
                  <div className='font-bold text-lg text-pink-700'>Welcome Gift Card</div>
                  <div className='text-gray-700 text-sm'>₹200 off for new users. Use code: <b>WELCOME200</b></div>
                </div>
              </button>
              <button
                onClick={() => { applyGiftCard('FIRST10'); setShowGiftCards(false); }}
                className='flex items-center gap-3 bg-gradient-to-r from-purple-400 to-blue-300 rounded-lg p-4 shadow hover:scale-105 transition'
              >
                <FaGift className='text-3xl text-purple-600' />
                <div>
                  <div className='font-bold text-lg text-purple-700'>First Order Gift</div>
                  <div className='text-gray-700 text-sm'>Flat 10% off on your first order. Use code: <b>FIRST10</b></div>
                </div>
              </button>
              <button
                onClick={() => setShowGiftCards(false)}
                className='mt-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold transition'
              >Close</button>
            </div>
          </div>
        )}

        <div className='flex items-center gap-6 relative'>
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className='mr-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition text-xl focus:outline-none'
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <FaMoon className='text-gray-700' /> : <FaSun className='text-yellow-400' />}
          </button>
          {/* Language Toggle */}
          <div className='flex items-center gap-2 mr-2'>
            <span className='text-lg'>🌍</span>
            <label htmlFor='navbar-lang-toggle' className='font-medium text-gray-700'>View in:</label>
            <select
              id='navbar-lang-toggle'
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className='px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm text-sm'
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          <Link to='/collection'>
            <img onClick={() => setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt='Search' />
          </Link>

          <div className='relative' ref={dropdownRef}>
            <img
              onClick={() => token ? setShowDropdown(prev => !prev) : navigate('/login')}
              src={assets.profile_icon}
              className='w-5 cursor-pointer'
              alt='Profile'
            />

            {token && showDropdown && (
              <div className='absolute right-0 pt-4 z-50'>
                <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-white text-gray-600 rounded-lg shadow-lg border border-gray-200'>
                  {/* <p className='cursor-pointer hover:text-black hover:font-semibold transition'>👤 My Profile</p> */}
                  <p
    onClick={() => { navigate('/profile'); setShowDropdown(false) }}
    className='cursor-pointer hover:text-black hover:font-semibold transition'
  >
    👤 My Profile
  </p>

                  <p onClick={() => { navigate('/orders'); setShowDropdown(false) }} className='cursor-pointer hover:text-black hover:font-semibold transition'>📦 Orders</p>
                  <p onClick={() => { logout(); setShowDropdown(false) }} className='cursor-pointer hover:text-black hover:font-semibold transition'>🚪 Logout</p>
                </div>
              </div>
            )}
          </div>

          <Link to='/cart' className='relative'>
            <img src={assets.cart_icon} className='w-5' alt='Cart' />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
              {getCartCount()}
            </p>
          </Link>
        </div>
      </div>
      <SaleBanner />
    </>
  )
}

export default NavBar
