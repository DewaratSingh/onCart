import connectDB from "@/library/connectDB";
import product from "@/model/product";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    await connectDB();

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const foundProduct = await product.findById(productId);
    if (!foundProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    let isCarted = false;
    let isLiked = false;

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      isCarted = user.cart.includes(productId.toString());
      isLiked = user.like.includes(productId.toString());
    }

    return NextResponse.json(
      {
        data: foundProduct,
        carted: { cart: isCarted },
        liked: { like: isLiked },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/product/cart-check:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
