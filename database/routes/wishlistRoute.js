import express from 'express';
import wishlistController from '../controllers/wishlistController.js';
import auth from '../middleware/auth.js';
import Wishlist from '../models/wishlistModel.js';

const router = express.Router();

router.get('/', auth, wishlistController.getWishlist);
router.post('/add', auth, wishlistController.addToWishlist);
router.post('/remove', auth, wishlistController.removeFromWishlist);
// Admin: get all wishlists
router.get('/all', async (req, res) => {
  try {
    const wishlists = await Wishlist.find();
    res.json({ success: true, wishlists });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch all wishlists', error: err.message });
  }
});
// Admin: remove a wishlist item for any user
router.post('/admin-remove', async (req, res) => {
  try {
    const { userId, productId, video } = req.body;
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) return res.json({ success: false, message: 'Wishlist not found' });
    wishlist.items = wishlist.items.filter(i => {
      if (productId) return i.productId !== productId;
      if (video) return i.video !== video;
      return true;
    });
    await wishlist.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove wishlist item', error: err.message });
  }
});

export default router; 