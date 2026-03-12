import { useEffect, useState } from "react";
import API from "../api/axios";

const AuditLog = () => {

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  const limit = 10;

  const fetchLogs = async () => {
    try {

      const res = await API.get(`/audit?page=${page}&limit=${limit}`);

      setLogs(Array.isArray(res.data.data) ? res.data.data : []);
      setPagination(res.data.pagination || {});

    } catch (err) {
      console.error(err);
      setLogs([]);
      setPagination({});
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Audit Logs
      </h2>

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <table className="w-full text-left border-collapse">

          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map(log => (

              <tr key={log.id} className="border-b hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {log.username}
                </td>

                <td className="p-3">
                  {log.action}
                </td>

                <td className="p-3 text-gray-600">
                  {log.target_id}
                </td>

                <td className="p-3">
                  {new Date(log.created_at).toLocaleString()}
                </td>

              </tr>

            ))}
          </tbody>

        </table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between items-center mt-4">

        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {pagination.page} / {pagination.totalPages}
        </span>

        <button
          disabled={page === pagination.totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default AuditLog;