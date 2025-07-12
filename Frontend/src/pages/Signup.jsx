import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post("/signup", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.access_token); // Store the token
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
      // Handle signup error (e.g., display an error message)
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Sign Up</h2>
      <input
        placeholder="Email"
        className="border p-2 w-full my-2"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full my-2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Register
      </button>
    </div>
  );
}