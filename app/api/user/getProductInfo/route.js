import connectDB from "@/library/connectDB";
import product from "@/model/product";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    await connectDB();

    const { productId } = await request.json();
    const data = await product.findById(productId);
    let carted = {};

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        carted.cart=user.cart.includes(productId.toString());
        console.log("data")
      }
    } catch { console.log("data12")}
 console.log(token)
    return NextResponse.json({ data, carted});
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
