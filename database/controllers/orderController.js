import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import transporter from '../config/nodemailer.js';
import { generateOrderConfirmationEmail, generateStatusUpdateEmail, generateOrderCancellationEmail } from '../utils/orderEmailTemplate.js';

// Global variables
const currency = 'inr';
const deliveryCharge = 60;

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET || process.env.STRIPE_API_KEY;
if (!stripeSecretKey) {
  throw new Error("Stripe secret key not found. Please set STRIPE_SECRET_KEY in your .env file under the 'database' directory.");
}
const stripe = new Stripe(stripeSecretKey);

// Helper: send order confirmation email
async function sendOrderConfirmationEmail(userId, order) {
  const user = await userModel.findById(userId);
  if (!user?.email) return;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const estDelivery = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const html = generateOrderConfirmationEmail({
    customerName: user.name || 'Customer',
    orderId: order._id.toString(),
    items: (order.items || []).map(i => ({
      name: i.name || 'Product',
      image: i.image || '',
      size: i.size || 'N/A',
      quantity: i.quantity || 1,
      price: i.price || 0,
    })),
    totalAmount: order.amount,
    paymentMethod: order.paymentMethod || 'COD',
    address: order.address,
    estimatedDelivery: estDelivery,
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: user.email,
    subject: `Order Confirmed! 🎉 — Fancy Garments #${order._id.toString().slice(-6).toUpperCase()}`,
    html,
  });

  // Mark email sent
  await orderModel.findByIdAndUpdate(order._id, { emailSent: true, estimatedDelivery: estDelivery });
  console.log(`📧 Order confirmation email sent to ${user.email}`);
}


// ✅ COD order
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, address, paymentMethod } = req.body;

    if (!userId || !cartItems?.length || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required order information." });
    }

    const amount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + deliveryCharge;

    const orderData = {
      userId,
      items: cartItems,
      address,
      amount,
      paymentMethod,
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // Clear user's cart in DB
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Send confirmation email
    try { await sendOrderConfirmationEmail(userId, newOrder); } catch (e) { console.error('Email send failed:', e.message); }

    return res.status(200).json({
      success: true,
      message: "Order placed successfully.",
      orderId: newOrder._id
    });
  } catch (error) {
    console.error("Order placement error:", error);
    return res.status(500).json({ success: false, message: "Server error placing order." });
  }
};


// ✅ Stripe
const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, address } = req.body;
    const { origin } = req.headers;

    if (!userId || !cartItems?.length || !address) {
      return res.status(400).json({ success: false, message: "Missing required data for Stripe order." });
    }

    const amount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + deliveryCharge;

    const orderData = {
      userId,
      items: cartItems,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = cartItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.name || "Product" },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: Math.round(deliveryCharge * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Stripe error:", error);
    return res.status(500).json({ success: false, message: "Stripe session creation failed." });
  }
};

// ✅ Pay Existing Order with Stripe
const payExistingStripe = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.body;
    const { origin } = req.headers;

    if (!userId || !orderId) {
      return res.status(400).json({ success: false, message: "Missing required data." });
    }

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    const line_items = order.items
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        price_data: {
          currency,
          product_data: { name: item.name || "Product" },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

    // Re-calculate the delivery charge based on the order's existing amount
    const itemsTotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const existingDeliveryCharge = order.amount - itemsTotal;

    if (existingDeliveryCharge > 0) {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Delivery Charges" },
          unit_amount: Math.round(existingDeliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${order._id}`,
      line_items,
      mode: "payment",
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Stripe existing pay error:", error);
    return res.status(500).json({ success: false, message: "Stripe session creation failed." });
  }
};

// VerifyStripe 
const verifyStripe = async (req, res) => {
  const { success, orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId." });
  }

  try {
    if (success === "true") {
      const order = await orderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        delivery_status: "processing",
        paymentMethod: "Stripe",
      });

      await userModel.findByIdAndUpdate(order.userId, { cartData: {} });

      // Send confirmation email
      try { await sendOrderConfirmationEmail(order.userId, order); } catch (e) { console.error('Email send failed:', e.message); }

      const updatedOrder = await orderModel.findById(orderId); // Fetch updated order
      return res.json({
        success: true,
        message: "Payment verified and order updated.",
        amount: updatedOrder.amount,
      });

    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed. Order deleted." });
    }
  } catch (error) {
    console.error("Stripe verification error:", error);
    return res.status(500).json({ success: false, message: "Verification failed due to server error." });
  }
};



// Razorpay method (left as placeholder)
const placeOrderRazorpay = async (req, res) => {
  return res.status(501).json({ success: false, message: "Razorpay integration not implemented yet." });
};

const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Fetching all orders failed." });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel.find({ userId });
    return res.json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Fetching user orders failed." });
  }
};

const updateStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    order.trackingUpdates.push({ status, date: new Date(), note: `Order ${status}` });
    await order.save();

    // Send status update email
    try {
      const user = await userModel.findById(order.userId);
      if (user?.email) {
        const html = generateStatusUpdateEmail({
          customerName: user.name || 'Customer',
          orderId: order._id.toString(),
          newStatus: status,
          frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
        });
        await transporter.sendMail({
          from: process.env.MAIL_FROM,
          to: user.email,
          subject: `Order ${status} — Fancy Garments #${order._id.toString().slice(-6).toUpperCase()}`,
          html,
        });
      }
    } catch (e) { console.error('Status email failed:', e.message); }

    return res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating status" });
  }
};

// Admin: Delete order by ID
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ success: false, message: 'Order ID required' });
    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order', error: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    if (!orderId || !reason) {
      return res.status(400).json({ success: false, message: 'Order ID and reason are required' });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    // Set refund status based on payment
    const refundStatus = order.payment ? 'Pending' : 'Not Applicable';

    order.status = 'Cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    order.refundStatus = refundStatus;
    
    // Add tracking update
    order.trackingUpdates.push({ status: 'Cancelled', date: new Date(), note: `Order Cancelled: ${reason}` });
    
    await order.save();

    // Send cancellation email
    try {
      const user = await userModel.findById(order.userId);
      if (user?.email) {
        const html = generateOrderCancellationEmail({
          customerName: user.name || 'Customer',
          orderId: order._id,
          items: order.items,
          paymentMethod: order.paymentMethod,
          refundStatus: refundStatus,
          frontendUrl: req.headers.origin || process.env.FRONTEND_URL
        });
        
        await transporter.sendMail({
          from: `"Fancy Garments" <${process.env.MAIL_FROM}>`,
          to: user.email,
          subject: `Order Cancelled - Fancy Garments (#${order._id.toString().slice(-6)})`,
          html
        });

        // Send admin notification
        await transporter.sendMail({
          from: `"Fancy Garments System" <${process.env.MAIL_FROM}>`,
          to: process.env.MAIL_FROM, // Admin receives it at the store's email
          subject: `🚨 Order Cancelled: #${order._id.toString().slice(-6)}`,
          html: `<p>Order <b>#${order._id}</b> was cancelled by the customer.</p>
                 <p>Reason: ${reason}</p>
                 <p>Refund Status: ${refundStatus}</p>`
        });
      }
    } catch (emailError) {
      console.error("Cancellation email failed:", emailError.message);
    }

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel order', error: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  payExistingStripe,
  allOrders,
  userOrders,
  updateStatus,
verifyStripe,
  deleteOrder,
  cancelOrder,
};