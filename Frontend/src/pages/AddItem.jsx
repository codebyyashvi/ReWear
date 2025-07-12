import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function AddItem() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    size: "",
    condition: "",
    image_url: "",
  });
    const navigate = useNavigate();

      useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const goBack = () => {
    navigate(-1); // Navigate back to the previous page 
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/items", form);
      alert("Item listed!");
    } catch (error) {
      console.error("Error listing item:", error);
      // Handle error (e.g., display an error message)
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <button onClick={goBack} className="bg-gray-300 text-gray-700 px-4 py-2 rounded mb-4">
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">List a New Item</h2>
      {["title", "description", "size", "condition", "image_url"].map(
        (field) => (
          <input
            key={field}
            className="border p-2 w-full my-2"
            placeholder={field}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        )
      )}
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2">
        Submit
      </button>
    </div>
  );
}