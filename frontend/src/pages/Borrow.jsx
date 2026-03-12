import React, { useState, useEffect } from 'react';
import API from '../api/axios';

const BorrowItem = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items", err);
    }
  };

  const handleBorrow = async (e) => {
    e.preventDefault();
    if (!selectedItem) return alert("Please select an item first");

    setLoading(true);
    try {
      await API.post('/borrow', {
        item_id: selectedItem.id,
        ...formData
      });
      alert("Item borrowed successfully!");
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
    <div className="flex h-[calc(100-vh-64px)] overflow-hidden bg-gray-100 p-6 gap-6">
      
      <div className="w-1/2 bg-white rounded-xl shadow-md flex flex-col">
        <div className="p-4 border-b bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-800">Select Item to Borrow</h2>
          <p className="text-sm text-gray-500">Only "In-Store" items can be selected</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.map((item) => {
            const isAvailable = item.status === 'In-Store' && item.quantity > 0;
            const isSelected = selectedItem?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => isAvailable && setSelectedItem(item)}
                className={`p-4 border-2 rounded-lg transition-all cursor-pointer 
                  ${!isAvailable ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200' : 
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-300 bg-white shadow-sm'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">{item.code}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>📍 {item.cupboard_name} {'>'} {item.place_name}</span>
                  <span className="font-semibold">Stock: {item.quantity}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-1/2 bg-white rounded-xl shadow-md p-8 flex flex-col justify-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Borrowing Form</h2>
        
        {!selectedItem ? (
          <div className="text-center text-gray-400 py-20 border-2 border-dashed rounded-xl">
            <p className="text-4xl mb-4">⬅️</p>
            <p>Select an available item from the list to continue</p>
          </div>
        ) : (
          <form onSubmit={handleBorrow} className="space-y-5">
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-600 font-semibold uppercase">Selected Item</p>
              <p className="text-lg font-bold text-blue-900">{selectedItem.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Name</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter full name"
                value={formData.borrower_name}
                onChange={(e) => setFormData({...formData, borrower_name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
              <input
                type="text"
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Phone or Email"
                value={formData.contact_details}
                onChange={(e) => setFormData({...formData, contact_details: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.quantity}
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.qty}
                  onChange={(e) => setFormData({...formData, qty: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return</label>
                <input
                  type="date"
                  required
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.return_date}
                  onChange={(e) => setFormData({...formData, return_date: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white shadow-lg transition-all
                ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}
              `}
            >
              {loading ? 'Processing...' : `Confirm Borrowing`}
            </button>
            
            <button 
              type="button" 
              onClick={() => setSelectedItem(null)}
              className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Cancel Selection
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BorrowItem;