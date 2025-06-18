"use client";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const page = () => {
  const router = useRouter();
  const [Loding, setLoding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      address: formData.get("address"),
    };
    setLoding(true);
    try {
      const response = await axios.post("/api/user/cart/addAddress", data);
      toast(response.data.message);
      if (response.data.success) {
        router.back();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
    setLoding(false);
  };

  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Address
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                type="text"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="House no , street , city , District ,State , Pincode .."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              disabled={Loding}
            >
              {Loding ? "Loading..." : "Add Address"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
