import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import AuditLogs from './pages/AuditLog'
import BorrowingLogs from './pages/BorrowLog'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <Routes>

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/home" />}
      />

      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/login" />}
      />
     
      <Route path="*" element={<Navigate to="/home" />} />
      <Route path="/inventory" 
             element={user ? <Inventory /> : <Navigate to="/login" />}
      />

      <Route path="/audit-logs" 
             element={user ? <AuditLogs /> : <Navigate to="/login" />}
      />

      <Route path="/borrowing-logs" 
             element={user ? <BorrowingLogs /> : <Navigate to="/login" />}
      />




    </Routes>
  )
}

export default App