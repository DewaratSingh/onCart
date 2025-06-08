"use client";
import React from "react";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { HiShoppingCart } from "react-icons/hi2";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { RiHome2Line } from "react-icons/ri";
import { RiHome2Fill } from "react-icons/ri";
import { RiAccountCircleLine } from "react-icons/ri";
import { RiAccountCircleFill } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { SiCarto } from "react-icons/si";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loding from "./Loding";

const Navbar = () => {
  const [Page, setPage] = useState("home");
  const [loding, setloding] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  const page = pathname.split("/").pop();
  useEffect(() => {
    setPage(page);
  }, []);

  const clickRoute = (page) => {
    setloding(true);
    setPage(page);
    switch (page) {
      case "home":
        router.push("/");
        break;
      case "cart":
        router.push("/pages/user/cart");
        break;
      case "like":
        router.push("/pages/user/like");
        break;
      case "profile":
        router.push("/pages/user/profile");
        break;
      default:
        router.push("/");
        break;
    }
    setloding(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("search");
    const search = encodeURIComponent(name.trim());
    router.push(`/pages/search?search=${search}`);
  };

  return (
    <div>
      <header className="text-black border-b border-gray-400">
        <nav className="h-16 flex items-center justify-between gap-6 border-b-black m-auto w-[90vw] bg-[#d8d4d468]">
          <div className="ml-8 flex justify-center items-center font-extrabold transition hover:scale-105 ">
            on
            <SiCarto className="text-8xl" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="pt-2 relative mx-auto text-gray-600 flex items-center justify-center"
          >
            <input
              type="text"
              name="search"
              placeholder="Search..."
              className="focus:outline-0 border-2 border-gray-500 text-sm rounded-sm h-10 w-[300px]"
            />
            <button type="submit">
              <CiSearch className="text-2xl ml-2.5 transition text-2xl cursor-pointer text-[#484848] hover:scale-105 hover:text-black" />
            </button>
          </form>

          <div className=" mr-8 flex items-center justify-center gap-7">
            <div
              onClick={() => {
                clickRoute("home");
              }}
              className="   transition text-2xl cursor-pointer text-[#484848] hover:scale-105 hover:text-black"
            >
              {Page == "home" ? <RiHome2Fill /> : <RiHome2Line />}
            </div>
            <div
              onClick={() => {
                clickRoute("cart");
              }}
              className="   transition text-2xl cursor-pointer text-[#484848] hover:scale-105 hover:text-black"
            >
              {Page == "cart" ? <HiShoppingCart /> : <HiOutlineShoppingCart />}
            </div>
            <div
              onClick={() => {
                clickRoute("like");
              }}
              className="   transition text-2xl cursor-pointer text-[#484848] hover:scale-105 hover:text-black"
            >
              {Page == "like" ? <FaHeart /> : <FaRegHeart />}
            </div>
            <div
              onClick={() => {
                clickRoute("profile");
              }}
              className="transition text-2xl cursor-pointer text-[#484848] hover:scale-105 hover:text-black"
            >
              {Page == "profile" ? (
                <RiAccountCircleFill />
              ) : (
                <RiAccountCircleLine />
              )}
            </div>
          </div>
        </nav>
      </header>
      {loding ? <Loding /> : ""}
    </div>
  );
};

export default Navbar;
