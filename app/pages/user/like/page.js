"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Product from "@/component/product";

const SearchPage = () => {

  const [data, setData] = useState([]);
  const [update, setupdate] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(
          "/api/user/getLikedProduct", 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(response.data.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

     fetchData();
  }, [update]);

  return (
    <div>
     
      {data?.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {data?.map((item, index) => (
            <Product setupdate={setupdate}  key={index} image={item.image} id={item.id} price={item.price} realPrice={item.realPrice} name={item.name} description={item.description} like={item.like} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
