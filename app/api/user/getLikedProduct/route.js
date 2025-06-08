import connectDB from "@/library/connectDB";
import product from "@/model/product";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    await connectDB();

    const user = await User.findById(userId);

    let data = [];

    for (let i = 0; i < user.like.length; i++) {
      let productsId = user.like[i];
      const products = await product.findById(productsId);
      data.push({
        name: products.name,
        price: products.price,
        realPrice: products.realPrice,
        image:
          "http://localhost:3000/uploads/" +
          products.folderName +
          "/" +
          products.image[0],
        like: true,
        description: products.description,
        id: products._id,
      });
    }

    return Response.json({ data }, { status: 201 });
   } catch (error) {
     return Response.json({ message: "Internal Server Error" }, { status: 500 });
   }
}
