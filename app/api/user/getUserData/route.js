import connectDB from "@/library/connectDB";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const user = await User.findById(userId);
    const data = {
      name: user.name,
      contact: user.contact,
      address: user.address,
      shop: user.shopId,
      email: user.email,
    };
    return Response.json({ data }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}
