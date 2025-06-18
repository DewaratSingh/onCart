import React from "react";
import connectDB from "@/library/connectDB";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import User from "@/model/user";
import product from "@/model/product";
import jwt from "jsonwebtoken";
import Link from "next/link";
import Buy from "@/component/buy";

export default async function BuyPage({ searchParams }) {
  const id = searchParams.id;
  let pro = id.split(" ");
  console.log(pro);

  await connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/pages/signIn");
  }

  let data = [];
  let address = "";
  let TotalPrice = 0;
  let cutPrice = 0;
  let idArray = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      redirect("/pages/signIn");
    }
    if (!user.address) {
      redirect("/pages/user/addAddress");
    }
    address = user.address;
    const cartItems = await product.find({
      _id: { $in: pro },
    });

    data = cartItems.map((p) => ({
      name: p.name,
      price: p.price,
      realPrice: p.realPrice,
      image: `http://localhost:3000/uploads/${p.folderName}/${p.image[0]}`,
      like: false,
      description: p.description,
      id: p._id.toString(),
      rating: p.rating,
    }));

    data.forEach((index) => {
      TotalPrice += index.realPrice;
      cutPrice += index.price;
    });
    data.forEach((index) => {
      idArray.push(index.id)
    });
  } catch (err) {
    return <div className="text-center mt-10">Invalid or expired session.</div>;
  }

  return (
    <div className="inline sm:flex sm:m-auto">
      <main className="sm:pt-16 m-auto sm:w-[70vw] border-r-1 border-gray-500 w-full overflow-y-scroll overflow-x-hidden h-screen your-div ">
        <h2 className="text-xl ml-9 font-bold tracking-tight text-gray-900">
          {data.length == 0 ? "No Carted Product" : "Your Cart Items"}
        </h2>
        <section>
          <div className="w-full   justify-center">
            <div className="w-full m-auto flex flex-wrap gap-4">
              {data.map((product) => (
                <Link key={product.id} href={`/pages/product/${product.id}`}>
                  <div className="ml-6 w-[500px] mt-3 transition hover:scale-105 relative ">
                    <div className=" flex flex-col group relative w-[400px] ">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-[200px] w-full object-cover object-center lg:h-full lg:w-full"
                        />
                      </div>
                      <div className="mt-4 flex justify-between">
                        <div>
                          <h3 className="text-sm text-gray-700">
                            {product.name}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {product.description.length > 20
                              ? product.description.slice(0, 20) + "..."
                              : product.description}
                          </p>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-medium line-through text-red-600">
                            ₹{product.price}
                          </p>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{product.realPrice}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Buy
        address={address}
        price={TotalPrice}
        cutPrice={cutPrice}
        discount={(TotalPrice * 100) / cutPrice}
        idArray={idArray}
      />
    </div>
  );
}
