import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import ItemCard from "../components/ItemCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
const goBack = () => {
    navigate(-1); // Navigate back to the previous page
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }


    axios
      .get("/items")
      .then((res) => setItems(res.data))
      .catch((error) => {
        console.error("Error fetching items:", error);
        // Handle error (e.g., redirect to login if token is invalid)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      });
  }, [navigate]);

  return (
    <div className="p-10">
      <button onClick={goBack} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mb-4">
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">Available Items</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token"); // Also remove the token on logout
          window.location.href = "/login";
        }}
        className="bg-red-500 text-white px-3 py-1 rounded float-right"
      >
        Logout
      </button>
    </div>
  );
}