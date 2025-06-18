import connectDB from "@/library/connectDB";
import product from "@/model/product";
import { NextResponse } from "next/server";


export async function GET(request) {
  try {
    await connectDB();


    const products = await product.find().sort({ rating: -1 }).limit(8);

    let data = [];

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
          id: products[i]._id,
          rating: products[i].rating,
        });
      }
    

    return NextResponse.json({ data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
}
