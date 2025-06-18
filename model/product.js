import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  realPrice: { type: Number, required: true },
  description: { type: String, required: true },
  folderName: { type: String, required: true },
  category: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  stockQuantity: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  image: { type: Array, required: true },
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      comment: { type: String, required: true },
      rating: { type:Number, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);