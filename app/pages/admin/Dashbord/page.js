"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [order, setorder] = useState([]);

  const product_data = async () => {
    try {
      const response = await axios.get("/api/shop/product/getProduct");
      setData(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      setData(null);
    } finally {
      setLoading(false);
    }
  };
  const get_order = async () => {
    try {
      const response = await axios.get("/api/getOrder");
      console.log(response.data.data);
      setorder(response.data.data);
    } catch (err) {
      setorder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    product_data();
    get_order();
  }, []);

  const updateProduct = (item) => {
    const foundItem = data.find((element) => element.id === item);
    console.log(foundItem);
  };

  if (loading) return <div>Loading...</div>;

  const deleteProduct = async (id) => {
    try {
      const response = await axios.post("/api/shop/product/deleteproduct", {
        id,
      });
      toast(response.data.message);

      product_data();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
    alert(newStatus)

    try {
      const responce=await axios.post(`/api/shop/product/updateStatus`, {
        status: newStatus,
        orderId,
      });
      console.log(responce.data)
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Error updating status");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div>
        <button
          className=" cursor-pointer w-full mt-6 border-indigo-500 border-2 hover:bg-[#442dd72e] text-black font-medium py-2.5 rounded-lg transition-colors mb-5"
          onClick={() => {
            router.push("/pages/admin/addproduct");
          }}
        >
          + Add Product
        </button>
      </div>
      <div className="font-extrabold">Your Product</div>

      <div className="flex flex-col">
        <span className="flex bg-[#442dd783] ">
          <div className="w-[120px] border-r-2">Name</div>
          <div className="w-[120px] border-r-2">Price</div>
          <div className="w-[120px] border-r-2">RealPrice</div>
          <div className="w-[120px] border-r-2">Category</div>
          <div className="w-[120px] border-r-2">StockQuantity</div>
          <div className="w-[120px] border-r-2">Rating</div>
          <div className="w-[120px] border-r-2">Edit</div>
          <div className="w-[120px] border-r-2">Delete</div>
        </span>
        {data?.length > 0 ? (
          data?.map((item, index) => (
            <div key={index} className="flex bg-[#d5d1d1] border-b-2">
              <div className="w-[120px] border-r-2">{item.name || "name"}</div>
              <div className="w-[120px] border-r-2">
                {item.price || "Price"}
              </div>
              <div className="w-[120px] border-r-2">
                {item.realPrice || "RealPrice"}
              </div>
              <div className="w-[120px] border-r-2">
                {item.category || "Category"}
              </div>
              <div className="w-[120px] border-r-2">
                {item.stockQuantity || "Stock"}
              </div>
              <div className="w-[120px] border-r-2">
                {item.rating || "Rating"}
              </div>
              <div
                className=" cursor-pointer w-[120px] border-r-2"
                onClick={() => {
                  updateProduct(item.id);
                }}
              >
                Edit
              </div>
              <div
                className=" cursor-pointer w-[120px] border-r-2"
                onClick={() => {
                  deleteProduct(item.id);
                }}
              >
                Delete
              </div>
            </div>
          ))
        ) : (
          <div>No products found</div>
        )}
      </div>

      <div className="font-extrabold">Your Order</div>
      <div className="flex flex-col">
        <span className="flex bg-[#442dd783] ">
          <div className="w-[120px] border-r-2">Name</div>
          <div className="w-[120px] border-r-2">Price</div>
          <div className="w-[250px] border-r-2">Costomer</div>
          <div className="w-[200px] border-r-2">Status</div>
        </span>
        {order?.length > 0 ? (
          order?.map((item, index) => (
            <div key={index} className="flex bg-[#d5d1d1] border-b-2">
              <div className="w-[120px] border-r-2">{item.name || "name"}</div>
              <div className="w-[120px] border-r-2">
                {item.realPrice || "Price"}
              </div>
              <div className="w-[250px] border-r-2">{item.id || "id"}</div>
              <div className="w-[200px] border-r-2">
                <select
                  name="status"
                  id={`status-${index}`}
                  className="w-full"
                  defaultValue={item.status}
                  onChange={(e) => handleStatusChange(e, item.oid)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Cancled By shop">Cancled By shop</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <div>No Order found</div>
        )}
      </div>
    </div>
  );
};

export default page;
