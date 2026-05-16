import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  productId:  { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  comment:    { type: String, default: '' },
  images:     { type: [String], default: [] },
  verifiedPurchase: { type: Boolean, default: false },
  helpful:    { type: [String], default: [] }, // array of userIds who found helpful
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);

export default reviewModel;
