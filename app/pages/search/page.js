"use client";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Product from "@/component/product";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.post(
          "/api/user/search",
          { search }, 
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

    if (search) fetchData();
  }, [search]);

  return (
    <div>
      <h1>Search Results for "{search}"</h1>
      {data.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <Product key={index} image={item.image} id={item.id} price={item.price} realPrice={item.realPrice} name={item.name} description={item.description} like={item.like} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchPage;
