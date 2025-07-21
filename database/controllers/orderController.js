// import { currency } from "../../admin/src/App.jsx";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// Global variables
const currency = 'inr';
const deliveryCharge = 10;

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


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

    // **Return orderId so front end can redirect**
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

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: { name: "Delivery Charges" },
        unit_amount: deliveryCharge * 100,
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

// VerifyStripe 
const verifyStripe = async (req, res) => {
  const userId = req.userId;
  const { success, orderId } = req.body;

  if (!userId || !orderId) {
    return res.status(400).json({ success: false, message: "Missing userId or orderId." });
  }

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        delivery_status: "processing",
        paymentMethod: "Stripe",
      });

      await userModel.findByIdAndUpdate(userId, { cartData: {} });

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
    await order.save();
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

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
verifyStripe,
  deleteOrder,
};