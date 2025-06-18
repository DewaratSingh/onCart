"use client";
import { usePathname } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { HiShoppingCart, HiOutlineShoppingCart } from "react-icons/hi2";
import {
  RiHome2Line,
  RiHome2Fill,
  RiAccountCircleLine,
  RiAccountCircleFill,
} from "react-icons/ri";
import { SiCarto } from "react-icons/si";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const currentPage = pathname.split("/").pop();

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
        <nav className="h-16 flex items-center justify-between gap-6 px-4 w-full bg-[#d8d4d468]">
          <div className="flex items-center font-bold text-2xl  hover:scale-105 transition">
            <span>on</span>
            <SiCarto className="text-5xl" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative max-w-lg w-full hidden sm:flex items-center"
          >
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              aria-label="Search products"
              name="search"
              type="text"
              placeholder="Search"
              className="w-full border rounded-md pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <input type="submit" className="hidden" />
          </form>

          <div className="flex items-center gap-6 text-2xl text-[#484848]">
            <Link href="/">
              <div
                className="cursor-pointer transition hover:scale-105 hover:text-black"
                title="Home"
              >
                {currentPage === "" ? <RiHome2Fill /> : <RiHome2Line />}
              </div>
            </Link>
            <Link href="/pages/user/cart">
              <div
                className="cursor-pointer transition hover:scale-105 hover:text-black"
                title="Cart"
              >
                {currentPage === "cart" ? (
                  <HiShoppingCart />
                ) : (
                  <HiOutlineShoppingCart />
                )}
              </div>{" "}
            </Link>

            <Link href="/pages/user/like">
              <div
                className="cursor-pointer transition hover:scale-105 hover:text-black"
                title="Wishlist"
              >
                {currentPage === "like" ? <FaHeart /> : <FaRegHeart />}
              </div>{" "}
            </Link>

            <Link href="/pages/user/profile">
              <div
                className="cursor-pointer transition hover:scale-105 hover:text-black"
                title="Profile"
              >
                {currentPage === "profile" ? (
                  <RiAccountCircleFill />
                ) : (
                  <RiAccountCircleLine />
                )}
              </div>{" "}
            </Link>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
