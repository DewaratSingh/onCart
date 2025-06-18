import connectDB from "@/library/connectDB";
import product from "@/model/product";
import Link from "next/link";
import Footer from "@/component/Footer";

export default async function Home() {
  await connectDB();

  const products = await product.find().sort({ rating: -1 }).limit(8);

  const data = products.map((p) => ({
    name: p.name,
    price: p.price,
    realPrice: p.realPrice,
    image: `http://localhost:3000/uploads/${p.folderName}/${p.image[0]}`,
    like: false,
    description: p.description,
    id: p._id.toString(),
    rating: p.rating,
  }));

  return (
    <div>
      <main className="sm:pt-16 m-auto">
        <h2 className="text-xl ml-9 font-bold tracking-tight text-gray-900">
          Trending Customers Purchased
        </h2>
        <section>
          <div className="w-full flex justify-center">
            <div className="w-[90vw] m-auto flex flex-wrap gap-4">
              {data.map((product) => (
                <div key={product.id} className=" ml-6  mt-3 w-[400px] transition hover:scale-105 relative inline-block">
                  <div className="group relative">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                      />
                    </div>
                    <Link href={`/pages/product/${product.id}`}>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm text-gray-700">
                          <a href="#">
                            <span
                              aria-hidden="true"
                              className="absolute inset-0"
                            ></span>
                            {product.name}
                          </a>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {product.description.length > 20
                            ? product.description.slice(0, 20) + "..."
                            : product.description}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium line-through text-red-600 ">
                          ₹{product.price}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          ₹{product.realPrice}
                        </p>
                      </div>
                    </div></Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer/>
      </div> 
  );
}
