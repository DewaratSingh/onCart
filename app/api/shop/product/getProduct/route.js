import connectDB from "@/library/connectDB";
import User from "@/model/user";
import Shop from "@/model/shop";
import product from "@/model/product";
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
    const shopId = user.shopId;

    const prod = await Shop.findById(shopId);
    const shop = prod.products;
    let data = [];

    for (let i = 0; i < shop.length; i++) {
      const Product = await product.findById(shop[i]);
      data.push({
        id: Product._id,
        name: Product.name,
        price: Product.price,
        realPrice: Product.realPrice,
        stockQuantity: Product.stockQuantity,
        rating: Product.rating,
        category: Product.category,
      });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" });
  }
}
