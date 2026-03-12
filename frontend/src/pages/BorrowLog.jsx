import { useEffect, useState } from "react";
import API from "../api/axios";

const BorrowLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/borrowing");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Borrowing Records</h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Borrower</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Borrow Date</th>
              <th className="p-3">Expected Return</th>
              <th className="p-3 text-center">Returned</th>
            </tr>
          </thead>

          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {log.item_name}
                </td>

                <td className="p-3">
                  {log.borrower_name}
                </td>

                <td className="p-3 text-gray-600">
                  {log.contact_details}
                </td>

                <td className="p-3 font-semibold">
                  {log.quantity_borrowed}
                </td>

                <td className="p-3">
                  {new Date(log.borrow_date).toLocaleString()}
                </td>

                <td className="p-3">
                  {log.expected_return_date
                    ? new Date(log.expected_return_date).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3 text-center">
                  {log.is_returned ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                      Returned
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                      Borrowed
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BorrowLog;