import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 } // Expires in 5 minutes (300 seconds)
  }
);

const otpModel = mongoose.models.otp || mongoose.model("otp", otpSchema);
export default otpModel;
