import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { parcel_icon } from '../assets/assets';
import html2pdf from 'html2pdf.js';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/product/list');
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      // handle error
    }
  };

  const getProductImage = (item) => {
    const product = products.find(
      (p) => p._id === item._id || p._id === item.productId
    );
    if (product && product.images && product.images.length > 0) {
      return product.images[0];
    }
    return "https://via.placeholder.com/48x48?text=No+Img";
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Status updated!");
        fetchAllOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await axios.post(
        backendUrl + '/api/order/delete',
        { orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success('Order deleted successfully');
        fetchAllOrders();
      } else {
        toast.error(res.data.message || 'Failed to delete order');
      }
    } catch (err) {
      toast.error('Failed to delete order');
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);

  const downloadInvoice = (order) => {
    const TAX_RATE = 0.18;
    const SHIPPING = 50;
    const baseAmount = order.amount - SHIPPING;
    const taxAmount = (baseAmount * TAX_RATE).toFixed(2);
    const finalAmount = order.amount.toFixed(2);

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.size || '-'}</td>
        </tr>`
      )
      .join('');

    const content = `
      <div style="padding: 30px; font-family: Arial;">
        <h1 style="text-align:center; color:#4A90E2;">Fancy Garments</h1>
        <h2 style="text-align:center; margin-bottom: 20px;">Invoice</h2>

        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Date:</strong> ${formatDate(order.date)}</p>
        <p><strong>Status:</strong> ${order.status}</p>

        <h3>Customer Details:</h3>
        <p>${order.address.firstName} ${order.address.lastName}</p>
        <p>${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.zipcode}</p>
        <p><strong>Phone:</strong> ${order.address.phone}</p>

        <h3 style="margin-top: 20px;">Items Ordered:</h3>
        <table border="1" cellspacing="0" cellpadding="8" width="100%">
          <thead>
            <tr>
              <th>Name</th><th>Quantity</th><th>Size</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>

        <h3 style="margin-top: 20px;">Payment Details:</h3>
        <p><strong>Base Amount:</strong> ₹${baseAmount.toFixed(2)}</p>
        <p><strong>Tax (18%):</strong> ₹${taxAmount}</p>
        <p><strong>Shipping Fee:</strong> ₹${SHIPPING}</p>
        <p><strong>Total Paid:</strong> ₹${finalAmount}</p>
        <p><strong>Payment:</strong> ${order.payment ? '✅ Paid' : '❌ Pending'}</p>
        <p><strong>Method:</strong> ${order.paymentMethod}</p>

        <p style="text-align:center; margin-top:30px;">🛍️ Thank you for shopping with <strong>Fancy Garments</strong>!</p>
      </div>
    `;

    const opt = {
      margin: 0.5,
      filename: `invoice-${order._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(content).save();
  };

  useEffect(() => {
    fetchAllOrders();
    fetchAllProducts();
  }, [token]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold mb-8 text-center">All Orders</h2>

      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-start gap-6 bg-white shadow-lg p-6 rounded-lg"
          >
            <img src={parcel_icon} alt="parcel" className="w-16 h-16" />

            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 text-sm w-full">
              <div className="space-y-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <img
                      src={getProductImage(item)}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded border"
                      onError={e => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/48x48?text=No+Img"; }}
                    />
                    <span className="font-medium">{item.name}</span> x {item.quantity}{' '}
                    <span className="text-gray-500 text-xs">({item.size || '-'})</span>
                  </div>
                ))}
                <div className="mt-2 font-medium text-gray-700">
                  <p>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.street}</p>
                  <p>
                    {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                  </p>
                  <p>{order.address.phone}</p>
                </div>
                <button
                  className="mt-3 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
                  onClick={() => handleDeleteOrder(order._id)}
                >Delete Order</button>
              </div>

              <div className="space-y-1">
                <p><strong>Items:</strong> {order.items.length}</p>
                <p><strong>Method:</strong> {order.paymentMethod}</p>
                <p><strong>Payment:</strong> {order.payment ? '✅ Done' : '❌ Pending'}</p>
                <p><strong>Date:</strong> {formatDate(order.date)}</p>
              </div>

              <div className="flex flex-col items-start md:items-end justify-between gap-2">
                <p className="text-lg font-semibold text-green-700">{formatCurrency(order.amount)}</p>
                <select
                  className="border px-3 py-1 rounded-md shadow-sm bg-gray-50"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
                <button
                  onClick={() => downloadInvoice(order)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Download Invoice
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
