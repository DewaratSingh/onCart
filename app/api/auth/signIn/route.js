import connectDB from "@/library/connectDB";
import User from "@/model/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ message: "All fields are required" });
    }

    await connectDB();
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return Response.json({ message: "Email not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      JSON.stringify(password),
      existingUser.password
    );
    if (!isPasswordValid) {
      return Response.json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return Response.json({ message: "User signed in successfully", token },{status:201});
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}
