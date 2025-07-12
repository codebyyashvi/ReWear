
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="text-center p-10">
      <h1 className="text-4xl font-bold mb-4">👕 ReWear - Swap Your Clothes</h1>
      <p className="mb-6 text-gray-600">Give clothes a second chance. Reduce waste. Earn points.</p>

      <div className="space-x-4">
        {/* 👇 Make this smart */}
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded">Start Swapping</Link>
            <Link to="/dashboard" className="bg-green-500 text-white px-4 py-2 rounded">Browse Items</Link>
            <Link to="/add-item" className="bg-yellow-500 text-white px-4 py-2 rounded">List an Item</Link>
          </>
        ) : (
          <>
            <Link to="/signup" className="bg-blue-500 text-white px-4 py-2 rounded">Start Swapping</Link>
            <Link to="/signup" className="bg-green-500 text-white px-4 py-2 rounded">Browse Items</Link>
            <Link to="/signup" className="bg-yellow-500 text-white px-4 py-2 rounded">List an Item</Link>
          </>
        )}
      </div>
    </div>
  );
}
