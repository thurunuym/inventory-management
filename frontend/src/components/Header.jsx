import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, ChevronLeft, User as UserIcon } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const isDev = import.meta.env.DEV;
      const BASE_URL = isDev ? 'http://localhost:5000' : '';
      await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-slate-200 h-16 flex items-center shrink-0">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {location.pathname !== '/home' && (
            <button 
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              title="Back to Dashboard"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h1 className="text-slate-800 font-semibold hidden sm:block">
            Inventory<span className="text-slate-400 mx-2">Management System</span> 
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-slate-700">{user.username}</span>
          </div>

          <button 
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors" 
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}