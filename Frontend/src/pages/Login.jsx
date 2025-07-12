import React, { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.access_token); // Store the token
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display an error message)
    }
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h2 className="text-2xl font-bold">Login</h2>
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
        onClick={handleLogin}
        className="bg-green-500 text-white px-4 py-2"
      >
        Login
      </button>
      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-500 underline">
          Sign up here
        </Link>
      </p>
    </div>
  );
}