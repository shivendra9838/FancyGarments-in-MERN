import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import reviewRouter from "./routes/reviewRoute.js";
import Wishlist from "./models/wishlistModel.js";
import path from "path";

// App config
const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Debug: Print all wishlists (only in dev)
mongoose.connection.once("open", async () => {
  if (process.env.NODE_ENV !== "production") {
    try {
      const wishlists = await Wishlist.find();
      console.log("--- All Wishlists ---");
      wishlists.forEach((wl) =>
        console.log(`User: ${wl.user}, Items: ${wl.items.length}`)
      );
      console.log("---------------------");
    } catch (err) {
      console.error("Error printing wishlists:", err.message);
    }
  }
});

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/review", reviewRouter);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Welcome to Fancy Garments API");
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
