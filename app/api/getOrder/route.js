import connectDB from "@/library/connectDB";
import User from "@/model/user";
import Shop from "@/model/shop";
import product from "@/model/product";
import jwt from "jsonwebtoken";
import Order from "@/model/order";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const user = await User.findById(userId);
    const shopId = user.shopId;

    const shop = await Shop.findById(shopId);

    let data = [];

    for (let i = 0; i < shop.orders.length; i++) {
      const order = await Order.findById(shop.orders[i]);
      const pro = await product.findById(order.products);

      data.push({
        oid:order._id,
        id: order.customer,     
        name: pro.name,
        realPrice: pro.realPrice,
        status: order.status,       
      });
    }

    return Response.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Error in getOrder API:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
