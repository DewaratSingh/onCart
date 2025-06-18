import connectDB from "@/library/connectDB";
import product from "@/model/product";
import User from "@/model/user";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Link from "next/link";
import Footer from "@/component/Footer";

export default async function CartPage() {
  await connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <div className="text-center mt-10">Please login to see your cart.</div>
    );
  }

  let data = [];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return <div className="text-center mt-10">User not found.</div>;
    }

    const cartItems = await product.find({
      _id: { $in: user.like },
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
  } catch (err) {
    return <div className="text-center mt-10">Invalid or expired session.</div>;
  }

  return (
    <div>
      <main className="sm:pt-16 m-auto">
        <h2 className="text-xl ml-9 font-bold tracking-tight text-gray-900">
          {data.length == 0 ? "No Liked Product" : "Your Like Items"}
        </h2>
        <section>
          <div className="w-full flex justify-center">
            <div className="w-[90vw] m-auto flex flex-wrap gap-4">
              {data.map((product) => (
                <Link href={`/pages/product/${product.id}`}>
                  <div
                    key={product.id}
                    className="ml-6 mt-3 transition hover:scale-105 relative inline-block"
                  >
                    <div className="group relative w-[300px]">
                      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:h-80">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
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
                  </div>{" "}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}
