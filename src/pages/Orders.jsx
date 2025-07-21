

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import html2pdf from 'html2pdf.js';
import { Dialog } from '@headlessui/react';
import { FaBox, FaTruck, FaCheckCircle, FaFileInvoice, FaEnvelope, FaSearchLocation } from 'react-icons/fa';

const Orders = () => {
  const { token, backendUrl, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState(null);

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
          const allOrdersItem = [];
          response.data.orders.forEach((order) => {
            order.items.forEach((item) => {
              allOrdersItem.push({
                ...item,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id,
                total: order.amount,
              });
            });
          });
          setOrders(allOrdersItem.reverse());
        } else {
          toast.error('Failed to load orders');
        }
      } catch (error) {
        console.error('Failed to load orders:', error);
        toast.error('Could not fetch orders');
      }
    };

    loadOrderData();
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'shipped': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-600';
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
            className={`w-4 h-4 rounded-full transition-colors duration-300 ${
              idx <= currentIndex ? 'bg-green-500' : 'bg-gray-300'
            }`}
          ></div>
          {idx < 2 && (
            <div
              className={`w-10 h-1 transition-colors duration-300 ${
                idx < currentIndex ? 'bg-green-500' : 'bg-gray-300'
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
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <Title title="My Orders" />
      <h2 className="text-2xl font-bold mb-4 text-center">My Orders</h2>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <img src="https://cdn.dribbble.com/users/2046015/screenshots/6012385/no_orders.png" alt="No Orders" className="w-48 h-48 mb-6 opacity-80" />
          <p className="text-lg text-gray-500 font-semibold">You have no orders yet.</p>
        </div>
      ) : (
        <ul className="space-y-8">
          {orders.map((order, index) => {
            const date = order.date ? new Date(order.date).toLocaleDateString() : 'Invalid Date';
            const imageUrl = order.image?.startsWith('http')
              ? order.image
              : `${backendUrl}/uploads/${order.image}`;
            const statusClass = statusColors[order.status?.toLowerCase()] || statusColors.default;
            const badgeClass = statusBadgeColors[order.status?.toLowerCase()] || statusBadgeColors.default;
            const paymentClass = paymentBadgeColors[String(order.payment)] || paymentBadgeColors.false;
            const methodClass = methodBadgeColors[order.paymentMethod] || methodBadgeColors.default;
            return (
              <li key={index} className={`relative border-l-8 ${statusClass} rounded-xl shadow-lg flex flex-col md:flex-row items-start gap-6 p-6 transition-transform hover:scale-[1.01]`}> 
                <img
                  src={
                    order.image
                      ? (order.image.startsWith('http')
                          ? order.image
                          : `${backendUrl}/uploads/${order.image}`)
                      : 'https://placehold.co/112x112?text=No+Image'
                  }
                  alt={order.name}
                  className="w-28 h-28 object-cover rounded-lg shadow-md border-2 border-white bg-white"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/112x112?text=No+Image';
                  }}
                />
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass}`}>{order.status}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentClass}`}>{order.payment ? 'Paid' : 'Unpaid'}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${methodClass}`}>{order.paymentMethod}</span>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-1 mb-2">
                    <p className="font-bold text-lg text-gray-800">{order.name}</p>
                    <p className="text-gray-500 text-sm">Order ID: <span className="font-mono">{order.orderId}</span></p>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-2 text-sm">
                    <span><strong>Qty:</strong> {order.quantity}</span>
                    <span><strong>Size:</strong> {order.size || 'N/A'}</span>
                    <span><strong>Total:</strong> <span className="font-bold">{currency}{order.total}</span></span>
                    <span><strong>Date:</strong> {date}</span>
                  </div>
                  {renderProgressBar(order.status)}
                  <div className="flex gap-3 mt-6 flex-wrap">
                    <button
                      onClick={() => {
                        setTrackingOrder(order);
                        setIsTrackingOpen(true);
                      }}
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all font-semibold text-sm"
                    >
                      <FaSearchLocation /> Track Order
                    </button>
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
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border-t-8 border-blue-400">
            <Dialog.Title className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2"><FaSearchLocation /> Tracking Details</Dialog.Title>
            {trackingOrder && (
              <div>
                <p className="mb-2"><strong>Product:</strong> {trackingOrder.name}</p>
                <p className="mb-2"><strong>Status:</strong> <span className="capitalize">{trackingOrder.status}</span></p>
                {renderProgressBar(trackingOrder.status)}
              </div>
            )}
            <button
              className="mt-6 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow font-semibold"
              onClick={() => setIsTrackingOpen(false)}
            >
              Close
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default Orders;