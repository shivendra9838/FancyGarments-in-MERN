import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import yash1 from '../assets/about_img.png';
import yash2 from '../assets/p_img2_1.png';
import yash3 from '../assets/p_img46.png';
import { FaArrowUp, FaFireAlt, FaStar, FaChevronLeft, FaChevronRight, FaUser, FaFemale, FaMale, FaChild } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [collectionItems, setCollectionItems] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("a");
  const { search, showSearch } = useContext(ShopContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const bannerRef = React.useRef(null);
  const [activeTab, setActiveTab] = useState('All');
  const [saleEnd, setSaleEnd] = useState(Date.now() + 1000 * 60 * 60 * 2); // 2 hours from now
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const trendingProducts = products.slice(0, 10);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setCategory(prev => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev => prev.filter(item => item !== e.target.value));
    } else {
      setSubCategory(prev => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productCopy = products;
    if (category.length > 0)
      productCopy = productCopy.filter(item => category.includes(item.category));
    if (subCategory.length > 0)
      productCopy = productCopy.filter(item => subCategory.includes(item.subCategory));
    if (showSearch && search)
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    setCollectionItems(productCopy);
  };

  const sortProduct = () => {
    let fpCopy = collectionItems.slice();
    switch (sortType) {
      case 'low-high':
        setCollectionItems(fpCopy.sort((a, b) => (a.price - b.price)));
        break;
      case 'high-low':
        setCollectionItems(fpCopy.sort((a, b) => (b.price - a.price)));
        break;
      default:
        applyFilter();
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, saleEnd - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [saleEnd]);

  // Helper to get discounted products
  const getDiscount = (id) => {
    const discounts = [10, 15, 20, 25, 30, 40, 50];
    return discounts[parseInt(id, 36) % discounts.length];
  };
  const discountedProducts = products.filter(p => getDiscount(p._id) >= 20).slice(0, 6);

  const images = [yash1, yash2, yash3];
  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleBannerClick = () => {
    const grid = document.getElementById('collection-grid');
    if (grid) grid.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTabClick = (cat) => {
    setActiveTab(cat);
    if (cat === 'All') {
      setCategory([]);
    } else {
      setCategory([cat]);
    }
  };

  return (
    <div className="flex flex-col gap-14 pt-10 border-t bg-white font-sans min-h-screen">
      {/* Category Tabs - H&M style, now smaller and more attractive */}
      <div className="flex justify-center gap-4 mb-8 mt-2">
        {[
          { label: 'All', icon: <FaUser className="inline-block mr-1" /> },
          { label: 'Men', icon: <FaMale className="inline-block mr-1" /> },
          { label: 'Women', icon: <FaFemale className="inline-block mr-1" /> },
          { label: 'Kids', icon: <FaChild className="inline-block mr-1" /> },
        ].map(tab => (
          <button
            key={tab.label}
            className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 shadow-sm border-2 flex items-center gap-1
              ${activeTab === tab.label
                ? 'bg-gradient-to-r from-pink-500 to-yellow-400 text-white border-pink-400 scale-105 shadow-md'
                : 'bg-white text-pink-500 border-pink-200 hover:bg-pink-50 hover:scale-105'}
            `}
            onClick={() => handleTabClick(tab.label)}
            style={{ letterSpacing: '0.08em' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {/* Minimal Banner Section with Full Width */}
      <div
        className="mb-12 p-10 bg-gray-100 rounded-2xl relative text-black flex flex-col items-center justify-center shadow-lg w-full"
        style={{
          backgroundImage: `url(${images[currentImageIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '220px',
        }}
        onClick={handleBannerClick}
        ref={bannerRef}
      >
        <div className="absolute inset-0 bg-white bg-opacity-60 rounded-2xl"></div>
        <div className="relative flex flex-col items-center justify-center py-8 w-full">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-center text-black drop-shadow-lg tracking-widest uppercase" style={{ letterSpacing: '0.18em' }}>
            New Season, New Style
          </h2>
          <p className="text-center mb-6 text-lg md:text-2xl font-medium text-black/80 max-w-2xl">
            Discover the latest trends and timeless essentials for Men, Women, and Kids. Shop now for a fresh look!
          </p>
          <button
            className="mt-2 px-12 py-4 bg-black text-white font-bold rounded-full shadow-lg text-xl hover:scale-105 transition-all duration-300"
            onClick={e => { e.stopPropagation(); handleBannerClick(); }}
          >
            Shop Collection
          </button>
        </div>
        {/* Navigation Arrows */}
        <button
          onClick={e => { e.stopPropagation(); handlePrev(); }}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-80 text-black rounded-full p-3 hover:bg-black hover:text-white transition shadow"
        >
          &larr;
        </button>
        <button
          onClick={e => { e.stopPropagation(); handleNext(); }}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-80 text-black rounded-full p-3 hover:bg-black hover:text-white transition shadow"
        >
          &rarr;
        </button>
      </div>
      {/* Discount/Sale Section */}
      <div className="w-full mb-12 p-6 bg-gradient-to-r from-yellow-100 via-pink-100 to-red-100 rounded-2xl shadow-lg flex flex-col items-center">
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full mb-6 gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-pink-700 mb-1 tracking-wide uppercase">Limited Time Sale</h3>
            <p className="text-lg text-gray-700 font-medium">Grab these hot deals before they're gone!</p>
          </div>
          <div className="flex items-center gap-2 bg-black bg-opacity-20 px-6 py-2 rounded-full text-lg font-bold tracking-widest text-pink-700">
            <span className="mr-2">Ends in:</span>
            <span className="tabular-nums">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 w-full">
          {discountedProducts.map(prod => {
            const discount = getDiscount(prod._id);
            const discountedPrice = Math.round(prod.price * (1 - discount / 100));
            return (
              <Link
                key={prod._id}
                to={`/product/${prod._id}`}
                className="group bg-white rounded-xl shadow-md p-3 flex flex-col items-center hover:shadow-xl hover:scale-105 transition-all duration-300 border border-pink-200 relative"
              >
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-bounce z-10">
                  {discount}% OFF
                </span>
                <img
                  src={prod.images?.[0] || '/placeholder.jpg'}
                  alt={prod.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg mb-2"
                />
                <span className="text-xs sm:text-sm font-semibold text-gray-800 text-center truncate w-full group-hover:text-pink-600 transition">{prod.name}</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-400 text-xs line-through">₹{prod.price}</span>
                  <span className="text-base font-bold text-green-600">₹{discountedPrice}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      {/* Responsive Collection Section */}
      <div className="flex flex-row gap-10 relative">
        {/* Filters Sidebar (sticky on desktop, floating on mobile) - unchanged */}
        <div className="hidden md:block sticky top-24 h-fit z-10">
          <p className="my-2 text-xl flex items-center cursor-pointer gap-2">FILTERS</p>
          <div className="border border-gray-300 pl-5 py-3 pr-20 mt-6 rounded-lg bg-white shadow">
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input type="checkbox" value="Men" onChange={toggleCategory} />Men
              </p>
              <p className="flex gap-2">
                <input type="checkbox" value="Women" onChange={toggleCategory} />Women
              </p>
              <p className="flex gap-2">
                <input type="checkbox" value="Kids" onChange={toggleCategory} />Kids
              </p>
            </div>
          </div>
          <div className="border border-gray-300 pl-5 py-3 pr-20 my-6 rounded-lg bg-white shadow">
            <p className="mb-3 text-sm font-medium">TYPE</p>
            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input type="checkbox" value="Topwear" onChange={toggleSubCategory} />Topwear
              </p>
              <p className="flex gap-2">
                <input type="checkbox" value="Bottomwear" onChange={toggleSubCategory} />Bottomwear
              </p>
              <p className="flex gap-2">
                <input type="checkbox" value="Winterwear" onChange={toggleSubCategory} />Winterwear
              </p>
            </div>
          </div>
        </div>
        {/* Floating Filter Button for Mobile - unchanged */}
        <button
          className="md:hidden fixed bottom-8 right-8 z-50 bg-black text-white p-4 rounded-full shadow-lg flex items-center gap-2 animate-bounce font-bold text-lg"
          onClick={() => setShowMobileFilters(true)}
        >
          <FaChevronLeft className="rotate-90" /> Filters
        </button>
        {/* Mobile Filters Drawer - unchanged */}
        {showMobileFilters && (
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end">
            <div className="w-3/4 max-w-xs bg-white h-full p-6 shadow-lg flex flex-col gap-6 animate-slideInRight">
              <button className="self-end mb-4 text-pink-500 font-bold text-lg" onClick={() => setShowMobileFilters(false)}>&times; Close</button>
              <div>
                <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                  <p className="flex gap-2">
                    <input type="checkbox" value="Men" onChange={toggleCategory} />Men
                  </p>
                  <p className="flex gap-2">
                    <input type="checkbox" value="Women" onChange={toggleCategory} />Women
                  </p>
                  <p className="flex gap-2">
                    <input type="checkbox" value="Kids" onChange={toggleCategory} />Kids
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium">TYPE</p>
                <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                  <p className="flex gap-2">
                    <input type="checkbox" value="Topwear" onChange={toggleSubCategory} />Topwear
                  </p>
                  <p className="flex gap-2">
                    <input type="checkbox" value="Bottomwear" onChange={toggleSubCategory} />Bottomwear
                  </p>
                  <p className="flex gap-2">
                    <input type="checkbox" value="Winterwear" onChange={toggleSubCategory} />Winterwear
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1" onClick={() => setShowMobileFilters(false)}></div>
          </div>
        )}
        {/* Products Grid - H&M style */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-2xl mb-8 gap-4">
            <Title text1="All" text2="COLLECTIONS" />
            <select onChange={(e) => setSortType(e.target.value)} className="border-2 border-gray-300 text-sm px-4 py-2 rounded-lg font-semibold">
              <option value="relevant">Sort By Relevant</option>
              <option value="low-high">Sort By Low to High</option>
              <option value="high-low">Sort By High to Low</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10" id="collection-grid">
            {collectionItems.map(item => (
              <ProductItem key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
      {/* Back to Top Button - unchanged */}
      {showBackToTop && (
        <button
          className="fixed bottom-8 left-8 z-50 bg-black text-white p-4 rounded-full shadow-lg flex items-center gap-2 animate-bounce font-bold text-lg"
          onClick={handleBackToTop}
        >
          <FaArrowUp /> Top
        </button>
      )}
    </div>
  );
};

export default Collection;