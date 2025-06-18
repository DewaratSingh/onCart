import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    ],
    DOD: { type: Date, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
