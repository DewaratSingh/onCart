import connectDB from "@/library/connectDB";
import Shop from "@/model/shop";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const user = await User.findById(userId);

    if (user && user.shopId) {
      return Response.json({ message: "User already has a shop" });
    }

    const { name, email, address, contact } = await request.json();

    if (!name || !email || !address || !contact) {
      return Response.json({ message: "All fields are required" });
    }

    const existingShop = await Shop.findOne({ name });
    if (existingShop) {
      return Response.json({ message: "Shop name already exists" });
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

    return Response.json(
      { message: "Shop created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}
