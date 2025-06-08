import connectDB from "@/library/connectDB";
import product from "@/model/product";
import User from "@/model/user";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];

    await connectDB();

    const { search } = await request.json();

    const products = await product.find({
      name: { $regex: search },
    });

    let data = [];

    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId);
        for (let i = 0; i < products.length; i++) {
          const liked = user.like.includes(products[i]._id.toString());
          data.push({
            name: products[i].name,
            price: products[i].price,
            realPrice: products[i].realPrice,
            image:
              "http://localhost:3000/uploads/" +
              products[i].folderName +
              "/" +
              products[i].image[0],
            like: liked,
            description: products[i].description,
            id:products[i]._id
          });
        }
      }
    } catch {
      for (let i = 0; i < products.length; i++) {
        data.push({
          name: products[i].name,
          price: products[i].price,
          realPrice: products[i].realPrice,
          image:
            "http://localhost:3000/uploads/" +
            products[i].folderName +
            "/" +
            products[i].image[0],
          like: false,
          description: products[i].description,
        });
      }
    }

    if (token) {
    } else {
    }

    return Response.json({ data }, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
