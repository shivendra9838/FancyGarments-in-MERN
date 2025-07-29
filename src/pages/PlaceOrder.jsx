
import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CheckCircle } from 'lucide-react';


const PlaceOrder = () => {
  const { cartItems, getCartAmount, delivery_fee, products, token, backendUrl, clearCart } = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();
  

  const totalAmount = getCartAmount() + delivery_fee;

  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: '',
  });

  const validateForm = () => {
    const { firstName, lastName, street, city, state, zipCode, country, phone } = address;
    if (!firstName || !lastName || !street || !city || !state || !zipCode || !country || !phone) {
      toast.error('Please fill all required fields.');
      return false;
    }
    if (!/^[0-9]{10,}$/.test(phone)) {
      toast.error('Phone number must be at least 10 digits.');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!token || token === 'undefined') {
      toast.error('Session expired. Please login again.');
      navigate('/login');
      return;
    }

    if (!validateForm()) return;

    const items = [];
    for (const id in cartItems) {
      const prod = products.find((p) => p._id === id);
      if (!prod) continue;
      for (const size in cartItems[id]) {
        items.push({
          _id: id,
          name: prod.name,
          price: prod.price,
          size,
          quantity: cartItems[id][size],
          image: prod.images?.[0] || '', // Add product image
        });
      }
    }

    if (!items.length) return toast.error('Your cart is empty.');

    const payload = { cartItems: items, address, paymentMethod: method, amount: totalAmount };

    try {
      if (method === 'stripe') {
        const { data } = await axios.post(`${backendUrl}/api/order/stripe`, payload, { headers: { token } });
        if (data.success) {
          window.location.replace(data.session_url);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/order/place`, payload, { headers: { token } });
        if (data.success) {
          setOrderId(data.orderId);
          setOrderPlaced(true);
          clearCart();
          toast.success('Order placed successfully!');
        } else {
          toast.error(data.message);
        }
      }
    } catch (err) {
      console.error('Order Error:', err);
      toast.error('Failed to place order.');
    }
  };

  useEffect(() => {
    if (orderPlaced && orderId) {
      navigate(`/verify?method=${method}&orderId=${orderId}`);
    }
  }, [orderPlaced, orderId, method, navigate]);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {orderPlaced ? (
        <div className="text-center py-16">
          <Confetti />
          <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-2">Thank you for shopping with us!</h2>
          <p className="text-gray-600">Redirecting to order verification...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <Title text1="Checkout" text2="Details" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            {/* Delivery Information Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input type="text" placeholder="First Name" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" placeholder="Last Name" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 col-span-1 sm:col-span-2" />
                <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" placeholder="Zip Code" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 col-span-1 sm:col-span-2" />
              </div>
            </div>

            {/* Order Summary & Payment */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <CartTotal />
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <input type="radio" name="payment" checked={method === 'cod'} onChange={() => setMethod('cod')} className="form-radio text-pink-500 focus:ring-pink-500" />
                    <img src="https://cdn-icons-png.flaticon.com/512/929/929416.png" alt="COD" className="w-8 h-8" />
                    <span className='font-semibold'>Cash on Delivery</span>
                  </label>

                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-pointer hover:border-pink-500 transition-colors">
                    <input type="radio" name="payment" checked={method === 'stripe'} onChange={() => setMethod('stripe')} className="form-radio text-pink-500 focus:ring-pink-500" />
                    <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="Stripe" className="w-8 h-8" />
                    <span className='font-semibold'>Stripe</span>
                  </label>

                  <label className="flex items-center gap-4 p-4 border rounded-lg cursor-not-allowed bg-gray-100 text-gray-400">
                    <input type="radio" name="payment" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} disabled className="form-radio" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Razorpay_logo.svg" alt="Razorpay" className="w-8 h-8" />
                    <span>Razorpay (Coming Soon)</span>
                  </label>
                </div>
              </div>

              <button onClick={handlePlaceOrder} className="bg-pink-500 text-white w-full py-3 rounded-lg mt-8 font-bold text-lg hover:bg-pink-600 transition-colors shadow-lg">
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
