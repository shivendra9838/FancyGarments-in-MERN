import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add'; 
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Wishlist from './pages/Wishlist';
import Users from './pages/Users';
import Profile from './pages/Profile';

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || "");
  const [adminEmail, setAdminEmail] = useState(localStorage.getItem('adminEmail') || "");
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save token to localStorage on login
  const handleSetToken = (newToken, email) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('adminToken', newToken);
      if (email) {
        setAdminEmail(email);
        localStorage.setItem('adminEmail', email);
      }
    } else {
      localStorage.removeItem('adminToken');
      setAdminEmail("");
      localStorage.removeItem('adminEmail');
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ToastContainer />
      {token === ""
        ? <Login setToken={handleSetToken} />
        : (
          <>
            <div className="w-full text-center py-4 bg-indigo-50 dark:bg-gray-800 text-indigo-700 dark:text-indigo-300 text-xl font-bold shadow">
              {adminEmail ? `Welcome, Admin (${adminEmail})!` : 'Welcome, Admin!'}
            </div>
            <Navbar setToken={handleSetToken} theme={theme} setTheme={setTheme} />
            <hr className="dark:border-gray-700" />
            <div className="flex">
              <Sidebar />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 dark:text-gray-300 text-base ">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token}/>} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
};

export default App;
