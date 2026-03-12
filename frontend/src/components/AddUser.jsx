import { useState } from "react";
import API from "../api/axios";

const AddUser = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/users", {
      username,
      password,
      role_id: roleId,
    });

    setUsername("");
    setPassword("");
    setRoleId("");

    onSuccess();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">

      <h3 className="text-lg font-semibold mb-4">Create New User</h3>

      <form onSubmit={handleSubmit} className="grid gap-4">

        <input
          type="text"
          placeholder="Username"
          className="border p-2 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

    
        <select
          className="border p-2 rounded"
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="1">Admin</option>
          <option value="2">Staff</option>
        </select>

        <button
          type="submit"
          className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Create User
        </button>

      </form>

    </div>
  );
};

export default AddUser;