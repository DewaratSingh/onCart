import connectDB from "@/library/connectDB";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();
    const { cartId } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { cart: cartId },
      },
      { new: true }
    );

    return Response.json({
      message: "UnCart",
    });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}