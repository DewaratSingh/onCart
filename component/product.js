import axios from "axios";
import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Product = ({ name, like, description, price, realPrice, image, id ,setupdate}) => {
  const router = useRouter();
const [liked, setliked] = useState(like)



  const likefun = async () => {
    const token = localStorage.getItem("token");
    if (liked) {
      const responce = await axios.post(
        "/api/user/disLike",
        { likedId: id },
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
        setliked(false);
      }
    } else {
      const responce = await axios.post(
        "/api/user/addInLike",
        { likedId: id },
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
        setliked(true);
      }
    }
    setupdate((pre)=>{pre+1})
  };


  const showProduct=async ()=>{
     router.push(`/pages/product/${id}`)
  }
  return (
    <div onClick={showProduct} className="mt-7  sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8  inline-block ml-5 transition hover:scale-105">
      <div className="group relative w-[300px]">
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
        <div className="mt-4 flex justify-between">
          <div>
            <h3 className="text-sm text-gray-700">
              <a href="#">
                <span aria-hidden="true" className="absolute inset-0"></span>
                {name}
              </a>
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {description?.length > 20
                ? description.slice(0, 20) + "..."
                : description}
            </p>
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-900 line-through text-red-600 ">
              {price}
            </p>
            <p className="text-sm font-medium text-gray-900">{realPrice}</p>
          </div>
          <div
            onClick={likefun}
            className="absolute top-2 right-2.5 text-[red]"
          >
            {liked ? <FaHeart /> : <FaRegHeart />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
