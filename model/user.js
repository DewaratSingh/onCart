import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: false },
  contact: { type: String, required: true },
  like: { type: Array, default: [] },
  cart: { type: Array, default: [] },
  address: { type: String, required: false },
  order: { type: Array, default: [] },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;