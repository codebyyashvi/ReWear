import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
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
  }, [navigate]);

  useEffect(() => {
    axios.get(`/items/${id}`).then((res) => setItem(res.data));
  }, [id]);

  const handleSwap = () => {
    alert("🎉 Swap request sent successfully!");
  };

  const handleRedeem = () => {
    alert("✅ Item redeemed using your points!");
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <button onClick={goBack} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mb-4">
        Back
      </button>
      <img src={item.image_url} className="w-full max-w-md" />
      <h2 className="text-3xl font-bold">{item.title}</h2>
      <p>{item.description}</p>
      <p>
        <b>Size:</b> {item.size}
      </p>
      <p>
        <b>Condition:</b> {item.condition}
      </p>
      <div className="mt-4 space-x-4">
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
    </div>
  );
}