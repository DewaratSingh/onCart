import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/library/connectDB";
import User from "@/model/user";
import product from "@/model/product";
import Order from "@/model/order";
import { RiAccountCircleLine } from "react-icons/ri";
import Link from "next/link";
import Footer from "@/component/Footer";
import { redirect } from "next/navigation";

export default async function Page() {
  connectDB();

  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  let user = null;
  let data = [];

  if (!token) {
   redirect("/pages/signIn")
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    user = await User.findById(userId);
    if (!user) {
      return <div className="text-center mt-10">User not found.</div>;
    }

    for (const ele of user.order) {
      const order = await Order.findById(ele);
      const p = await product.findById(order.products);
      data.push({
        name: p.name,
        price: p.price,
        realPrice: p.realPrice,
        image: `http://localhost:3000/uploads/${p.folderName}/${p.image[0]}`,
        description: p.description,
        id: p._id.toString(),
        order: order.status,
        DOD: order.DOD,
      });
    }
  } catch (error) {
    console.error("JWT or DB error:", error);
  }

  return (
    <div>
      <div className="bg-gray-200 font-sans h-screen w-full flex flex-row justify-center items-center">
        <div className="card w-96 mx-auto bg-white shadow-xl hover:shadow">
          <RiAccountCircleLine className="w-32 mx-auto -mt-20 text-9xl" />
          <div className="text-center mt-2 text-3xl font-medium">
            {user?.name || "Loading..."}
          </div>
          <div className="text-center mt-2 font-light text-sm">
            {user?.email || "yourname@gmail.com"}
          </div>
          <div className="text-center mt-2 font-light text-sm">
            +91 {user?.contact || "5473548335"}
          </div>
          <div className="px-6 text-center mt-2 font-light text-sm">
            <p>{user?.address || "Address is not given"}</p>
          </div>
          <hr className="mt-8" />
          <div className="flex p-4">
            <div className="w-1/2 text-center">
              <form action="/api/auth/signOut" method="POST">
                <button type="submit" className="text-red-500">
                  Sign Out
                </button>
              </form>
            </div>

            <div className="w-0 border border-gray-300"></div>
            <div className="w-1/2 text-center">
              {user?.shopId ? (
                <Link href="/pages/admin/Dashbord">
                  <button className="cursor-pointer ">Go to Shop</button>
                </Link>
              ) : (
                <Link href="/pages/admin/openShop">
                  <button className="cursor-pointer ">Create shop</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <section>
        <div className="w-[100vw] ">
          <div className="font-extrabold">Your Order History</div>
          <div className="w-[100vw] m-auto  gap-4">
            {data.map((product, i) => (
              <Link key={i} href={`/pages/product/${product.id}`}>
                <div className="ml-6 w-[450px] inline-block mt-3 transition hover:scale-105 relative ">
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

                      <div>
                        <h3 className="text-sm text-green-500">
                          Status:{product.order}
                        </h3>
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
      <Footer />
    </div>
  );
}
