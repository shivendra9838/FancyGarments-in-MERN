
import userModel from "../models/userModel.js";

// ✅ Add products to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size } = req.body;

    if (!userId || !itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });

    return res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Update cart item quantity
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, size, quantity } = req.body;

    if (!userId || !itemId || !size || quantity == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // 🧹 Remove item if quantity <= 0
    if (quantity <= 0) {
      delete cartData[itemId][size];

      // 🧹 Remove the item if no sizes left
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }

      await userModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item removed from cart", cartData });
    }

    // ✅ Update quantity
    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    return res.json({ success: true, message: "Cart Updated", cartData });
  } catch (error) {
    console.error("❌ Update cart error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};

    return res.json({ success: true, cartData });
  } catch (error) {
    console.error("❌ Get cart error:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
