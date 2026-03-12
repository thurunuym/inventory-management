import React, { useEffect, useState } from 'react';
import API from '../api/axios';

const ReturnItem = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await API.get('/borrowing');
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching borrowing logs", err);
    }
  };

  const handleReturn = async (recordId, itemName) => {
    if (!window.confirm(`Are you sure you want to mark "${itemName}" as returned?`)) return;

    setLoading(true);
    try {
      await API.post(`/return/${recordId}`);
      alert("Item returned and stock updated!");
      fetchRecords(); // Refresh the table
    } catch (err) {
      alert(err.response?.data?.error || "Return failed");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic for searching by borrower or item name
  const filteredRecords = records.filter(rec => 
    rec.borrower_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Return Process</h1>
          <p className="text-gray-500">Manage and track all borrowed equipment</p>
        </div>
        
        <input 
          type="text"
          placeholder="Search borrower or item..."
          className="w-full md:w-80 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Item Name</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Borrower</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider text-center">Qty</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Date Borrowed</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Expected Return</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider">Status</th>
              <th className="p-4 font-semibold uppercase text-xs tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-10 text-center text-gray-400 italic">No records found matching your search.</td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className={`${!record.is_returned ? 'bg-orange-50/30' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{record.item_name}</div>
                    <div className="text-xs text-gray-400">ID: #{record.item_id}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-gray-800 font-medium">{record.borrower_name}</div>
                    <div className="text-xs text-gray-500">{record.contact_details}</div>
                  </td>
                  <td className="p-4 text-center font-bold text-gray-700">{record.quantity_borrowed}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {new Date(record.borrow_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {record.expected_return_date ? new Date(record.expected_return_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4">
                    {record.is_returned ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        RETURNED
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">
                        OUT
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {!record.is_returned && (
                      <button
                        disabled={loading}
                        onClick={() => handleReturn(record.id, record.item_name)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-md transition-all active:scale-95 disabled:bg-gray-300"
                      >
                        {loading ? '...' : 'Return Item'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnItem;