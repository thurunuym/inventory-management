import { useEffect, useState } from "react";
import API from "../api/axios";
import { PermissionGate } from "../components/PermissionGate";

const Inventory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await API.get("/inventory/items");
      setItems(res.data);
    };
    fetchItems();
  }, []);

  const handleBorrow = async (id) => {
    await API.post(`/inventory/items/${id}/quantity`);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h1>

        <PermissionGate permission="item.create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            + Add New Item
          </button>
        </PermissionGate>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Code</th>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Location (Cupboard &gt; Place)</th>
              <th className="px-6 py-3">Qty</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3">{item.code}</td>
                <td className="px-6 py-3">{item.name}</td>
                <td className="px-6 py-3">
                  {item.cupboard_name} &gt; {item.place_name}
                </td>
                <td className="px-6 py-3">{item.quantity}</td>

                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.status === "AVAILABLE"
                        ? "bg-green-100 text-green-700"
                        : item.status === "BORROWED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-6 py-3 flex gap-2">
                  <button
                    onClick={() => handleBorrow(item.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 transition"
                  >
                    Borrow
                  </button>

                  <PermissionGate permission="item.delete">
                    <button className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition">
                      Delete
                    </button>
                  </PermissionGate>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;