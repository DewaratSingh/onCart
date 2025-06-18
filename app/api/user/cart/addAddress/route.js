import connectDB from "@/library/connectDB";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized",success:false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();
    const { address } = await request.json();

    if(!address){
        return NextResponse.json({
      message: "Address is Require",success:false
    });
    }

    const user = await User.findByIdAndUpdate(userId, {
      address: address,
    });

    return NextResponse.json({
      message: "Address updated",success:true
    });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" ,success:false});
  }
}
