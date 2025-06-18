import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  address: { type: String, required: true },
  contact: { type: String, required: true },
  orders:[],
});

const Shop =mongoose.models.Shop || mongoose.model("Shop", shopSchema);

export default Shop;