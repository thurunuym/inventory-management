import React from "react";
import { useNavigate } from "react-router-dom";
import { PermissionGate } from "../components/PermissionGate";
import {
  Box,
  Users,
  ExternalLink,
  RefreshCcw,
  Shield,
  BarChart3,
  Layers
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const ActionCard = ({ title, desc, icon: Icon, onClick, accentColor, size, titleSize = "text-lg" }) => (
    <button
      onClick={onClick}
      className="group relative overflow-hidden p-[1px] rounded-2xl bg-slate-700 hover:bg-gradient-to-br transition-all duration-300 shadow-lg h-full w-full"
      style={{ backgroundImage: `linear-gradient(to bottom right, #334155, ${accentColor}88)` }} // Added transparency to accent
    >
      <div className="bg-slate-800 rounded-[14px] h-full w-full group-hover:bg-slate-700/90 transition-colors flex flex-col p-5 pb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-slate-900/50 rounded-lg text-white group-hover:scale-110 transition-transform border border-slate-700">
            <Icon size={size} style={{ color: accentColor }} />
          </div>

          <ExternalLink
            size={16}
            className="text-slate-500 group-hover:text-slate-300 transition-colors"
          />
        </div>

        <h3 className={`${titleSize} font-bold text-white mb-2 tracking-tight`}>
          {title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </button>
  );

  return (
    
    <div className="min-h-screen bg-slate-900 text-slate-200 p-6 lg:p-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Inventory <span className="text-indigo-400">Management System</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium">Enterprise Asset Control & Tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          
          <div className="lg:col-span-2 h-full">
            <ActionCard
              title="Inventory"
              desc="Comprehensive asset tracking and real-time inventory updates."
              titleSize="text-3xl"
              icon={Box}
              size={28}
              accentColor="#60a5fa" 
              onClick={() => navigate("/inventory")}
            />
          </div>

          <div className="h-full">
            <PermissionGate permission="user.manage">
              <ActionCard
                title="Users"
                desc="system-wide user details."
                icon={Users}
                titleSize="text-3xl"
                size={28}
                accentColor="#a78bfa" 
                onClick={() => navigate("/users")}
              />
            </PermissionGate>
          </div>

          <div className="grid grid-rows-2 gap-6 h-full">
            <ActionCard
              title="Borrowing"
              desc="Assign items and track returns."
              icon={ExternalLink}
              size={18}
              accentColor="#34d399" 
              onClick={() => navigate("/borrow")}
            />

            <ActionCard
              title="Returns"
              desc="Process incoming equipment."
              icon={RefreshCcw}
              size={18}
              accentColor="#fbbf24" 
              onClick={() => navigate("/return")}
            />
          </div>
        </div>

        <PermissionGate permission="audit.view">
          <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm rounded-3xl p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Shield className="text-indigo-400" size={24} />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Security & Auditing
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => navigate("/audit-logs")}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 transition-all shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 rounded-xl text-indigo-400 group-hover:text-white transition-colors">
                    <BarChart3 size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-100">Activity Logs</div>
                    <p className="text-xs text-slate-400 font-medium">Monitor system-wide events</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  →
                </div>
              </button>

              <button
                onClick={() => navigate("/borrowing-logs")}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 transition-all shadow-md group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-900 rounded-xl text-emerald-400 group-hover:text-white transition-colors">
                    <Layers size={20} />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-100">Borrowing Logs</div>
                    <p className="text-xs text-slate-400 font-medium">Track item movement trends</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  →
                </div>
              </button>
            </div>
          </div>
        </PermissionGate>
      </div>
    </div>
  );
};

export default Home;