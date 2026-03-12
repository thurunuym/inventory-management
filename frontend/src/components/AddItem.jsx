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
    description: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
      place_id: "",
    });

    const selectedCupboard = storage.find((c) => c.id == cupboardId);

    if (selectedCupboard) {
      setPlaces(selectedCupboard.places);
    } else {
      setPlaces([]);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await API.post("/inventory/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({ ...form, image_url: res.data.image_url });
    } catch (err) {
      alert("Image upload failed");
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
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
        description: form.description,
        image_url: form.image_url,
      });

      alert("Item created");

      setForm({
        name: "",
        code: "",
        quantity: 1,
        place_id: "",
        status: "In-Store",
        description: "",
        image_url: "",
      });

      setImagePreview(null);
      setImageFile(null);
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

        <div>
          <label className="block text-sm font-semibold mb-1">Cupboard</label>
          <select
            value={form.cupboard_id}
            onChange={handleCupboardChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Cupboard</option>
            {storage.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

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
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

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

        <div>
          <label className="block text-sm font-semibold mb-2">Item Image</label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <input
              type="file"
              id="image-input"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
            <label htmlFor="image-input" className="cursor-pointer block">
              {imagePreview ? (
                <div className="space-y-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-40 mx-auto rounded"
                  />
                  <p className="text-sm text-gray-600">
                    {uploadingImage ? "Uploading..." : "Click to change image"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <p className="text-lg font-semibold text-gray-700">
                    📁 Drag and drop your image here
                  </p>
                  <p className="text-sm text-gray-500">
                    or click to select a file
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

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
