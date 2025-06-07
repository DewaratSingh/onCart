"use client";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

const page = () => {

   async function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    
    let formData = new FormData(e.target);
  
    try{
      const response = await axios.post("/api/shop/product/addproduct", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast(response.data.message);
      } catch (error) {
        toast("Error adding product:", error);
      }
  }


  return (
    <div>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Add Product
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="T-shirt"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="T-shirt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              {/* <input
                type="text"
                name="description"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="your@email.com"
              /> */}
              <textarea
                name="description"
                placeholder=""
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                name="price"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="349"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                RealPrice
              </label>
              <input
                type="number"
                name="realPrice"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="299"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                stockQuantity
              </label>
              <input
                type="number"
                name="stockQuantity"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="29"
              />
            </div>

           
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image 1
              </label>
              <input
                type="file"
                name="file1"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image 2
              </label>
              <input
                type="file"
                name="file2"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image 3
              </label>
              <input
                type="file"
                name="file3"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image 4
              </label>
              <input
                type="file"
                name="file4"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image 5
              </label>
              <input
                type="file"
                name="file5"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            
           

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Add Product
            </button>
          </form>

         
        </div>
      </div>
    </div>
  );
};

export default page;
