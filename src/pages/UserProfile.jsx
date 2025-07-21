import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { userData, token, backendUrl, products, currency, addToCart, wishlist, removeFromWishlist } = useContext(ShopContext);
  const [profileImage, setProfileImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    gender: '',
  });
  const [emailList, setEmailList] = useState([]);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [imageFile, setImageFile] = useState(null);

  // Modal state for Add Address and Account Settings
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const addressFormRef = useRef();

  // Add Address form state
  const [newAddress, setNewAddress] = useState({
    firstName: '', lastName: '', street: '', city: '', state: '', country: '', zipCode: '', phone: ''
  });
  const [defaultAddressIdx, setDefaultAddressIdx] = useState(0);
  const handleEditAddress = (idx) => {
    setNewAddress(addresses[idx]);
    setShowAddAddress(true);
    setEditingAddressIdx(idx);
  };
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const handleDeleteAddress = (idx) => {
    setAddresses(prev => prev.filter((_, i) => i !== idx));
    if (defaultAddressIdx === idx) setDefaultAddressIdx(0);
  };
  const handleSetDefault = (idx) => setDefaultAddressIdx(idx);
  // Update address on save
  const handleAddAddress = (e) => {
    e.preventDefault();
    if (editingAddressIdx !== null) {
      setAddresses(prev => prev.map((a, i) => i === editingAddressIdx ? newAddress : a));
      setEditingAddressIdx(null);
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
    setNewAddress({ firstName: '', lastName: '', street: '', city: '', state: '', country: '', zipCode: '', phone: '' });
    setShowAddAddress(false);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  // Fetch orders for stats, recent orders, and addresses
  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setOrders(response.data.orders);
          // Extract unique addresses
          const addrMap = {};
          response.data.orders.forEach(order => {
            const addr = order.address;
            if (addr && addr.street) {
              const key = `${addr.street}|${addr.city}|${addr.state}|${addr.zipCode}`;
              addrMap[key] = addr;
            }
          });
          setAddresses(Object.values(addrMap));
        }
      } catch (err) {
        // ignore
      }
    };
    fetchOrders();
  }, [token, backendUrl]);

  const handleRemoveWishlist = (id) => {
    removeFromWishlist(id);
  };

  // Dummy wishlist/recently viewed (pick 3 random products)
  useEffect(() => {
    if (products && products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      // The original code had a local wishlist state, but it's now managed by ShopContext.
      // This useEffect is no longer needed for local wishlist management.
      // It can be removed if not used elsewhere.
    }
  }, [products]);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '********',
        mobile: userData.mobile || '',
        gender: userData.gender || '',
      });
      setEmailList([userData.email]);
      if (userData.profileImg) {
        // If profileImg is a relative path, prefix with backendUrl
        if (userData.profileImg.startsWith('/uploads')) {
          setProfileImage(`${backendUrl}${userData.profileImg}`);
        } else {
          setProfileImage(userData.profileImg);
        }
      }
    }
  }, [userData, backendUrl]);

  // Fallback: if profileImage is not set but userData.profileImg exists, set it
  useEffect(() => {
    if ((!profileImage || profileImage === '') && userData && userData.profileImg) {
      if (userData.profileImg.startsWith('/uploads')) {
        setProfileImage(`${backendUrl}${userData.profileImg}`);
      } else {
        setProfileImage(userData.profileImg);
      }
    }
  }, [profileImage, userData, backendUrl]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEmail = () => {
    if (newEmail.trim() !== '') {
      setEmailList((prev) => [...prev, newEmail.trim()]);
      setNewEmail('');
      setShowEmailInput(false);
    }
  };

  const handleSave = async () => {
    setIsEditMode(false);
    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('email', formData.email);
      form.append('mobile', formData.mobile);
      form.append('gender', formData.gender);
      if (imageFile) {
        form.append('profileImg', imageFile);
      }
      await axios.post(
        `${backendUrl}/api/user/profile/update-image`,
        form,
        { headers: { token } }
      );
      // Refetch user profile
      if (typeof window !== 'undefined') window.location.reload();
    } catch (err) {
      // handle error
    }
  };

  // Quick stats
  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
  const wishlistCount = wishlist.length;

  // Recent orders (flattened)
  const recentOrderItems = orders
    .flatMap(order => order.items.map(item => {
      // Find product by _id (item._id)
      const product = products.find(p => p._id === item._id);
      const productImage = product && product.images && product.images[0];
      return {
        ...item,
        orderId: order._id,
        status: order.status,
        date: order.date,
        image: item.image || productImage || (item.images ? item.images[0] : null),
        total: order.amount,
      };
    }))
    .slice(0, 3);

  // Helper for order status progress
  const orderStatusSteps = ['Ordered', 'Packed', 'Shipped', 'Delivered'];
  function getOrderStep(status) {
    switch (status?.toLowerCase()) {
      case 'processing': return 1;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 1;
    }
  }
  function OrderProgressBar({ status }) {
    const step = getOrderStep(status);
    return (
      <div className="flex items-center gap-2 my-2">
        {orderStatusSteps.map((label, idx) => (
          <React.Fragment key={label}>
            <div className={`flex flex-col items-center ${idx + 1 <= step ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-4 h-4 rounded-full border-2 ${idx + 1 <= step ? 'bg-green-400 border-green-600' : 'bg-gray-200 border-gray-400'}`}></div>
              <span className="text-xs mt-1">{label}</span>
            </div>
            {idx < orderStatusSteps.length - 1 && <div className={`flex-1 h-1 ${idx + 1 < step ? 'bg-green-400' : 'bg-gray-200'}`}></div>}
          </React.Fragment>
        ))}
      </div>
    );
  }

  // Track Order Section
  function TrackOrderBox({ orders }) {
    const [orderId, setOrderId] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [result, setResult] = React.useState(null);
    const [error, setError] = React.useState('');
    const handleTrack = (e) => {
      e.preventDefault();
      setError('');
      setResult(null);
      if (!orderId.trim() || !email.trim()) {
        setError('Please enter both Order ID and Email.');
        return;
      }
      const found = orders.find(o => o._id?.toLowerCase().includes(orderId.trim().toLowerCase()) && o.email?.toLowerCase() === email.trim().toLowerCase());
      if (found) {
        setResult(found);
      } else {
        setError('Order not found. Please check your details.');
      }
    };
    return (
      <div className="mb-12 w-full max-w-2xl mx-auto">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-green-500 text-2xl">🔎</span> Track Your Order
        </h3>
        <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-2 mb-2">
          <input
            type="text"
            placeholder="Order ID"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded font-bold transition">Track</button>
        </form>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {result && (
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow p-4 mt-2">
            <div className="font-bold mb-1">Order Status: <span className="capitalize">{result.status}</span></div>
            <OrderProgressBar status={result.status} />
            <div className="text-sm text-gray-500">Order ID: {result._id?.slice(-6)}</div>
            <div className="text-sm text-gray-500">Date: {result.date ? new Date(result.date).toLocaleDateString() : 'N/A'}</div>
            <div className="text-sm text-gray-500">Total Paid: {result.amount || result.total}</div>
          </div>
        )}
      </div>
    );
  }

  // Gift Card Section
  function GiftCardSection() {
    const [giftCards, setGiftCards] = React.useState(() => {
      const stored = localStorage.getItem('userGiftCards');
      return stored ? JSON.parse(stored) : [];
    });
    const [newCode, setNewCode] = React.useState('');
    const [message, setMessage] = React.useState('');
    const handleAddGiftCard = (e) => {
      e.preventDefault();
      if (!newCode.trim()) return;
      // Simulate balance lookup
      const balance = newCode === 'WELCOME200' ? 200 : newCode === 'FIRST10' ? 100 : Math.floor(Math.random() * 500) + 50;
      const card = { code: newCode.trim().toUpperCase(), balance, status: 'Active' };
      setGiftCards(prev => {
        const updated = [...prev, card];
        localStorage.setItem('userGiftCards', JSON.stringify(updated));
        return updated;
      });
      setMessage('Gift card added!');
      setNewCode('');
      setTimeout(() => setMessage(''), 2000);
    };
    return (
      <div className="mb-16">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-yellow-500 text-2xl">🎁</span> Gift Card Balance
        </h3>
        <form onSubmit={handleAddGiftCard} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter gift card code"
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
            className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded font-bold transition">Add</button>
        </form>
        {message && <div className="text-green-600 text-sm mb-2">{message}</div>}
        {giftCards.length === 0 ? (
          <div className="text-gray-500">No gift cards added yet.</div>
        ) : (
          <ul className="flex flex-wrap gap-4">
            {giftCards.map((card, idx) => (
              <li key={idx} className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-xl shadow p-4 flex flex-col items-center min-w-[160px]">
                <div className="font-bold text-lg text-yellow-700 mb-1">{card.code}</div>
                <div className="text-sm text-gray-700 mb-1">Balance: ₹{card.balance}</div>
                <div className={`text-xs font-bold px-2 py-1 rounded ${card.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}`}>{card.status}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Notifications Section
  function NotificationsSection() {
    const [notifications, setNotifications] = React.useState([
      { id: 1, type: 'offer', text: '🎉 Independence Day Offer: Use code FREEDOM30 for 30% off!', read: false },
      { id: 2, type: 'order', text: '�� Your order #123456 has been shipped!', read: false },
      { id: 3, type: 'wishlist', text: '💖 Price drop: “Cotton Top” in your wishlist is now ₹299!', read: false },
    ]);
    const markRead = (id) => setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
    const clearAll = () => setNotifications([]);
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-indigo-500 text-2xl">🔔</span> Notifications / Updates
          </h3>
          {notifications.length > 0 && <button onClick={clearAll} className="text-xs text-pink-600 hover:underline">Clear All</button>}
        </div>
        {notifications.length === 0 ? (
          <div className="text-gray-500">No notifications at the moment.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {notifications.map(notif => (
              <li key={notif.id} className={`flex items-center gap-3 p-3 rounded-lg shadow ${notif.read ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-800'}`}>
                <span className="flex-1">{notif.text}</span>
                {!notif.read && <button onClick={() => markRead(notif.id)} className="text-xs text-blue-600 hover:underline">Mark as read</button>}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Help/Support Tickets Section
  function SupportTicketsSection() {
    const [tickets, setTickets] = React.useState([
      { id: 1, subject: 'Order not delivered', status: 'Open', date: '2024-08-10', message: 'My order #123456 has not arrived yet.' },
      { id: 2, subject: 'Return request', status: 'Closed', date: '2024-08-01', message: 'I want to return a product.' },
    ]);
    const [subject, setSubject] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [success, setSuccess] = React.useState('');
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!subject.trim() || !message.trim()) return;
      setTickets(prev => [
        { id: Date.now(), subject, status: 'Open', date: new Date().toISOString().slice(0, 10), message },
        ...prev,
      ]);
      setSubject('');
      setMessage('');
      setSuccess('Your support ticket has been submitted!');
      setTimeout(() => setSuccess(''), 2000);
    };
    return (
      <div className="mb-16">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <span className="text-blue-500 text-2xl">💬</span> Help / Support Tickets
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Describe your issue..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[60px]"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold transition self-start">Submit</button>
          {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
        </form>
        {tickets.length === 0 ? (
          <div className="text-gray-500">No support tickets yet.</div>
        ) : (
          <ul className="flex flex-col gap-3">
            {tickets.map(ticket => (
              <li key={ticket.id} className={`p-4 rounded-lg shadow flex flex-col gap-1 ${ticket.status === 'Closed' ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-800'}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${ticket.status === 'Closed' ? 'bg-gray-300 text-gray-600' : 'bg-green-100 text-green-700'}`}>{ticket.status}</span>
                  <span className="text-xs text-gray-400 ml-auto">{ticket.date}</span>
                </div>
                <div className="font-semibold">{ticket.subject}</div>
                <div className="text-sm">{ticket.message}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Return/Exchange Modal State
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrder, setReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('');
  const [returnSuccess, setReturnSuccess] = useState('');

  // Download Invoice (simple HTML2PDF like Orders.jsx)
  const downloadInvoice = (item) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1 style="text-align:center; color: #4A90E2;">Invoice</h1>
        <p><strong>Order ID:</strong> ${item.orderId}</p>
        <p><strong>Date:</strong> ${item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Status:</strong> ${item.status}</p>
        <hr />
        <h3>Item</h3>
        <ul>
          <li><strong>Product:</strong> ${item.name}</li>
          <li><strong>Size:</strong> ${item.size || 'N/A'}</li>
          <li><strong>Quantity:</strong> ${item.quantity}</li>
          <li><strong>Total:</strong> ${currency}${item.total}</li>
        </ul>
      </div>
    `;
    if (window.html2pdf) {
      window.html2pdf().from(element).save(`Invoice-${item.orderId}.pdf`);
    } else {
      toast.error('Invoice download not available.');
    }
  };

  // Handle Reorder
  const handleReorder = (item) => {
    // Find product and available size
    const product = products.find(p => p._id === item._id);
    const size = item.size || (product && product.sizes && product.sizes[0]);
    if (!size) {
      toast.error('No size info for reorder.');
      return;
    }
    addToCart(item._id, size);
    toast.success('Item added to cart!');
  };

  // Handle Return/Exchange
  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!returnReason.trim()) {
      toast.error('Please provide a reason.');
      return;
    }
    // Simulate API call
    setReturnSuccess('Return/Exchange request submitted!');
    setTimeout(() => {
      setShowReturnModal(false);
      setReturnOrder(null);
      setReturnReason('');
      setReturnSuccess('');
    }, 2000);
  };

  if (!userData) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User Profile</h2>
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`min-h-screen flex flex-col items-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}> 
        <div className="w-full max-w-5xl px-2 sm:px-6 md:px-10 lg:px-16 py-8">
          {/* Personalized Welcome Message */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome to Profile{userData.name ? `, ${userData.name}` : ''}!</h1>
          </div>
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b pb-8">
            <div className="relative">
              <img
                src={previewImage || profileImage || "https://via.placeholder.com/120"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 dark:border-gray-700 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-1 rounded-full shadow cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <svg className="w-5 h-5 text-gray-600 dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0017.414 6L14 2.586A2 2 0 0012.586 2H4zM9 12H7v-2h2V8h2v2h2v2h-2v2H9v-2z" />
                </svg>
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isEditMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                  />
                ) : (
                  <h2 className="text-3xl font-bold">{formData.name}</h2>
                )}
                <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-bold">Prime Member</span>
              </div>
              {isEditMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 mb-2"
                />
              ) : (
                <p className="text-gray-600 dark:text-gray-300">{formData.email}</p>
              )}
              <div className="flex gap-4 mb-2">
                {isEditMode ? (
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                    placeholder="Mobile Number"
                  />
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">📱 {formData.mobile}</span>
                )}
                {isEditMode ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1"
                  >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span className="text-gray-600 dark:text-gray-300">{formData.gender && (formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1))}</span>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition text-xs"
                >
                  {darkMode ? '☀ Light' : '🌙 Dark'}
                </button>
                {isEditMode ? (
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition text-xs"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition text-xs"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="relative mb-12">
            <div className="absolute -top-8 left-0 w-full flex justify-center">
              <div className="w-2/3 h-2 bg-gradient-to-r from-indigo-200 via-pink-200 to-green-200 rounded-full blur-sm opacity-60"></div>
            </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
            <div className="bg-indigo-50 dark:bg-gray-700 rounded-xl p-6 shadow flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl duration-200 border-t-4 border-indigo-400">
              <span className="text-4xl mb-2 animate-bounce">📦</span>
              <p className="text-lg font-bold">{totalOrders}</p>
              <p className="text-gray-500 text-xs">Total Orders</p>
            </div>
            <div className="bg-pink-50 dark:bg-gray-700 rounded-xl p-6 shadow flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl duration-200 border-t-4 border-pink-400">
              <span className="text-4xl mb-2 animate-pulse">💸</span>
              <p className="text-lg font-bold">{currency}{totalSpent}</p>
              <p className="text-gray-500 text-xs">Total Spent</p>
            </div>
            <div className="bg-green-50 dark:bg-gray-700 rounded-xl p-6 shadow flex flex-col items-center transition-transform hover:scale-105 hover:shadow-xl duration-200 border-t-4 border-green-400">
              <span className="text-4xl mb-2 animate-spin-slow">❤️</span>
              <p className="text-lg font-bold">{wishlistCount}</p>
              <p className="text-gray-500 text-xs">Wishlist Items</p>
            </div>
          </div>
          <div className="w-full flex justify-center mb-8">
            <div className="w-1/2 h-1 bg-gradient-to-r from-indigo-200 via-pink-200 to-green-200 rounded-full blur-sm opacity-60"></div>
          </div>
          </div>

          {/* Recent Orders */}
          <TrackOrderBox orders={orders} />
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-2xl">🛒</span> Recent Orders <span className="text-xs text-gray-400">(last 3)</span>
            </h3>
            {recentOrderItems.length === 0 ? (
              <p className="text-gray-500">No recent orders.</p>
            ) : (
              <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {recentOrderItems.map((item, idx) => (
                  <div key={idx} className="min-w-[260px] bg-white dark:bg-gray-700 rounded-xl shadow-lg p-4 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-2xl duration-200 border-b-4 border-indigo-200">
                    <img
                      src={item.image ? (item.image.startsWith('http') ? item.image : `${backendUrl}/uploads/${item.image}`) : 'https://placehold.co/80x80?text=No+Image'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mb-2 border shadow"
                    />
                    <p className="font-semibold text-sm mb-1 text-center">{item.name}</p>
                    <span className={`text-xs font-bold px-2 py-1 rounded mb-1 ${item.status === 'delivered' ? 'bg-green-100 text-green-700' : item.status === 'shipped' ? 'bg-blue-100 text-blue-700' : item.status === 'processing' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{item.status}</span>
                    <OrderProgressBar status={item.status} />
                    <p className="text-xs text-gray-500 mb-1">Order ID: {item.orderId?.slice(-6)}</p>
                    <p className="text-xs text-gray-500 mb-1">Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</p>
                    <p className="text-xs text-gray-500 mb-1">Total Paid: {currency}{item.total}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      <button onClick={() => handleReorder(item)} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-semibold hover:bg-indigo-200 transition">🔁 Reorder</button>
                      <button onClick={() => downloadInvoice(item)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold hover:bg-blue-200 transition">📄 View Invoice</button>
                      <Link to="/orders" className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-semibold hover:bg-green-200 transition">📦 Track Order</Link>
                      <button onClick={() => { setShowReturnModal(true); setReturnOrder(item); }} className="bg-pink-100 text-pink-700 px-3 py-1 rounded text-xs font-semibold hover:bg-pink-200 transition">↩️ Return/Exchange</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Address Book */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-green-500 text-2xl">🏠</span> Address Book
              <button onClick={() => setShowAddAddress(true)} className="ml-auto bg-green-500 text-white px-3 py-1 rounded-full text-xs shadow hover:bg-green-600 transition flex items-center gap-1">
                <span className="text-lg">+</span> Add Address
              </button>
            </h3>
            {addresses.length === 0 ? (
              <p className="text-gray-500">No saved addresses yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((addr, idx) => (
                  <div key={idx} className={`bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg p-5 flex flex-col gap-1 border-l-4 ${defaultAddressIdx === idx ? 'border-green-600' : 'border-green-400'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-green-500 text-xl">📍</span>
                      <p className="font-semibold">{addr.firstName} {addr.lastName}</p>
                      {defaultAddressIdx === idx && <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded-full">Default</span>}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300">{addr.street}, {addr.city}, {addr.state}, {addr.country} - {addr.zipCode || addr.zipcode}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Phone: {addr.phone}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleSetDefault(idx)} className={`px-3 py-1 rounded text-xs font-semibold ${defaultAddressIdx === idx ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'} transition`}>Set Default</button>
                      <button onClick={() => handleEditAddress(idx)} className="px-3 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition">Edit</button>
                      <button onClick={() => handleDeleteAddress(idx)} className="px-3 py-1 rounded text-xs font-semibold bg-pink-100 text-pink-700 hover:bg-pink-200 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Add Address Modal */}
          {showAddAddress && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <form ref={addressFormRef} onSubmit={handleAddAddress} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3">
                <h2 className="text-lg font-bold mb-2">Add New Address</h2>
                <div className="grid grid-cols-2 gap-2">
                  <input required className="p-2 rounded border" placeholder="First Name" value={newAddress.firstName} onChange={e => setNewAddress(a => ({ ...a, firstName: e.target.value }))} />
                  <input required className="p-2 rounded border" placeholder="Last Name" value={newAddress.lastName} onChange={e => setNewAddress(a => ({ ...a, lastName: e.target.value }))} />
                  <input required className="col-span-2 p-2 rounded border" placeholder="Street" value={newAddress.street} onChange={e => setNewAddress(a => ({ ...a, street: e.target.value }))} />
                  <input required className="p-2 rounded border" placeholder="City" value={newAddress.city} onChange={e => setNewAddress(a => ({ ...a, city: e.target.value }))} />
                  <input required className="p-2 rounded border" placeholder="State" value={newAddress.state} onChange={e => setNewAddress(a => ({ ...a, state: e.target.value }))} />
                  <input required className="p-2 rounded border" placeholder="Country" value={newAddress.country} onChange={e => setNewAddress(a => ({ ...a, country: e.target.value }))} />
                  <input required className="p-2 rounded border" placeholder="Zip Code" value={newAddress.zipCode} onChange={e => setNewAddress(a => ({ ...a, zipCode: e.target.value }))} />
                  <input required className="p-2 rounded border" placeholder="Phone" value={newAddress.phone} onChange={e => setNewAddress(a => ({ ...a, phone: e.target.value }))} />
                </div>
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
                  <button type="button" onClick={() => setShowAddAddress(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* Wishlist/Recently Viewed */}
          <div className="mb-16">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-pink-500 text-2xl">💖</span> Wishlist / Recently Viewed
            </h3>
            <div className="flex gap-6">
              {wishlist.length === 0 ? (
                <p className="text-gray-500">No items yet.</p>
              ) : (
                wishlist.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/product/${item.productId}`}
                    className="bg-gradient-to-br from-pink-50 via-white to-pink-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg p-4 flex flex-col items-center w-44 transition-transform hover:scale-105 hover:shadow-2xl duration-200 border-b-4 border-pink-200 cursor-pointer group"
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src={item.image ? (item.image.startsWith('http') ? item.image : `${backendUrl}/uploads/${item.image}`) : 'https://placehold.co/80x80?text=No+Image'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded mb-2 border shadow group-hover:opacity-80"
                    />
                    <p className="font-semibold text-sm mb-1 text-center">{item.name}</p>
                    <p className="text-xs text-gray-500 mb-1">{currency}{item.price}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded text-xs font-semibold">View</span>
                      <button
                        onClick={e => { e.preventDefault(); handleRemoveWishlist(item._id); }}
                        className="bg-pink-100 text-pink-700 px-3 py-1 rounded text-xs font-semibold hover:bg-pink-200 transition"
                      >Remove</button>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
          {/* Gift Card Section */}
          <GiftCardSection />
          {/* Notifications Section */}
          <NotificationsSection />
          {/* Account Settings */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-2xl">⚙️</span> Account Settings
            </h3>
            <div className="flex flex-wrap gap-4 bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 shadow-lg">
              <button onClick={() => setShowChangePassword(true)} className="flex items-center gap-2 bg-indigo-100 dark:bg-gray-700 px-4 py-2 rounded shadow text-indigo-700 dark:text-white text-sm hover:bg-indigo-200 dark:hover:bg-gray-600 transition">
                <span className="text-lg">🔒</span> Change Password
              </button>
              <button onClick={() => setShowPaymentMethods(true)} className="flex items-center gap-2 bg-indigo-100 dark:bg-gray-700 px-4 py-2 rounded shadow text-indigo-700 dark:text-white text-sm hover:bg-indigo-200 dark:hover:bg-gray-600 transition">
                <span className="text-lg">💳</span> Manage Payment Methods
              </button>
              <button onClick={() => setShowHelp(true)} className="flex items-center gap-2 bg-indigo-100 dark:bg-gray-700 px-4 py-2 rounded shadow text-indigo-700 dark:text-white text-sm hover:bg-indigo-200 dark:hover:bg-gray-600 transition">
                <span className="text-lg">🛟</span> Help & Support
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-indigo-100 dark:bg-gray-700 px-4 py-2 rounded shadow text-indigo-700 dark:text-white text-sm hover:bg-indigo-200 dark:hover:bg-gray-600 transition">
                <span className="text-lg">🚪</span> Logout
              </button>
            </div>
          </div>
          {/* Change Password Modal */}
          {showChangePassword && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <form className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3">
                <h2 className="text-lg font-bold mb-2">Change Password</h2>
                <input type="password" className="p-2 rounded border" placeholder="Current Password" required />
                <input type="password" className="p-2 rounded border" placeholder="New Password" required />
                <input type="password" className="p-2 rounded border" placeholder="Confirm New Password" required />
                <div className="flex gap-2 mt-4">
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Save</button>
                  <button type="button" onClick={() => setShowChangePassword(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
                </div>
              </form>
            </div>
          )}
          {/* Payment Methods Modal */}
          {showPaymentMethods && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3">
                <h2 className="text-lg font-bold mb-2">Manage Payment Methods</h2>
                <p className="text-gray-500">(This is a placeholder. Integrate your payment method management here.)</p>
                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={() => setShowPaymentMethods(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                </div>
              </div>
            </div>
          )}
          {/* Help & Support Modal */}
          {showHelp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3">
                <h2 className="text-lg font-bold mb-2">Help & Support</h2>
                <p className="text-gray-500">For help, contact us at <a href="mailto:support@fancygarments.com" className="text-indigo-600 underline">support@fancygarments.com</a> or call +91 8318407559.</p>
                <div className="flex gap-2 mt-4">
                  <button type="button" onClick={() => setShowHelp(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Close</button>
                </div>
              </div>
            </div>
          )}
          {/* Support Tickets Section */}
          <SupportTicketsSection />
        </div>
      </div>
      {/* Return/Exchange Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={handleReturnSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-3">
            <h2 className="text-lg font-bold mb-2">Return / Exchange Request</h2>
            <p className="text-sm mb-2">Order ID: {returnOrder?.orderId?.slice(-6)}</p>
            <textarea
              className="p-2 rounded border min-h-[60px]"
              placeholder="Reason for return or exchange"
              value={returnReason}
              onChange={e => setReturnReason(e.target.value)}
              required
            />
            {returnSuccess && <div className="text-green-600 text-sm">{returnSuccess}</div>}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">Submit</button>
              <button type="button" onClick={() => setShowReturnModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default UserProfile;
