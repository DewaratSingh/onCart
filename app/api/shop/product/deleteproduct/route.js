import connectDB from "@/library/connectDB";
import User from "@/model/user";
import Shop from "@/model/shop";
import product from "@/model/product";
import jwt from "jsonwebtoken";
import path from "path";
import { rm } from "fs/promises";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const {id}= await request.json()

    const user = await User.findById(userId);
    const shopId = user.shopId;

    const productToDelete = await product.findById(id);

    if (!productToDelete) {
      return NextResponse.json({ message: "Product not found" });
    }

    const folderPath = path.join(process.cwd(), "public", "uploads", productToDelete.folderName);

    await product.findByIdAndDelete(id);

    await Shop.findByIdAndUpdate(shopId, {
      $pull: { products: id },
    });

    await rm(folderPath, { recursive: true, force: true });

    return NextResponse.json({ message: "Product deleted successfully" });
   } catch (error) {
     console.error("DELETE ERROR:", error);
     return NextResponse.json({ message: "Internal Server Error" });
   }
}