import { useEffect, useState } from "react";
import API from "../api/axios";
import AddItem from "../components/AddItem";
import { PermissionGate } from "../components/PermissionGate";
import { 
  Package, 
  Plus, 
  Trash2, 
  MapPin, 
  ChevronRight, 
  Search,
  LayoutGrid
} from "lucide-react";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchItems = async () => {
    try {
      const res = await API.get("/inventory/items");
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch items:", err);
      setItems([]);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    await API.patch(`/inventory/items/${id}/status`, { status: newStatus });
    fetchItems();
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete this item from inventory?")) {
      await API.delete(`/inventory/items/${id}`);
      fetchItems();
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Inventory Stock</h2>
            <p className="text-slate-400 text-sm font-medium">Manage and monitor all physical assets</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Quick search..."
                className="w-full bg-slate-800 border-none text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <PermissionGate permission="item.create">
              <button
                onClick={() => setShowForm(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
              >
                <Plus size={20} /> Add Item
              </button>
            </PermissionGate>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white z-10"
              >
                ✕
              </button>
              <AddItem
                onSuccess={() => {
                  setShowForm(false);
                  fetchItems();
                }}
              />
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Asset</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Details</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Stock</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <PermissionGate permission="user.manage">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </PermissionGate>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/30 transition-colors group">
                  <td className="p-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-14 w-14 object-cover rounded-xl border border-slate-600 shadow-sm"
                      />
                    ) : (
                      <div className="h-14 w-14 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center text-slate-600">
                        <Package size={24} />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-xs font-mono text-indigo-400">{item.code}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-300 text-sm">
                      <MapPin size={14} className="text-slate-500" />
                      {item.cupboard_name}
                      <ChevronRight size={12} className="text-slate-600" />
                      <span className="text-slate-400">{item.place_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-lg font-bold ${item.quantity < 5 ? 'bg-amber-500/10 text-amber-500' : 'text-slate-200'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`text-xs font-bold rounded-lg px-3 py-1.5 border-none outline-none ring-1 ring-inset ${getStatusStyles(item.status)}`}
                    >
                      <option value="In-Store">In-Store</option>
                      <option value="Borrowed">Borrowed</option>
                      <option value="Damaged">Damaged</option>
                      <option value="Missing">Missing</option>
                    </select>
                  </td>
                  <PermissionGate permission="user.manage">
                    <td className="p-4 text-right">
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </PermissionGate>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredItems.length === 0 && (
            <div className="p-20 text-center text-slate-500">
              <LayoutGrid size={48} className="mx-auto mb-4 opacity-20" />
              <p>No inventory items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusStyles = (status) => {
  switch (status) {
    case "In-Store": return "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20";
    case "Borrowed": return "bg-blue-500/10 text-blue-400 ring-blue-500/20";
    case "Damaged": return "bg-rose-500/10 text-rose-400 ring-rose-500/20";
    case "Missing": return "bg-slate-500/10 text-slate-400 ring-slate-500/20";
    default: return "bg-slate-700 text-slate-300";
  }
};

export default Inventory;