import connectDB from "@/library/connectDB";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        message: "All fields are required",
        success: false,
      });
    }

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "Email not found", success: false });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid password", success: false });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({ message: "Signed in", success: true });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("SignIn Error:", error);
    return NextResponse.json({
      message: "Internal Server Error",
      success: false,
    });
  }
}
