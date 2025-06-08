import connectDB from "@/library/connectDB";
import product from "@/model/product";
import User from "@/model/user";

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    await connectDB();

    const { productId } = await request.json();
    const data = await product.findById(productId);
    let carted=false
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        carted= user.cart.includes(data._id.toString());
      }
    } catch {}

    return Response.json({ data }, { carted});
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
