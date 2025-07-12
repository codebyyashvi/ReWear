import React from "react";
import { Link } from "react-router-dom";

export default function ItemCard({ item }) {
  return (
    <div className="border p-4 shadow rounded">
      <img src={item.image_url} className="w-full h-40 object-cover" />
      <h3 className="text-lg font-bold">{item.title}</h3>
      <p>{item.size} | {item.condition}</p>
      <Link to={`/item/${item._id}`} className="text-blue-500">View Details</Link>
    </div>
  );
}