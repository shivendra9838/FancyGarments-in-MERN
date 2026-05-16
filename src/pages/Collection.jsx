import React, { useContext, useEffect, useState, useCallback } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import yash1 from '../assets/about_img.png';
import yash2 from '../assets/p_img2_1.png';
import yash3 from '../assets/p_img46.png';
import { FaArrowUp, FaChevronLeft, FaUser, FaFemale, FaMale, FaChild, FaTimes } from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router-dom';
import Fuse from 'fuse.js';

// ── helpers ────────────────────────────────────────────────────────────────
const getDiscount = (id) => {
  const discounts = [10, 15, 20, 25, 30, 40, 50];
  return discounts[parseInt(id, 36) % discounts.length];
};

const GENDER_TABS = [
  { label: 'All',   icon: <FaUser   className="inline-block" /> },
  { label: 'Men',   icon: <FaMale   className="inline-block" /> },
  { label: 'Women', icon: <FaFemale className="inline-block" /> },
  { label: 'Kids',  icon: <FaChild  className="inline-block" /> },
];

const TYPE_FILTERS = {
  Men:   ['shirts', 'tshirts', 'trousers', 'shorts', 'jeans', 'trackpants'],
  Women: ['tops', 'dresses', 'skirts', 'jeans', 'tshirts', 'trousers'],
  Kids:  ['tops', 'dresses', 'skirts', 'shorts', 'tshirts', 'jeans'],
  All:   ['tops', 'tshirts', 'shirts', 'jeans', 'dresses', 'shorts', 'skirts', 'trousers', 'trackpants'],
};

// ── component ──────────────────────────────────────────────────────────────
const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // ── filter state ──────────────────────────────────────────────────────
  const [activeGender,  setActiveGender]  = useState('All');
  const [activeTypes,   setActiveTypes]   = useState([]);   // productType chips
  const [sortType,      setSortType]      = useState('relevant');
  const [collectionItems, setCollectionItems] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBackToTop,     setShowBackToTop]     = useState(false);

  // ── sale countdown ────────────────────────────────────────────────────
  const [saleEnd]   = useState(() => Date.now() + 1000 * 60 * 60 * 2);
  const [timeLeft,  setTimeLeft]  = useState({ hours: 0, minutes: 0, seconds: 0 });

  // ── banner ────────────────────────────────────────────────────────────
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [yash1, yash2, yash3];

  // ── read URL params on mount / change ─────────────────────────────────
  useEffect(() => {
    const gender      = searchParams.get('gender');
    const productType = searchParams.get('productType');
    const newArrival  = searchParams.get('newArrival');

    if (newArrival === 'true') {
      setActiveGender('All');
      setActiveTypes(['new']);
      return;
    }
    if (gender)      setActiveGender(gender);
    if (productType) setActiveTypes([productType]);
  }, [searchParams]);

  // ── scroll spy ────────────────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── countdown ─────────────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const diff    = Math.max(0, saleEnd - Date.now());
      const hours   = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [saleEnd]);

  // ── core filter + sort logic ──────────────────────────────────────────
  const applyFilter = useCallback(() => {
    let result = [...products];

    // 1. NEW ARRIVAL shortcut
    if (activeTypes.includes('new')) {
      result = result
        .filter(p => p.isNewArrival === true)
        .sort((a, b) => (b.date || 0) - (a.date || 0));
      setCollectionItems(sortItems(result));
      return;
    }

    // 2. GENDER (category field in DB)
    if (activeGender !== 'All') {
      result = result.filter(p =>
        p.category?.toLowerCase() === activeGender.toLowerCase()
      );
    }

    // 3. PRODUCT TYPE (productType field in DB)  — strict: no mixing
    if (activeTypes.length > 0) {
      result = result.filter(p =>
        activeTypes.some(t =>
          p.productType?.toLowerCase() === t.toLowerCase()
        )
      );
    }

    // 4. SEARCH (Smart Fuzzy Match)
    if (showSearch && search && search.trim() !== '') {
      const fuse = new Fuse(result, {
        keys: [
          { name: 'name', weight: 0.5 },
          { name: 'category', weight: 0.2 },
          { name: 'subCategory', weight: 0.2 },
          { name: 'productType', weight: 0.1 }
        ],
        threshold: 0.4, // Allows for typos (e.g., 'girsl dres' -> 'girls dress')
        distance: 100,
        ignoreLocation: true,
      });
      const fuzzyResults = fuse.search(search);
      result = fuzzyResults.map(res => res.item);
    }

    setCollectionItems(sortItems(result));
  }, [products, activeGender, activeTypes, search, showSearch, sortType]);

  const sortItems = (arr) => {
    const copy = [...arr];
    switch (sortType) {
      case 'low-high': return copy.sort((a, b) => a.price - b.price);
      case 'high-low': return copy.sort((a, b) => b.price - a.price);
      case 'newest':   return copy.sort((a, b) => (b.date || 0) - (a.date || 0));
      default:         return copy;
    }
  };

  useEffect(() => { applyFilter(); }, [applyFilter]);

  // ── tab / chip handlers ───────────────────────────────────────────────
  const handleGenderTab = (gender) => {
    setActiveGender(gender);
    setActiveTypes([]);
    setSearchParams({});
  };

  const toggleType = (type) => {
    setActiveTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setActiveGender('All');
    setActiveTypes([]);
    setSortType('relevant');
    setSearchParams({});
  };

  const hasActiveFilters = activeGender !== 'All' || activeTypes.length > 0;

  // ── derived data ──────────────────────────────────────────────────────
  const discountedProducts = products
    .filter(p => getDiscount(p._id) >= 20)
    .slice(0, 6);

  const typeOptions = TYPE_FILTERS[activeGender] || TYPE_FILTERS.All;

  // ── sub-components ────────────────────────────────────────────────────
  const FilterPanel = () => (
    <div className="flex flex-col gap-6">
      {/* Gender */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Gender</p>
        <div className="flex flex-col gap-2">
          {['Men', 'Women', 'Kids'].map(g => (
            <label key={g} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-pink-600 transition">
              <input
                type="checkbox"
                checked={activeGender === g}
                onChange={() => handleGenderTab(activeGender === g ? 'All' : g)}
                className="accent-pink-500 w-4 h-4"
              />
              {g}
            </label>
          ))}
        </div>
      </div>

      {/* Product Type */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Type</p>
        <div className="flex flex-col gap-2">
          {typeOptions.map(type => (
            <label key={type} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 capitalize hover:text-pink-600 transition">
              <input
                type="checkbox"
                checked={activeTypes.includes(type)}
                onChange={() => toggleType(type)}
                className="accent-pink-500 w-4 h-4"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold mt-2 transition"
        >
          <FaTimes /> Clear all filters
        </button>
      )}
    </div>
  );

  // ── render ────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-10 pt-6 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-white dark:bg-gray-900 min-h-screen font-sans">

      {/* ── Gender Tabs ── */}
      <div className="flex justify-center gap-2 sm:gap-4 flex-wrap">
        {GENDER_TABS.map(tab => (
          <button
            key={tab.label}
            className={`px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-sm border-2 flex items-center gap-1.5
              ${activeGender === tab.label && activeTypes.length === 0
                ? 'bg-gradient-to-r from-pink-500 to-yellow-400 text-white border-pink-400 scale-105 shadow-md'
                : 'bg-white text-pink-500 border-pink-200 hover:bg-pink-50 hover:scale-105 dark:bg-gray-800 dark:text-pink-300 dark:border-pink-700'
              }`}
            onClick={() => handleGenderTab(tab.label)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ── Active Filter Chips ── */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 -mt-4">
          <span className="text-xs text-gray-500 font-medium">Active:</span>
          {activeGender !== 'All' && (
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              {activeGender}
              <FaTimes className="cursor-pointer ml-1 hover:text-pink-900" onClick={() => handleGenderTab('All')} />
            </span>
          )}
          {activeTypes.map(t => (
            <span key={t} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 capitalize">
              {t}
              <FaTimes className="cursor-pointer ml-1 hover:text-indigo-900" onClick={() => toggleType(t)} />
            </span>
          ))}
          <button onClick={clearAllFilters} className="text-xs text-red-400 hover:text-red-600 underline font-medium transition">Clear all</button>
        </div>
      )}

      {/* ── Banner ── */}
      <div
        className="rounded-2xl relative text-black flex flex-col items-center justify-center shadow-lg w-full overflow-hidden cursor-pointer"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '180px',
        }}
        onClick={() => document.getElementById('collection-grid')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="absolute inset-0 bg-white/60" />
        <div className="relative flex flex-col items-center justify-center py-10 px-4 w-full text-center">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 text-black drop-shadow-lg tracking-widest uppercase">
            New Season, New Style
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-medium text-black/80 max-w-xl mb-5">
            Discover the latest trends and timeless essentials for Men, Women, and Kids.
          </p>
          <button className="px-8 sm:px-12 py-3 sm:py-4 bg-black text-white font-bold rounded-full shadow-lg text-base sm:text-xl hover:scale-105 transition-all duration-300">
            Shop Collection
          </button>
        </div>
        <button onClick={e => { e.stopPropagation(); setCurrentImageIndex(i => (i - 1 + images.length) % images.length); }}
          className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 sm:p-3 hover:bg-black hover:text-white transition shadow">←</button>
        <button onClick={e => { e.stopPropagation(); setCurrentImageIndex(i => (i + 1) % images.length); }}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/80 text-black rounded-full p-2 sm:p-3 hover:bg-black hover:text-white transition shadow">→</button>
      </div>

      {/* ── Sale Section ── */}
      <div className="w-full p-5 sm:p-6 bg-gradient-to-r from-yellow-100 via-pink-100 to-red-100 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-5 gap-3">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-pink-700 uppercase tracking-wide">Limited Time Sale</h3>
            <p className="text-sm sm:text-base text-gray-700 font-medium">Grab these hot deals before they're gone!</p>
          </div>
          <div className="flex items-center gap-2 bg-black/20 px-5 py-2 rounded-full font-bold tracking-widest text-pink-700 text-base sm:text-lg">
            <span>Ends in:</span>
            <span className="tabular-nums">{String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 w-full">
          {discountedProducts.map(prod => {
            const discount = getDiscount(prod._id);
            return (
              <Link key={prod._id} to={`/product/${prod._id}`}
                className="group bg-white rounded-xl shadow-md p-3 flex flex-col items-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-pink-200 relative">
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-bounce z-10">
                  {discount}% OFF
                </span>
                <img src={prod.images?.[0] || '/placeholder.jpg'} alt={prod.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mb-2" />
                <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center truncate w-full group-hover:text-pink-600 transition">{prod.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-xs line-through">₹{prod.price}</span>
                  <span className="text-sm font-bold text-green-600">₹{Math.round(prod.price * (1 - discount / 100))}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Main Collection Section ── */}
      <div className="flex flex-row gap-6 lg:gap-10 relative" id="collection-grid">

        {/* ── Desktop Sidebar ── */}
        <div className="hidden md:block sticky top-24 h-fit min-w-[180px] max-w-[200px] bg-white dark:bg-gray-800 rounded-2xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-200 mb-5">🎛 Filters</p>
          <FilterPanel />
        </div>

        {/* ── Products Area ── */}
        <div className="flex-1 min-w-0">
          {/* Sort row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <div className="flex items-baseline gap-2">
              {search ? (
                <>
                  <Title text1="Results for" text2={`"${search}"`} />
                  <span className="text-xs text-gray-400 font-medium">({collectionItems.length} items)</span>
                </>
              ) : (
                <>
                  <Title text1={activeGender !== 'All' ? activeGender : 'All'} text2="COLLECTIONS" />
                  <span className="text-xs text-gray-400 font-medium">({collectionItems.length} items)</span>
                </>
              )}
            </div>
            <select
              value={sortType}
              onChange={e => setSortType(e.target.value)}
              className="border-2 border-gray-200 text-sm px-3 py-2 rounded-lg font-semibold bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200 w-full sm:w-auto focus:border-pink-400 outline-none transition"
            >
              <option value="relevant">Sort: Relevant</option>
              <option value="newest">Sort: Newest First</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          {/* Type chips (context-aware) */}
          <div className="flex flex-wrap gap-2 mb-6">
            {typeOptions.map(type => (
              <button
                key={type}
                onClick={() => toggleType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border
                  ${activeTypes.includes(type)
                    ? 'bg-pink-500 text-white border-pink-500 shadow'
                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Products grid */}
          {collectionItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="text-6xl">🔍</span>
              {search ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">No exact matches found for "{search}"</h3>
                  <p className="text-gray-500 text-center max-w-sm mt-2">
                    Try checking your spelling, or using more general terms like "Shirts" or "Dresses".
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No products available</h3>
                  <p className="text-gray-400 text-sm text-center max-w-xs">
                    No products match the selected filters. Try a different category or clear filters.
                  </p>
                </>
              )}
              
              {(hasActiveFilters || search) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-4 px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold text-sm transition shadow-md"
                >
                  Clear Filters & Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {collectionItems.map(item => (
                <ProductItem key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile Filter Button ── */}
      <button
        className="md:hidden fixed bottom-6 right-6 z-50 bg-black text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm"
        onClick={() => setShowMobileFilters(true)}
      >
        <FaChevronLeft className="rotate-90" /> Filters
        {hasActiveFilters && <span className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{(activeGender !== 'All' ? 1 : 0) + activeTypes.length}</span>}
      </button>

      {/* ── Mobile Filters Drawer ── */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end" onClick={() => setShowMobileFilters(false)}>
          <div
            className="w-72 max-w-[85vw] bg-white dark:bg-gray-900 h-full p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-lg text-gray-800 dark:text-gray-100">🎛 Filters</p>
              <button className="text-pink-500 font-bold text-xl" onClick={() => setShowMobileFilters(false)}>✕</button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-auto px-6 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition"
            >
              Show {collectionItems.length} Results
            </button>
          </div>
        </div>
      )}

      {/* ── Back to Top ── */}
      {showBackToTop && (
        <button
          className="fixed bottom-6 left-6 z-50 bg-black text-white p-3 rounded-full shadow-lg flex items-center gap-2 font-bold"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <FaArrowUp />
        </button>
      )}
    </div>
  );
};

export default Collection;