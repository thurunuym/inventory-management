import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
    <header className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <h1 className="text-xl font-bold">Inventory Management System</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{user.username}</span>
          <button 
            className="px-4 py-2 text-sm font-medium bg-slate-700 hover:bg-slate-600 rounded-md transition-colors" 
            onClick={() => navigate('/home')}
          >
            Back
          </button>
          <button 
            className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-md transition-colors" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}