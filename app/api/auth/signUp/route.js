import connectDB from "@/library/connectDB";
import User from "@/model/user";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password, contact } = await request.json();

    if (!name || !email || !password || !contact) {
      return Response.json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(JSON.stringify(password), 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      contact,
    });

    await newUser.save();

    return Response.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}
