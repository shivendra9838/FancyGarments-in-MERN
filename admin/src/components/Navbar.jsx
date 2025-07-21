import React, { useState, useEffect } from 'react';
import { logo } from '../assets/assets';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ setToken, theme, setTheme }) => {
  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-colors">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo - Extreme Left */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-yellow-400 transition"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Logout Button */}
          <button
            onClick={() => setToken('')}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-full transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
