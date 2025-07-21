import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();  

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

try {
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

export default connectDB;
