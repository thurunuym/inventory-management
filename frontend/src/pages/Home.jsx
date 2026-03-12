import { useNavigate } from "react-router-dom";
import { PermissionGate } from "../components/PermissionGate";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <button
          onClick={() => navigate("/inventory")}
          className="md:col-span-2 h-64 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all flex flex-col items-center justify-center group"
        >
          <span className="text-6xl mb-4 group-hover:scale-110 transition-transform">
            📦
          </span>
          <span className="text-2xl font-bold">Manage Inventory</span>
        </button>

        <PermissionGate permission="user.manage">
          <button
            onClick={() => navigate("/users")}
            
            className="p-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md flex items-center justify-center gap-3"
          >
            Manage Users
          </button>
        </PermissionGate>

        <div className="flex flex-col gap-6">
          <button
            onClick={() => navigate("/borrow")}
            className="h-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-colors text-xl"
          >
            Borrow Item
          </button>
          <button
            onClick={() => navigate("/return")}
            
            className="h-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-colors text-xl"
          >
            Return Item
          </button>
        </div>
      </div>

      <PermissionGate permission="audit.view">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/audit-logs")}
            className="p-6 bg-slate-700 hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center justify-center gap-3"
          >
            📜 View Audit Logs
          </button>

          <button
            onClick={() => navigate("/borrowing-logs")}
            className="p-6 bg-slate-700 hover:bg-slate-800 text-white rounded-xl shadow-md flex items-center justify-center gap-3"
          >
            🤝 Borrowing Logs
          </button>
        </div>
      </PermissionGate>
    </div>
  );
};

export default Home;
