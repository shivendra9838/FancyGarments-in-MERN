
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
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      {orderPlaced ? (
        <div className="text-center py-16">
          <Confetti />
          <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-semibold mb-2">Thank you for shopping with us!</h2>
          <p className="text-gray-600">Redirecting to order verification...</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
          <Title text="Delivery Information" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Address Form */}
            <div className="space-y-4">
              <input type="text" placeholder="First Name" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Last Name" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Zip Code" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="text" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="w-full p-2 border rounded-md" />
              <input type="tel" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full p-2 border rounded-md" />
            </div>

            {/* Summary & Payment */}
            <div>
              <CartTotal />
              <div className="mt-6">
                <h3 className="font-medium mb-2">Select Payment Method:</h3>

                <label className="flex items-center gap-2 mb-2">
                  <input type="radio" name="payment" checked={method === 'cod'} onChange={() => setMethod('cod')} />
                  <img src="https://cdn-icons-png.flaticon.com/512/929/929416.png" alt="COD" className="w-6 h-6" />
                  Cash on Delivery
                </label>

                <label className="flex items-center gap-2 mb-2">
                  <input type="radio" name="payment" checked={method === 'stripe'} onChange={() => setMethod('stripe')} />
                  <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" alt="Stripe" className="w-6 h-6" />
                  Stripe
                </label>

                <label className="flex items-center gap-2 mb-2">
                  <input type="radio" name="payment" checked={method === 'razorpay'} onChange={() => setMethod('razorpay')} disabled />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/72/Razorpay_logo.svg" alt="Razorpay" className="w-6 h-6" />
                  Razorpay (Coming Soon)
                </label>
              </div>

              <button onClick={handlePlaceOrder} className="bg-green-600 text-white w-full py-2 rounded mt-6 hover:bg-green-700 transition">
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
