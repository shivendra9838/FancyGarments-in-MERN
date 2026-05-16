import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true }, 
  category: { type: String, required: true },       // Men | Women | Kids
  subCategory: { type: String, required: true },    // Topwear | Bottomwear | Winterwear
  productType: { type: String, default: '' },       // tops | jeans | shirts | dresses | shorts | skirts | tshirts | trousers | trackpants
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  isNewArrival: { type: Boolean, default: false },
  date: { type: Number, required: true },
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
