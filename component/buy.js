"use client";
import React from "react";
import { FaCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdOutlineDiscount } from "react-icons/md";
import { ToastContainer,toast } from "react-toastify";
import axios from "axios";

const Buy = ({ address, price, cutPrice, discount,idArray }) => {
  const router=useRouter()

  const Buy_data=async ()=>{
    try{
      console.log(idArray)
      const responce=await axios.post("/api/user/order",{productIdarray: idArray})
console.log(responce.data)
    }catch{

    }
  }
 

  return (
    <div className="sm:w-[30vw] w-full ">
      <div>
        <div className="font-extrabold text-3xl text-center mt-20">Billing</div>
        <div className="flex justify-evenly mt-10">
          <div>
            <b className="inline-block">Total:</b>
            <p className="text-sm ml-6  inline-block font-medium line-through text-red-600 ">
              ₹{cutPrice}
            </p>
            <p className=" ml-6 inline-block"> ₹{price}</p>
          </div>
          <div className="flex">
            <b className="inline-block">Discount:</b>
            {discount}%<MdOutlineDiscount />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 justify-between">
        <div className=" mt-5 ml-5 font-extrabold">
          Address: <div className="font-normal">{address}</div>
        </div>
        <div>
          <button
          onClick={()=>{router.push("/pages/user/addAddress")}}
            type="submit"
            className="w-full mt-5  mr-5 font-extrabold py-2.5 rounded-lg transition-colors"
          >
            Change Address
          </button>
        </div>
      </div>
      <div className="flex items-center justify-center mt-5">
        <FaCheck className="text-green-600 " />
        Cash On Deleviry
      </div>
      <button
      onClick={()=>{Buy_data()}}
        type="submit"
        className=" mt-5 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors"
      >
        Buy Now
      </button>
    </div>
  );
};

export default Buy;
