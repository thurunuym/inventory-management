import { useEffect, useState } from "react";
import API from "../api/axios";
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Loader2, 
  Save, 
  Tag, 
  Hash, 
  Info 
} from "lucide-react";

const AddItem = ({ onSuccess }) => {
  const [storage, setStorage] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const [form, setForm] = useState({
    name: "", code: "", quantity: 1, cupboard_id: "",
    place_id: "", status: "In-Store", description: "", image_url: "",
  });

  useEffect(() => { fetchStorage(); }, []);

  const fetchStorage = async () => {
    try {
      const res = await API.get("/inventory/storage");
      setStorage(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Storage load failed", err);
      setStorage([]);
    }
  };

  const handleCupboardChange = (e) => {
    const cupboardId = e.target.value;
    setForm({ ...form, cupboard_id: cupboardId, place_id: "" });
    const selected = storage.find((c) => c.id == cupboardId);
    setPlaces(selected ? selected.places : []);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    setImagePreview(URL.createObjectURL(file));
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await API.post("/inventory/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm(prev => ({ ...prev, image_url: res.data.image_url }));
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/inventory/items", form);
      onSuccess();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 text-slate-100 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Tag className="text-indigo-400" size={20} /> Register New Asset
        </h2>
      </div>

      <form onSubmit={submitForm} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Item Name</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input name="name" value={form.name} onChange={handleChange} required
                  className="w-full bg-slate-900 border-slate-700 rounded-lg pl-10 text-white focus:ring-indigo-500" 
                  placeholder="e.g. Oscilloscope" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Serial / Code</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input name="code" value={form.code} onChange={handleChange} required
                  className="w-full bg-slate-900 border-slate-700 rounded-lg pl-10 text-white focus:ring-indigo-500" 
                  placeholder="UI-990-22" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Quantity</label>
                <input type="number" name="quantity" value={form.quantity} min="1" onChange={handleChange}
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-white focus:ring-indigo-500" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Status</label>
                <select name="status" value={form.status} onChange={handleChange}
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-white focus:ring-indigo-500">
                  <option value="In-Store">In-Store</option>
                  <option value="Borrowed">Borrowed</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Missing">Missing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Cupboard</label>
                <select value={form.cupboard_id} onChange={handleCupboardChange}
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-white focus:ring-indigo-500">
                  <option value="">Select</option>
                  {storage.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Shelf/Place</label>
                <select name="place_id" value={form.place_id} onChange={handleChange} disabled={!places.length}
                  className="w-full bg-slate-900 border-slate-700 rounded-lg text-white focus:ring-indigo-500 disabled:opacity-50">
                  <option value="">Select</option>
                  {places.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Product Visual</label>
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleImageUpload(e.dataTransfer.files[0]); }}
              className={`relative border-2 border-dashed rounded-xl h-48 flex flex-col items-center justify-center transition-all ${
                dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {imagePreview ? (
                <div className="relative w-full h-full p-2">
                  <img src={imagePreview} className="w-full h-full object-contain rounded-lg" alt="Preview" />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center rounded-lg">
                      <Loader2 className="animate-spin text-indigo-400" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-4 pointer-events-none">
                  <Upload className="mx-auto text-slate-600 mb-2" size={32} />
                  <p className="text-sm text-slate-400">Drag image here or click to browse</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3"
                className="w-full bg-slate-900 border-slate-700 rounded-lg text-white focus:ring-indigo-500" 
                placeholder="Technical specifications or condition notes..." />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading || uploadingImage}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {loading ? "Registering..." : "Confirm Item Registration"}
        </button>
      </form>
    </div>
  );
};

export default AddItem;