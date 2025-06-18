import connectDB from "@/library/connectDB";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, contact } = await request.json();

    if (!name || !email || !password || !contact) {
      return NextResponse.json({ message: "All fields are required",success:false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists",success:false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
    });

    await newUser.save();
    console.log(request.url);
    return NextResponse.json({ message: "User Created Sucessfull",success:true });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ message: "Internal Server Error",success:false });
  }
}
