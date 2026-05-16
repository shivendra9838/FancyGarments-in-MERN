import React, { useContext, useEffect, useState, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { FaSearch, FaHistory, FaTimes, FaFire } from 'react-icons/fa';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch, products } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const [localSearch, setLocalSearch] = useState(search);
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const trendingSearches = ['Mens T-Shirt', 'Girls Dress', 'Jeans', 'Tops', 'Trackpants'];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(saved);
  }, []);

  useEffect(() => {
    if (!location.pathname.includes('/collection')) {
      setShowSearch(false);
    }
  }, [location]);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Configure Fuse.js for suggestions
  const fuse = new Fuse(products, {
    keys: ['name', 'category', 'subCategory', 'productType'],
    threshold: 0.3,
    distance: 100,
  });

  useEffect(() => {
    if (localSearch.trim().length > 1) {
      const results = fuse.search(localSearch).slice(0, 5);
      setSuggestions(results.map(r => r.item));
    } else {
      setSuggestions([]);
    }
    setSelectedIndex(-1);
  }, [localSearch, products]);

  const handleSearchSubmit = (term) => {
    const finalTerm = term.trim();
    if (!finalTerm) return;

    setSearch(finalTerm);
    
    // Save to recent
    const updatedRecent = [finalTerm, ...recentSearches.filter(s => s !== finalTerm)].slice(0, 5);
    setRecentSearches(updatedRecent);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

    setIsFocused(false);
    navigate('/collection');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions.length > 0) {
        handleSearchSubmit(suggestions[selectedIndex].name);
      } else {
        handleSearchSubmit(localSearch);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > -1 ? prev - 1 : prev));
    }
  };

  if (!showSearch) return null;

  return (
    <div className='bg-white shadow-md relative z-50 w-full' ref={dropdownRef}>
      <div className='max-w-4xl mx-auto p-4 flex items-center gap-4'>
        <div className='flex-1 relative group'>
          <div className={`flex items-center border-2 rounded-full px-5 py-3 transition-colors ${isFocused ? 'border-pink-500' : 'border-gray-300'}`}>
            <FaSearch className={`text-xl ${isFocused ? 'text-pink-500' : 'text-gray-400'}`} />
            <input 
              className='flex-1 ml-3 outline-none bg-transparent text-gray-700 placeholder-gray-400 text-lg' 
              type="text" 
              placeholder='Search for products, categories, or brands...' 
              value={localSearch} 
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setIsFocused(true);
              }} 
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleKeyDown}
            />
            {localSearch && (
              <FaTimes 
                className='text-gray-400 cursor-pointer hover:text-gray-600' 
                onClick={() => setLocalSearch('')} 
              />
            )}
          </div>

          {/* Search Dropdown / Suggestions */}
          {isFocused && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden'>
              {localSearch.length > 1 ? (
                <div>
                  {suggestions.length > 0 ? (
                    <ul className='py-2'>
                      {suggestions.map((item, index) => (
                        <li 
                          key={item._id} 
                          onClick={() => handleSearchSubmit(item.name)}
                          className={`px-5 py-3 cursor-pointer flex items-center gap-4 transition-colors ${index === selectedIndex ? 'bg-pink-50' : 'hover:bg-gray-50'}`}
                        >
                          <FaSearch className='text-gray-400 text-sm' />
                          <div className='flex-1'>
                            <p className='text-gray-800 font-medium truncate'>{item.name}</p>
                            <p className='text-xs text-gray-500 capitalize'>{item.category} &gt; {item.subCategory}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className='p-5 text-center text-gray-500'>
                      No suggestions found for "{localSearch}"
                    </div>
                  )}
                </div>
              ) : (
                <div className='p-5 flex flex-col md:flex-row gap-8'>
                  <div className='flex-1'>
                    <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
                      <FaHistory /> Recent Searches
                    </h4>
                    {recentSearches.length > 0 ? (
                      <ul className='space-y-2'>
                        {recentSearches.map((term, i) => (
                          <li 
                            key={i} 
                            onClick={() => { setLocalSearch(term); handleSearchSubmit(term); }}
                            className='text-gray-700 cursor-pointer hover:text-pink-600 transition-colors'
                          >
                            {term}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='text-sm text-gray-500'>No recent searches</p>
                    )}
                  </div>
                  <div className='flex-1'>
                    <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2'>
                      <FaFire className="text-orange-500" /> Trending Now
                    </h4>
                    <ul className='space-y-2'>
                      {trendingSearches.map((term, i) => (
                        <li 
                          key={i} 
                          onClick={() => { setLocalSearch(term); handleSearchSubmit(term); }}
                          className='text-gray-700 cursor-pointer hover:text-pink-600 transition-colors flex items-center gap-2'
                        >
                          <FaSearch className='text-gray-300 text-xs' /> {term}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <button 
          onClick={() => setShowSearch(false)} 
          className='bg-gray-100 text-gray-600 hover:bg-gray-200 px-4 py-3 rounded-full font-semibold transition-colors'
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
