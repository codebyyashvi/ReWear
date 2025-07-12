import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Correct: use `id` from useParams()
    axios
      .get(`/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => setItem(res.data))
      .catch((err) => {
        console.error("Failed to fetch item:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      });
  }, [id, navigate]);

  const handleSwap = () => {
    alert("🎉 Swap request sent successfully!");
  };

  const handleRedeem = () => {
    alert("✅ Item redeemed using your points!");
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <button
        onClick={goBack}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded mb-4"
      >
        Back
      </button>
      <img src={item.image_url} alt={item.title} className="w-full max-w-md" />
      <h2 className="text-3xl font-bold">{item.title}</h2>
      <p>{item.description}</p>
      <p>
        <b>Size:</b> {item.size}
      </p>
      <p>
        <b>Condition:</b> {item.condition}
      </p>
      <div className="mt-4 space-x-4">
        <button
          onClick={handleSwap}
          className="bg-purple-500 text-white px-4 py-2"
        >
          Swap Request
        </button>
        <button
          onClick={handleRedeem}
          className="bg-orange-500 text-white px-4 py-2"
        >
          Redeem via Points
        </button>
      </div>
    </div>
  );
}
