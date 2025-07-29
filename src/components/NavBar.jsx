import React, { useContext, useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import { FaGift, FaHeart } from 'react-icons/fa';
import { FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';

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
  const { showSearch, setShowSearch, getCartCount, token, setToken, setCartItems, backendUrl, wishlist, removeFromWishlist } = useContext(ShopContext)
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();

  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [showGiftCards, setShowGiftCards] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  const [selectedLang, setSelectedLang] = useState(i18n.language);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleRemoveWishlist = (id) => {
    removeFromWishlist(id);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
      // Close gift cards dropdown when clicking outside
      if (showGiftCards && !event.target.closest('.gift-cards-dropdown')) {
        setShowGiftCards(false)
      }
      // Close wishlist dropdown when clicking outside
      if (showWishlist && !event.target.closest('.wishlist-dropdown')) {
        setShowWishlist(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showGiftCards, showWishlist])

  // Add this function to handle gift card application
  function applyGiftCard(code) {
    localStorage.setItem('appliedGiftCard', code);
    toast.success('Your gift card has been added successfully!');
  }

  return (
    <>
      <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-between py-4 px-4 sm:px-8 font-medium shadow-lg'>
        <Link to='/'>
          <img src={assets.logo} className='w-28 sm:w-36' alt='Logo' />
        </Link>
        {/* Hamburger for mobile */}
        <button
          className='sm:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-2xl ml-2'
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label='Open menu'
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        {/* Main nav links (hidden on mobile) */}
        <ul className='hidden sm:flex items-center gap-2'>
          <NavLink to='/' className='px-3 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100'>
            {t('home')}
          </NavLink>
          <NavLink to='/collection' className='px-3 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100'>
            {t('collection')}
          </NavLink>
          <NavLink to='/about' className='px-3 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100'>
            {t('about')}
          </NavLink>
          <NavLink to='/contact' className='px-3 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100'>
            {t('contact')}
          </NavLink>
          <button
            onClick={() => setShowSearch(true)}
            className='px-3 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100'
          >
            <img src={assets.search_icon} className='w-5 cursor-pointer' alt='Search' />
          </button>
          <button
            type='button'
            onClick={() => setShowGiftCards((v) => !v)}
            className='px-3 py-2 rounded-full text-sm font-semibold transition-colors hover:bg-gray-100 flex items-center gap-1 text-pink-600'
          >
            <FaGift className='text-lg' />
            {t('gift_cards')}
          </button>
        </ul>
        {/* Controls (always visible, but compact on mobile) */}
        <div className='flex items-center gap-2 sm:gap-4 relative'>
          {/* Wishlist Icon/Button */}
          <button
            type='button'
            onClick={() => setShowWishlist((v) => !v)}
            className='relative focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors'
            title='Wishlist'
          >
            <FaHeart className='text-xl sm:text-2xl text-pink-500 hover:text-pink-600 transition' />
            {wishlist.length > 0 && (
              <span className='absolute -top-1 -right-2 bg-pink-500 text-white text-xs rounded-full px-1'>{wishlist.length}</span>
            )}
          </button>
          {/* Wishlist Modal/Dropdown */}
          {showWishlist && (
            <div className='absolute right-0 top-14 z-50 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 w-80 border border-pink-200 wishlist-dropdown animate-in fade-in slide-in-from-top-2 duration-300'>
              <div className='font-bold text-lg text-pink-700 mb-2'>My Wishlist</div>
              {wishlist.length === 0 ? (
                <div className='text-gray-500 text-center'>No items in your wishlist yet.</div>
              ) : (
                <ul className='flex flex-col gap-3'>
                  {wishlist.map((item, idx) => (
                    <li key={idx} className='flex items-center gap-3 border-b pb-2 last:border-b-0'>
                      <Link to={`/product/${item.productId}`} className='flex items-center gap-3 flex-1 hover:bg-gray-50 rounded p-1 transition'>
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
                        onClick={() => handleRemoveWishlist(item.productId)}
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
          {/* Gift Cards Modal/Dropdown */}
          {showGiftCards && (
            <div className='absolute right-0 top-14 z-50 bg-white/80 backdrop-blur-sm rounded-xl shadow-2xl p-6 w-80 border border-pink-200 gift-cards-dropdown animate-in fade-in slide-in-from-top-2 duration-300'>
              <div className='font-bold text-lg text-pink-700 mb-4 flex items-center gap-2'>
                <FaGift className='text-lg' />
                Gift Cards
              </div>
              <div className='space-y-4'>
                <div className='bg-gradient-to-r from-pink-50 to-yellow-50 rounded-lg p-4 border border-pink-200'>
                  <h3 className='font-semibold text-pink-700 mb-2'>🎁 Send Gift Cards</h3>
                  <p className='text-sm text-gray-600 mb-3'>Surprise your loved ones with Fancy Garments gift cards!</p>
                  <button
                    onClick={() => { setShowGiftCards(false); navigate('/profile'); }}
                    className='w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold transition'
                  >
                    Send Gift Card
                  </button>
                </div>
                <div className='bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200'>
                  <h3 className='font-semibold text-green-700 mb-2'>💳 Redeem Gift Card</h3>
                  <p className='text-sm text-gray-600 mb-3'>Have a gift card? Apply it to your cart!</p>
                  <button
                    onClick={() => { setShowGiftCards(false); navigate('/cart'); }}
                    className='w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition'
                  >
                    Apply to Cart
                  </button>
                </div>
                <div className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200'>
                  <h3 className='font-semibold text-purple-700 mb-2'>📊 Check Balance</h3>
                  <p className='text-sm text-gray-600 mb-3'>Check your gift card balance and history</p>
                  <button
                    onClick={() => { setShowGiftCards(false); navigate('/profile'); }}
                    className='w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition'
                  >
                    View Balance
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowGiftCards(false)}
                className='mt-4 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-bold transition w-full'
              >
                Close
              </button>
            </div>
          )}
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className='p-2 rounded-full hover:bg-gray-100 transition-colors text-xl focus:outline-none'
            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <FaMoon className='text-gray-700' /> : <FaSun className='text-yellow-400' />}
          </button>
          {/* Language Toggle */}
          <div className='hidden sm:flex items-center gap-2'>
            <select
              id='navbar-lang-toggle'
              value={selectedLang}
              onChange={handleLanguageChange}
              className='px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm text-sm'
            >
              {languageOptions.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>
          </div>
          <div className='relative' ref={dropdownRef}>
            <button onClick={() => token ? setShowDropdown(prev => !prev) : navigate('/login')} className='p-2 rounded-full hover:bg-gray-100 transition-colors'>
              <img
                src={assets.profile_icon}
                className='w-5 cursor-pointer'
                alt='Profile'
              />
            </button>

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

          <Link to='/cart' className='relative p-2 rounded-full hover:bg-gray-100 transition-colors'>
            <img src={assets.cart_icon} className='w-5' alt='Cart' />
            <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
              {getCartCount()}
            </p>
          </Link>
        </div>
      </div>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className='fixed inset-0 z-40 bg-black/40 flex sm:hidden'>
          <div className='bg-white dark:bg-gray-900 w-3/4 max-w-xs h-full p-8 flex flex-col gap-6 shadow-lg animate-in slide-in-from-right duration-300'>
            <button className='self-end mb-4 text-pink-500 font-bold text-2xl' onClick={() => setMobileMenuOpen(false)}><FaTimes /></button>
            <NavLink to='/' className='py-2 text-lg font-semibold' onClick={() => setMobileMenuOpen(false)}>{t('home')}</NavLink>
            <NavLink to='/collection' className='py-2 text-lg font-semibold' onClick={() => setMobileMenuOpen(false)}>{t('collection')}</NavLink>
            <NavLink to='/about' className='py-2 text-lg font-semibold' onClick={() => setMobileMenuOpen(false)}>{t('about')}</NavLink>
            <NavLink to='/contact' className='py-2 text-lg font-semibold' onClick={() => setMobileMenuOpen(false)}>{t('contact')}</NavLink>
            <button onClick={() => { setShowSearch(true); setMobileMenuOpen(false); }} className='py-2 text-lg font-semibold flex items-center gap-2'><img src={assets.search_icon} className='w-5' alt='Search' /> Search</button>
            <button onClick={() => { setShowGiftCards(true); setMobileMenuOpen(false); }} className='py-2 text-lg font-semibold flex items-center gap-2 text-pink-600'><FaGift className='text-lg' /> {t('gift_cards')}</button>
            <div className='flex items-center gap-2'>
              <select
                id='navbar-lang-toggle-mobile'
                value={selectedLang}
                onChange={handleLanguageChange}
                className='px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm text-sm w-full'
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex-1' onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
      <SaleBanner />
    </>
  )
}

export default NavBar