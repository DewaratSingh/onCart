import connectDB from "@/library/connectDB";
import Shop from "@/model/shop";
import User from "@/model/user";
import jwt from "jsonwebtoken";
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

    const user = await User.findById(userId);

    if (user && user.shopId) {
      return NextResponse.json({ message: "User already has a shop" });
    }

    const { name, email, address, contact } = await request.json();

    if (!name || !email || !address || !contact) {
      return NextResponse.json({ message: "All fields are required" });
    }

    const existingShop = await Shop.findOne({ name });
    if (existingShop) {
      return NextResponse.json({ message: "Shop name already exists" });
    }

    console.log(userId);
    console.log(userId, 123);
    const newShop = new Shop({
      name,
      email,
      address,
      contact,
      owner: userId,
    });

    await newShop.save();

    await User.findByIdAndUpdate(userId, {
      shopId: newShop._id,
    });

    return NextResponse.json(
      { message: "Shop created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
