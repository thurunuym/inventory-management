import { useEffect, useState } from "react";
import API from "../api/axios";
import AddItem from "../components/AddItem";
import { PermissionGate } from "../components/PermissionGate";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchItems = async () => {
    const res = await API.get("/inventory/items");
    setItems(res.data);
  };

  const handleStatusChange = async (id, newStatus) => {
    await API.patch(`/inventory/items/${id}/status`, { status: newStatus });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete this item?")) {
      await API.delete(`/inventory/items/${id}`);
      fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Inventory Items</h2>
        <PermissionGate permission="item.create">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Add New Item
          </button>{" "}
        </PermissionGate>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddItem
            onSuccess={() => {
              setShowForm(false);
              fetchItems();
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold">Image</th>
              <th className="p-4 font-semibold">Code</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Qty</th>
              <th className="p-4 font-semibold">Status</th>
              <PermissionGate permission="user.manage">
                <th className="p-4 font-semibold text-center">Admin Actions</th>
              </PermissionGate>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded border border-gray-200"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}
                </td>
                <td className="p-4 font-mono text-sm">{item.code}</td>
                <td className="p-4 font-medium">{item.name}</td>
                <td className="p-4 text-gray-600">
                  {item.cupboard_name} {">>>"} {item.place_name}
                </td>
                <td className="p-4 font-bold">{item.quantity}</td>
                <td className="p-4">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className={`text-xs font-bold rounded-full px-2 py-1 border ${getStatusColor(item.status)}`}
                  >
                    <option value="In-Store">In-Store</option>
                    <option value="Borrowed">Borrowed</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Missing">Missing</option>
                  </select>
                </td>

                <PermissionGate permission="user.manage">
                  <td className="p-4 flex justify-center gap-2">
                    {/* <button onClick={() => updateQty(item.id, 1)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">+</button>
                    <button onClick={() => updateQty(item.id, -1)} className="bg-gray-200 px-2 rounded hover:bg-gray-300">-</button> */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </PermissionGate>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "In-Store":
      return "bg-green-100 text-green-700 border-green-200";
    case "Borrowed":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Damaged":
      return "bg-red-100 text-red-700 border-red-200";
    case "Missing":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100";
  }
};

export default Inventory;
