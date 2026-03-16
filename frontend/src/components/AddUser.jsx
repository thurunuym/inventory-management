import { useState } from "react";
import API from "../api/axios";
import { User, Lock, Shield, Loader2 } from "lucide-react";

const AddUser = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users", {
        username,
        password,
        role_id: roleId,
      });
      setUsername("");
      setPassword("");
      setRoleId("");
      onSuccess();
    } catch (err) {
      alert("Failed to create user. Please check if username exists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 text-slate-100 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
      <div className="p-8 pb-4">
        <h3 className="text-2xl font-black text-white mb-2">Create Account</h3>
        <p className="text-slate-400 text-sm">Fill in the credentials to grant system access.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
        
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Username</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="e.g. j.doe"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Initial Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-widest">Access Role</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <select
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              required
            >
              <option value="">Select a role...</option>
              <option value="1">Admin (Full Control)</option>
              <option value="2">Staff (Standard Access)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-900/30 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            "Register New User"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddUser;