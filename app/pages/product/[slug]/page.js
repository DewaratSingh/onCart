"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


const ProductPage = ({ params }) => {
  const [data, setdata] = useState(null);
  const [Image, setImage] = useState(null);
  const router = useRouter();
  const [cart, setcart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.post("/api/user/getProductInfo", {
        productId: params.slug,
      });

      const product = response.data.data;
      setdata(product);
      setcart(response.data.carted)

      if (product?.image?.length > 0) {
        setImage(
          `http://localhost:3000/uploads/${product.folderName}/${product.image[0]}`
        );
      }
    };

    fetchData();
  }, [params.slug]);

  const changeImgae = (src) => {
    if (src !== Image) setImage(src);
  };

  const addToCart = async () => {
      const token = localStorage.getItem("token");
      if (cart) {
        const responce = await axios.post(
          "/api/user/addToCart",
          { cartId: params.slug },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(responce.data);
        if (responce.data.message == "Unauthorized") {
          router.push("/pages/signIn");
        } else {
          setcart(false);
        }
      } else {
        const responce = await axios.post(
          "/api/user/addInLike",
          { cartId: params.slug },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(responce.data);
        if (responce.data.message == "Unauthorized") {
          router.push("/pages/signIn");
        } else {
          setcart(true);
        }
      }
    };


  return (
    <div className="bg-white">
      <main className="my-8">
        <div className="container mx-auto px-6">
          <div className="md:flex md:items-center">
            {/* Thumbnail images */}
            <div className="flex flex-col gap-2">
              {data?.image?.map((img, index) => (
                <div
                  key={index}
                  className="h-32 w-32 max-w-sm mx-auto rounded-md shadow-md overflow-hidden"
                >
                  <div
                    className="flex items-end justify-end h-32 w-32 bg-cover"
                    onClick={() =>
                      changeImgae(
                        `http://localhost:3000/uploads/${data.folderName}/${img}`
                      )
                    }
                    style={{
                      backgroundImage: `url("http://localhost:3000/uploads/${data.folderName}/${img}")`,
                    }}
                  ></div>
                </div>
              ))}
            </div>

            {/* Main image preview */}
            <div className="w-full h-64 md:w-1/2 lg:h-96">
              <img
                className="h-full w-full rounded-md object-cover max-w-lg mx-auto"
                src={Image}
                alt={data?.name || "Product Image"}
              />
            </div>

            {/* Product details */}
            <div className="w-full max-w-lg mx-auto mt-5 md:ml-8 md:mt-0 md:w-1/2">
              <h3 className="text-gray-700 uppercase text-lg">{data?.name}</h3>
              <span className="text-[red] line-through mt-3 ">
                ₹{data?.price}
              </span>
              <span className="text-gray-500 mt-3 ml-7">
                ₹{data?.realPrice}
              </span>
              <hr className="my-3" />

              <div className="mt-2">
                <label className="text-gray-700 text-sm">Description:</label>
                <div className="flex items-center mt-1">
                  {data?.description}
                </div>
              </div>

              <div className="mt-3">
                <label className="text-gray-700 text-sm">Category:</label>
                <div className="flex items-center mt-1">{data?.category}</div>
              </div>

              <div className="mt-3">
                <label className="text-gray-700 text-sm">Rating:</label>
                <div className="flex items-center mt-1">
                  {data?.rating} star
                </div>
              </div>

              <div className="flex items-center mt-6">
                <button className="px-8 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-500 focus:outline-none">
                  Order Now
                </button>
                <button
                  onClick={addToCart}
                 className={ cart ? "mx-2 bg-amber-400 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none" : "mx-2 text-gray-600 border rounded-md p-2 hover:bg-gray-200 focus:outline-none"}  >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-1">
            <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
              {/* Other related products if needed */}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-200">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <a
            href="#"
            className="text-xl font-bold text-gray-500 hover:text-gray-400"
          >
            Shop: {data?.shopId}
          </a>
          <p className="py-2 text-gray-500 sm:py-0">All rights reserved</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
