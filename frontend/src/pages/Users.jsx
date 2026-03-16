import { useEffect, useState } from "react";
import API from "../api/axios";
import AddUser from "../components/AddUser";
import { 
  Users as UsersIcon, 
  UserPlus, 
  ShieldCheck, 
  User, 
  Search,
  X 
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching users", err);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <UsersIcon className="text-indigo-400" size={32} /> 
              Team Members
            </h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Manage system access and account roles</p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-900/20"
          >
            <UserPlus size={20} /> Add Member
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input 
            type="text" 
            placeholder="Search by username or role..."
            className="w-full bg-slate-800 border border-slate-700 text-white pl-12 pr-4 py-3 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md">
              <button 
                onClick={() => setShowForm(false)}
                className="absolute -top-12 right-0 text-slate-400 hover:text-white flex items-center gap-2 font-semibold"
              >
                Close <X size={20} />
              </button>
              <AddUser
                onSuccess={() => {
                  setShowForm(false);
                  fetchUsers();
                }}
              />
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">User Profile</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Account ID</th>
                <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <User size={20} />
                      </div>
                      <span className="font-bold text-white text-lg">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className="font-mono text-slate-500 text-sm">#{user.id.toString().padStart(4, '0')}</span>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
                      user.role.toLowerCase() === 'admin' 
                        ? 'bg-rose-500/10 text-rose-400 ring-1 ring-inset ring-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20'
                    }`}>
                      <ShieldCheck size={14} />
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="p-20 text-center text-slate-500 italic">
              No team members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;