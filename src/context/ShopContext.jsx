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

  const value = {
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
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;
