import reviewModel from '../models/reviewModel.js';
import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

// Add or update a review
const addReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, rating, comment } = req.body;

    if (!productId || !rating) {
      return res.json({ success: false, message: 'Product ID and rating are required' });
    }

    // Check if user has purchased this product
    let verifiedPurchase = false;
    try {
      const orders = await orderModel.find({ userId, 'items.productId': productId, status: { $ne: 'Cancelled' } });
      if (orders && orders.length > 0) verifiedPurchase = true;
    } catch (e) {
      // If orderModel doesn't have this structure, skip verification
    }

    // Check for existing review
    const existing = await reviewModel.findOne({ userId, productId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment || '';
      existing.verifiedPurchase = verifiedPurchase;
      await existing.save();
      return res.json({ success: true, message: 'Review updated', review: existing });
    }

    const review = new reviewModel({
      userId,
      productId,
      rating,
      comment: comment || '',
      verifiedPurchase,
    });
    await review.save();
    res.json({ success: true, message: 'Review added', review });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ success: false, message: 'You have already reviewed this product' });
    }
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get all reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.json({ success: false, message: 'Product ID is required' });
    }

    const reviews = await reviewModel.find({ productId }).sort({ createdAt: -1 });

    // Fetch user names for each review
    const enriched = await Promise.all(
      reviews.map(async (r) => {
        let userName = 'Anonymous';
        try {
          const user = await userModel.findById(r.userId);
          if (user) userName = user.name;
        } catch (e) {}
        return {
          _id: r._id,
          userId: r.userId,
          userName,
          rating: r.rating,
          comment: r.comment,
          images: r.images,
          verifiedPurchase: r.verifiedPurchase,
          helpful: r.helpful,
          createdAt: r.createdAt,
        };
      })
    );

    // Calculate summary
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : 0;
    const breakdown = [5, 4, 3, 2, 1].map(star => ({
      star,
      count: reviews.filter(r => r.rating === star).length,
    }));

    res.json({ success: true, reviews: enriched, summary: { total, avg: Number(avg), breakdown } });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Delete own review
const deleteReview = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.body;
    const review = await reviewModel.findById(reviewId);
    if (!review) return res.json({ success: false, message: 'Review not found' });
    if (review.userId.toString() !== userId) {
      return res.json({ success: false, message: 'You can only delete your own review' });
    }
    await reviewModel.findByIdAndDelete(reviewId);
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Toggle helpful vote
const toggleHelpful = async (req, res) => {
  try {
    const userId = req.userId;
    const { reviewId } = req.body;
    const review = await reviewModel.findById(reviewId);
    if (!review) return res.json({ success: false, message: 'Review not found' });

    const idx = review.helpful.indexOf(userId);
    if (idx > -1) {
      review.helpful.splice(idx, 1);
    } else {
      review.helpful.push(userId);
    }
    await review.save();
    res.json({ success: true, helpfulCount: review.helpful.length });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addReview, getProductReviews, deleteReview, toggleHelpful };
