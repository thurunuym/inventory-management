import { useEffect, useState } from "react";
import API from "../api/axios";

const AddItem = ({ onSuccess }) => {
  const [storage, setStorage] = useState([]);
  const [places, setPlaces] = useState([]);

  const [form, setForm] = useState({
    name: "",
    code: "",
    quantity: 1,
    place_id: "",
    status: "In-Store",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStorage();
  }, []);

  const fetchStorage = async () => {
    try {
      const res = await API.get("/inventory/storage");
      setStorage(res.data);
    } catch (err) {
      console.error("Storage load failed", err);
    }
  };

  const handleCupboardChange = (e) => {
    const cupboardId = e.target.value;

    setForm({
      ...form,
      place_id: ""
    });

    const selectedCupboard = storage.find(c => c.id == cupboardId);

    if (selectedCupboard) {
      setPlaces(selectedCupboard.places);
    } else {
      setPlaces([]);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/inventory/items", {
        name: form.name,
        code: form.code,
        quantity: form.quantity,
        place_id: form.place_id,
        status: form.status,
        description: form.description
      });

      alert("Item created");

      setForm({
        name: "",
        code: "",
        quantity: 1,
        cupboard_id: "",
        place_id: "",
        status: "In-Store",
        description: ""
      });

      setPlaces([]);

      if (onSuccess) onSuccess();

    } catch (err) {
      alert(err.response?.data?.error || "Failed to create item");
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl">
      <h2 className="text-xl font-bold mb-4">Add Inventory Item</h2>

      <form onSubmit={submitForm} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Item Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Code */}
        <div>
          <label className="block text-sm font-semibold mb-1">Item Code</label>
          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-semibold mb-1">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            min="1"
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Cupboard */}
        <div>
          <label className="block text-sm font-semibold mb-1">Cupboard</label>
          <select
            value={form.cupboard_id}
            onChange={handleCupboardChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Cupboard</option>
            {storage.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Place */}
        <div>
          <label className="block text-sm font-semibold mb-1">Place</label>
          <select
            name="place_id"
            value={form.place_id}
            onChange={handleChange}
            disabled={!places.length}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Place</option>
            {places.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="In-Store">In-Store</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Damaged">Damaged</option>
            <option value="Missing">Missing</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Creating..." : "Add Item"}
        </button>

      </form>
    </div>
  );
};

export default AddItem;