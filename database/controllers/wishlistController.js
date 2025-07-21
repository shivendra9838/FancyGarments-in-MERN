import Wishlist from '../models/wishlistModel.js';
import User from '../models/userModel.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: userId, items: [] });
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get wishlist', error: err.message });
  }
};

// Add item to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    console.log('addToWishlist called', userId, req.body);
    const item = req.body;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = await Wishlist.create({ user: userId, items: [] });
    // Prevent duplicates
    if (wishlist.items.some(i => (i.productId && i.productId === item.productId) || (i.video && i.video === item.video))) {
      return res.json({ success: false, message: 'Already in wishlist' });
    }
    wishlist.items.push(item);
    await wishlist.save();
    res.json({ success: true, wishlist });
  } catch (err) {
    console.error('addToWishlist error:', err);
    res.status(500).json({ success: false, message: 'Failed to add to wishlist', error: err.message });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, video } = req.body;
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.json({ success: false, message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(i => {
      if (productId) return i.productId !== productId;
      if (video) return i.video !== video;
      return true;
    });
    await wishlist.save();
    res.json({ success: true, wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove from wishlist', error: err.message });
  }
};

export default { getWishlist, addToWishlist, removeFromWishlist }; 