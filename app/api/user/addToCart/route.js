import connectDB from "@/library/connectDB";
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
    const { cart } = await request.json();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $push: { cart: cart },
      },
      { new: true }
    );

    return Response.json({
      message: "Added to Cart",
    });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}
