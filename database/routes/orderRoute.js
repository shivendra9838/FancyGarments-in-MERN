import express from 'express';
import{placeOrder,placeOrderStripe, placeOrderRazorpay , allOrders, userOrders, updateStatus, verifyStripe, deleteOrder, cancelOrder } from '../controllers/orderController.js';
import adminAuth from '../middleware/adminAuth.js';
import authUser  from '../middleware/auth.js';

const orderRouter = express.Router();

// Admin features
orderRouter.post('/list',adminAuth,allOrders);
orderRouter.post('/status',adminAuth,updateStatus);
orderRouter.post('/delete',adminAuth,deleteOrder);

// Payment features
orderRouter.post('/place',authUser,placeOrder);
orderRouter.post('/stripe',authUser,placeOrderStripe);
orderRouter.post('/razorpay',authUser,placeOrderRazorpay);

// User features
orderRouter.post('/userorders',authUser,userOrders);
orderRouter.post('/cancel', authUser, cancelOrder);

// Verify payment
orderRouter.post('/verifyStripe',authUser,verifyStripe)

export default orderRouter;