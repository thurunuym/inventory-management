import { useEffect, useState } from "react";
import API from "../api/axios";
import AddUser from "../components/AddUser";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    const res = await API.get("/users/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          + Add New User
        </button>
      </div>

      {showForm && (
        <div className="mb-6">
          <AddUser
            onSuccess={() => {
              setShowForm(false);
              fetchUsers();
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">

          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Username</th>
              <th className="p-4 font-semibold">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">{user.id}</td>
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4 text-gray-600">{user.role}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Users;