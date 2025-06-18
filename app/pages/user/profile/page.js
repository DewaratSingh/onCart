"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { RiAccountCircleLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import Link from "next/link";

const page = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const User_data = async () => {
    try {
      const response = await axios.get("/api/user/getUserData");
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching shop data:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    try {
      const response = await axios.post("/api/auth/signOut");
      router.push("/pages/signIn");
      console.log(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    User_data();
  }, []);

  return (
    <div className="bg-gray-200 font-sans h-screen w-full flex flex-row justify-center items-center">
      <div className="card w-96 mx-auto bg-white  shadow-xl hover:shadow">
        <RiAccountCircleLine className="w-32 mx-auto -mt-20  text-9xl" />
        <div className="text-center mt-2 text-3xl font-medium">
          {data?.name || "Loading..."}
        </div>
        <div className="text-center mt-2 font-light text-sm">
          {data?.email || "yourname@gmail.com"}
        </div>
        <div className="text-center mt-2 font-light text-sm">
          +91 {data?.contact || "+91 5473548335"}
        </div>
        <div className="px-6 text-center mt-2 font-light text-sm">
          <p>{data?.address || "Address is not given"}</p>
        </div>
        <hr className="mt-8" />
        <div className="flex p-4">
          <div className="w-1/2 text-center cursor-pointer">
            <button
              className="cursor-pointer "
              onClick={() => {
                signOut();
              }}
            >
              Sign Out
            </button>
          </div>
          <div className="w-0 border border-gray-300"></div>
          <div className="w-1/2 text-center">
            {data?.shop ? (
              <Link href="/pages/admin/Dashbord">
                <button
                  className="cursor-pointer "
                  onClick={() => router.push("/pages/admin/Dashbord")}
                >
                  Go to Shop
                </button>
              </Link>
            ) : (
              <Link href="/pages/admin/openShop">
                <button
                  className="cursor-pointer "
                 // onClick={() => router.push("/pages/admin/openShop")}
                >
                  Create shop
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
