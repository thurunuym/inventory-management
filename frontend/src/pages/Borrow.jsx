import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Search, 
  User, 
  Phone, 
  Calendar, 
  Package, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  MapPin,
  Box
} from 'lucide-react';

const BorrowItem = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    borrower_name: '',
    contact_details: '',
    qty: 1,
    return_date: ''
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get('/inventory/items');
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching items", err);
      setItems([]);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    setLoading(true);
    try {
      await API.post('/borrow', {
        item_id: selectedItem.id,
        ...formData
      });
      alert("Transaction Recorded Successfully");
      setSelectedItem(null);
      setFormData({ borrower_name: '', contact_details: '', qty: 1, return_date: '' });
      fetchItems();
    } catch (err) {
      alert(err.response?.data?.error || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-50 overflow-hidden">
      {/* LEFT: Inventory Selection */}
      <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Inventory Selection</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by item name or code..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredItems.map((item) => {
            const isAvailable = item.status === 'In-Store' && item.quantity > 0;
            const isSelected = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => isAvailable && setSelectedItem(item)}
                className={`group p-4 rounded-xl border-2 transition-all cursor-pointer 
                  ${!isAvailable ? 'opacity-50 cursor-not-allowed grayscale' : 
                    isSelected ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' : 'border-slate-100 hover:border-slate-300 bg-white shadow-sm'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      <Package size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{item.name}</h4>
                      <p className="text-xs font-mono text-slate-400">{item.code}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {item.status}
                  </span>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-slate-500">
                    <MapPin size={14} />
                    <span>{item.cupboard_name} • {item.place_name}</span>
                  </div>
                  <div className="font-medium text-slate-700">
                    Stock: <span className={item.quantity < 5 ? 'text-orange-600' : ''}>{item.quantity}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Borrowing Form */}
      <div className="w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
        {!selectedItem ? (
          <div className="text-center max-w-sm mx-auto">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Box size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Borrow?</h3>
            <p className="text-slate-500">Please select an available item from the left panel to begin the transaction.</p>
          </div>
        ) : (
          <div className="max-w-md mx-auto w-full">
            <header className="mb-8">
              <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-2">
                <CheckCircle2 size={16} /> Item Selected
              </div>
              <h2 className="text-3xl font-black text-slate-900 leading-tight">Borrowing Request</h2>
              <div className="mt-4 p-4 bg-indigo-900 text-white rounded-xl flex justify-between items-center shadow-lg shadow-indigo-200">
                <div>
                  <p className="text-indigo-300 text-xs uppercase font-bold tracking-widest">Selected Unit</p>
                  <p className="font-bold text-lg">{selectedItem.name}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-xs bg-indigo-800 hover:bg-indigo-700 px-2 py-1 rounded">Change</button>
              </div>
            </header>

            <form onSubmit={handleBorrow} className="space-y-5">
              <div className="space-y-4">
                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="John Doe"
                      value={formData.borrower_name}
                      onChange={(e) => setFormData({...formData, borrower_name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Contact Information</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="Email or Phone Number"
                      value={formData.contact_details}
                      onChange={(e) => setFormData({...formData, contact_details: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      max={selectedItem.quantity}
                      required
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.qty}
                      onChange={(e) => setFormData({...formData, qty: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Return Due Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        value={formData.return_date}
                        onChange={(e) => setFormData({...formData, return_date: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95
                  ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}
                `}
              >
                {loading ? 'Processing...' : (
                  <>
                    Complete Transaction <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowItem;