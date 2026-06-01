import mongoose from "mongoose";
import path from "path";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    authProvider: { type: String, enum: ['password', 'google', 'email'], default: 'password' },
    cartData: {
      type: Object, 
      default: {},
      // itemId: { size: quantity }
    },
    profileImg: { type: String },
    mobile: { type: String },
    gender: { type: String },
  },
  {
    minimize: false, // keep empty objects in MongoDB
    timestamps: true, 
  }
);
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
