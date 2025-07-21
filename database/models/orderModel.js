import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true }, 
  amount: { type: Number, required: true },
  address: { type: Object, required: true }, 
  status: { type: String, default: "Order Placed", required: true },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, default: false, required: true },
  date: { type: Date, default: Date.now }, 
  cancellationReason: { type: String, default: '' },
});

const orderModel = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default orderModel;
