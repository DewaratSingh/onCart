import connectDB from "@/library/connectDB";
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
    const { likedId } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { like: likedId },
      },
      { new: true }
    );
    return NextResponse.json({
      message: "Liked",
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" });
  }
}