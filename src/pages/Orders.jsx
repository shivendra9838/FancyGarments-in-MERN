
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { assets } from "../assets/assets";
import { toast } from 'react-toastify';
import Title from '../components/Title';
import html2pdf from 'html2pdf.js';
import { Dialog } from '@headlessui/react';
import { FaBox, FaTruck, FaCheckCircle, FaFileInvoice, FaEnvelope, FaSearchLocation } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CancellationModal from '../components/CancellationModal';

const Orders = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);


  useEffect(() => {
    const loadOrderData = async () => {
      if (!token) return;
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          const processedOrders = response.data.orders.map(order => ({
            ...order,
            orderId: order._id,
            total: order.amount,
            items: order.items || []
          })).reverse();
          setOrders(processedOrders);
        } else {
          toast.error('Failed to load orders');
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Could not fetch orders');
      }
    };

    loadOrderData();
  }, [token, backendUrl]);


  const handlePayment = async (order) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/order/stripe`,
        { cartItems: order.items, address: order.address },
        { headers: { token } }
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Payment processing failed.');
    }
  };

  const handleCancelOrder = async (orderId, reason) => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/order/cancel`, { orderId, reason }, { headers: { token } });
      if (data.success) {
        toast.success('Order cancelled successfully.');
        setOrders(prevOrders => prevOrders.map(o => o.orderId === orderId ? { ...o, status: 'Cancelled' } : o));
        setIsCancelModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error('Failed to cancel order.');
    }
  };

  const openCancelModal = (order) => {
    setSelectedOrder(order);
    setIsCancelModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'border-yellow-400 bg-yellow-50';
      case 'shipped': return 'border-blue-400 bg-blue-50';
      case 'delivered': return 'border-green-400 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const renderProgress = (status) => {
    const normalizedStatus = status.toLowerCase();

    let currentIndex = 0;

    switch (normalizedStatus) {
      case 'pending':
      case 'shipped':
        currentIndex = 0;
        break;
      case 'out for delivery':
        currentIndex = 1;
        break;
      case 'delivered':
        currentIndex = 2;
        break;
      default:
        currentIndex = 0;
    }

    return (
      <div className="flex items-center justify-center gap-4 mt-4">
        {[0, 1, 2].map((idx) => (
          <div key={idx} className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full transition-colors duration-300 ${idx <= currentIndex ? 'bg-green-500' : 'bg-gray-300'
                }`}
            ></div>
            {idx < 2 && (
              <div
                className={`w-10 h-1 transition-colors duration-300 ${idx < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                  }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    );
  };


  const downloadInvoice = (order) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: sans-serif; padding: 20px;">
        <h1 style="text-align:center; color: #4A90E2;">Invoice</h1>
        <p><strong>Order ID:</strong> ${order.orderId}</p>
        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Payment:</strong> ${order.payment}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr />
        <h3>Items</h3>
        <ul>
          <li><strong>Product:</strong> ${order.name}</li>
          <li><strong>Size:</strong> ${order.size || 'N/A'}</li>
          <li><strong>Quantity:</strong> ${order.quantity}</li>
          <li><strong>Total:</strong> ${currency}${order.total}</li>
        </ul>
      </div>
    `;
    html2pdf().from(element).save(`Invoice-${order.orderId}.pdf`);
  };

  const sendInvoiceEmail = async (order) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/send-invoice`,
        { orderId: order.orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Invoice emailed successfully.');
      } else {
        toast.error('Failed to email invoice.');
      }
    } catch (error) {
      console.error('Email error:', error);
      toast.error('Invoice email failed.');
    }
  };

  const statusColors = {
    pending: 'border-yellow-400 bg-yellow-50',
    shipped: 'border-blue-400 bg-blue-50',
    delivered: 'border-green-400 bg-green-50',
    default: 'border-gray-300 bg-gray-50',
  };

  const statusBadgeColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    shipped: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const paymentBadgeColors = {
    true: 'bg-green-100 text-green-800',
    false: 'bg-red-100 text-red-800',
  };

  const methodBadgeColors = {
    Stripe: 'bg-blue-100 text-blue-800',
    'Cash on Delivery': 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800',
  };

  const progressSteps = [
    { label: 'Placed', icon: <FaBox /> },
    { label: 'Shipped', icon: <FaTruck /> },
    { label: 'Delivered', icon: <FaCheckCircle /> },
  ];

  function getProgressIndex(status) {
    switch ((status || '').toLowerCase()) {
      case 'pending': return 0;
      case 'shipped': return 1;
      case 'out for delivery': return 2;
      case 'delivered': return 2;
      default: return 0;
    }
  }

  function renderProgressBar(status) {
    const idx = getProgressIndex(status);
    return (
      <div className="flex items-center justify-between w-full max-w-xs mx-auto mt-4">
        {progressSteps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg shadow-md transition-colors duration-300 ${i <= idx ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>{step.icon}</div>
              <span className={`mt-1 text-xs font-semibold ${i <= idx ? 'text-green-700' : 'text-gray-400'}`}>{step.label}</span>
            </div>
            {i < progressSteps.length - 1 && (
              <div className={`flex-1 h-1 mx-1 rounded transition-colors duration-300 ${i < idx ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <Title text1="My" text2="Orders" />
      {orders.length === 0 ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <img
            src={assets.order}
            alt="No Orders"
            className="w-full max-w-[350px] md:max-w-[400px] h-auto mb-6 opacity-90 object-contain"
          />
          <p className="text-xl md:text-2xl text-gray-600 font-semibold">
            You have no orders yet.
          </p>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            Looks like you haven't placed any orders with us.
          </p>
        </div>

      ) : (
        <div className="space-y-8">
          {orders.map((order, index) => {
            const date = order.date ? new Date(order.date).toLocaleDateString() : 'Invalid Date';
            const statusClass = statusColors[order.status?.toLowerCase()] || statusColors.default;

            return (
              <div key={index} className={`bg-white rounded-2xl shadow-lg border-l-8 ${statusClass} p-6 transition-transform`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
                  <div>
                    <p className="font-bold text-lg">Order ID: <span className="font-mono text-gray-600">{order.orderId}</span></p>
                    <p className="text-sm text-gray-500">Date: {date}</p>
                  </div>
                  <div className="text-right mt-4 sm:mt-0">
                    <p className="font-bold text-xl">{currency}{order.total.toFixed(2)}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentBadgeColors[String(order.payment)] || paymentBadgeColors.false}`}>{order.payment ? 'Paid' : 'Unpaid'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.items.map((item, itemIndex) => {
                    const imageUrl = item.image?.startsWith('http')
                      ? item.image
                      : `${backendUrl}/uploads/${item.image}`;
                    return (
                      <Link to={`/product/${item._id}`} key={itemIndex} className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <img
                          src={imageUrl}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg border"
                          onError={(e) => { e.target.src = 'https://placehold.co/80x80?text=No+Image'; }}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{item.name}</p>
                          <div className="flex gap-4 text-sm text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span>Size: {item.size || 'N/A'}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t">
                  {order.payment ? (
                    <div>
                      <h3 className="font-bold text-center mb-2">Delivery Status</h3>
                      {renderProgressBar(order.status)}
                      <p className='text-center text-sm text-gray-500 mt-2'>Your order will be delivered soon.</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <h3 className="font-bold text-lg mb-2 text-red-600">Payment Required</h3>
                      <p className="text-sm text-gray-600 mb-4">Complete your payment using Stripe. No extra charges apply.</p>
                      <button
                        onClick={() => handlePayment(order)}
                        className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                      >
                        Make Payment
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6 flex-wrap justify-center border-t pt-4">
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all font-semibold text-sm"
                  >
                    <FaFileInvoice /> Download Invoice
                  </button>
                  <button
                    onClick={() => sendInvoiceEmail(order)}
                    className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow transition-all font-semibold text-sm"
                  >
                    <FaEnvelope /> Email Invoice
                  </button>
                  {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <button
                      onClick={() => openCancelModal(order)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow transition-all font-semibold text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <CancellationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelOrder}
        orderId={selectedOrder?.orderId}
      />
    </div>
  );
};

export default Orders;