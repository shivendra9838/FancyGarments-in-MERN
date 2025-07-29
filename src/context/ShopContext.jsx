import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);
  const [wishlist, setWishlist] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    return stored ? JSON.parse(stored) : [];
  });
  const [giftCard, setGiftCard] = useState({ code: '', discount: 0 });

  // Apply Gift Card
  const applyGiftCard = (code) => {
    const totalItems = getCartCount();
    if (totalItems <= 3) {
      toast.error('Gift card is only applicable for more than 3 items.');
      return;
    }

    if (!userData) {
      toast.error('You must be logged in to apply a gift card.');
      return;
    }

    // Predefined gift card codes
    const giftCardCodes = {
      'WELCOME200': { discount: 20, message: 'Welcome gift card applied!' },
      'FIRST10': { discount: 10, message: 'First purchase discount applied!' },
      'FREEDOM30': { discount: 30, message: 'Independence Day special discount applied!' },
      'SAVE15': { discount: 15, message: 'Save 15% discount applied!' },
      'HOLIDAY25': { discount: 25, message: 'Holiday special discount applied!' }
    };

    const upperCode = code.toUpperCase().trim();
    
    if (giftCardCodes[upperCode]) {
      const { discount, message } = giftCardCodes[upperCode];
      setGiftCard({ code: upperCode, discount });
      toast.success(message);
    } else {
      // For other codes, use the existing logic
      const isNewUser = new Date(userData.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const discount = isNewUser ? 20 : 10;
      setGiftCard({ code: upperCode, discount });
      toast.success(`Applied ${discount}% discount!`);
    }
  };

  // Remove Gift Card
  const removeGiftCard = () => {
    setGiftCard({ code: '', discount: 0 });
    toast.info('Gift card removed.');
  };

  // Add to Wishlist
  const addToWishlist = async (item) => {
    const newItem = {
      productId: item._id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${backendUrl}/${item.images[0].replace(/^\/+/, '')}`) : '/placeholder.jpg'
    };
    
    // Update state and localStorage
    setWishlist(prev => {
      const exists = prev.find(i => i.productId === newItem.productId);
      if (exists) {
        toast.info('Already in your wishlist!');
        return prev;
      }
      const updated = [...prev, newItem];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      toast.success('Added to your wishlist!');
      return updated;
    });

    // Backend sync
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/add`,
          newItem,
          { headers: { token } }
        );
      } catch (err) {
        // Handle error silently or with a toast
        console.error("Failed to sync wishlist with backend", err);
      }
    }
  };

  // Remove from Wishlist
  const removeFromWishlist = async (productId) => {
    // Update state and localStorage
    setWishlist(prev => {
      const updated = prev.filter(item => item.productId !== productId);
      localStorage.setItem('wishlist', JSON.stringify(updated));
      toast.success('Removed from wishlist!');
      return updated;
    });

    // Backend sync
    if (token) {
      try {
        await axios.post(
          `${backendUrl}/api/wishlist/remove`,
          { productId },
          { headers: { token } }
        );
      } catch (err) {
        console.error("Failed to sync wishlist removal with backend", err);
      }
    }
  };


  // Fetch user profile
  const getUserProfile = async (token) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/user/profile`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch user profile");
    }
  };

  // Fetch products on mount
  useEffect(() => {
    const getProductsData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/list`);
        if (response.data.success) {
          setProducts(response.data.products);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch product list");
      }
    };
    getProductsData();
  }, []);

  // Fetch cart and profile when token changes
  useEffect(() => {
    if (token && token.trim() !== "undefined") {
      const fetchCart = async () => {
        try {
          const res = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
          if (res.data.success) {
            setCartItems(res.data.cartData);
          }
        } catch (err) {
          if (err.response?.status === 403) {
            console.warn("Token expired, logging out.");
            toast.error("Session expired. Please log in again.");
            localStorage.removeItem("token");
            setToken("");
          } else {
            toast.error("Failed to fetch cart data");
          }
        }
      };
      fetchCart();
      getUserProfile(token);
    }
  }, [token]);

  // Add to Cart
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Get Cart Count
  const getCartCount = () => {
    let totalCount = 0;
    for (const i in cartItems) {
      for (const j in cartItems[i]) {
        totalCount += cartItems[i][j];
      }
    }
    return totalCount;
  };

  // Update Quantity
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);
    if (token) {
      try {
        await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Get Total Cart Amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      const itemInfo = products.find((i) => i._id === item);
      if (!itemInfo) continue;
      for (const size in cartItems[item]) {
        const quantity = cartItems[item][size];
        if (quantity > 0) {
          totalAmount += itemInfo.price * quantity;
        }
      }
    }
    return totalAmount;
  };

  // Clear Cart
  const clearCart = async () => {
    setCartItems({});
  };

  const contextValue = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    backendUrl,
    setToken,
    token,
    clearCart,
    userData,
    getUserProfile,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    giftCard,
    applyGiftCard,
    removeGiftCard
  };

  return <ShopContext.Provider value={contextValue}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
