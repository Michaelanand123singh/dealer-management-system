"use client";
import React, { useState } from "react";

interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const InventoryScreen: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: "Product 1", quantity: 10, price: 99.99 },
    { id: 2, name: "Product 2", quantity: 15, price: 149.99 },
    { id: 3, name: "Product 3", quantity: 5, price: 199.99 },
  ]);

  return (
    <div className="p-4">
    <div className="flex flex-row justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">Inventory List</h1>
    <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">
      New Inventory
    </button>
    </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">${item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryScreen;
