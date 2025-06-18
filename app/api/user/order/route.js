import connectDB from "@/library/connectDB";
import jwt from "jsonwebtoken";
import Order from "@/model/order";
import Product from "@/model/product";
import Shop from "@/model/shop";
import User from "@/model/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized", success: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const { productIdarray } = await request.json();
    console.log("00");
    if (productIdarray.length === 0) {
      return NextResponse.json({
        message: "No products provided",
        success: false,
      });
    }

    const createdOrders = [];
    console.log("1");

    for (const productId of productIdarray) {
      const product = await Product.findById(productId);
      if (!product) {
        continue;
      }

      const order = new Order({
        customer: userId,
        products: [productId],
        DOD: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        status: "Pending",
      });

      await order.save();
      createdOrders.push(order);

      await Shop.findByIdAndUpdate(
        product.shopId,
        { $push: { orders: order._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        userId,
        { $push: { order: order._id } },
        { new: true }
      );
    }
    console.log("11");

    if (createdOrders.length === 0) {
      return NextResponse.json({
        message: "No valid products were found to create orders",
        success: false,
      });
    }

    return NextResponse.json({
      message: "Orders placed successfully",
      success: true,
      orderCount: createdOrders.length,
      orders: createdOrders.map((o) => o._id),
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({
      message: "Server error",
      success: false,
    });
  }
}
