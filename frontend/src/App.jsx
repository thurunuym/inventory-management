import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Inventory from './pages/Inventory'
import AuditLogs from './pages/AuditLog'
import BorrowingLogs from './pages/BorrowLog'
import Header from './components/Header'
import BorrowItem from './pages/Borrow'
import ReturnItem from './pages/Return'
import Users from './pages/Users'
import { useAuth } from './context/AuthContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <>
      {user && <Header />}
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

        <Route path="/borrow" 
               element={user ? <BorrowItem /> : <Navigate to="/login" />}
        />

        <Route path="/return" 
               element={user ? <ReturnItem /> : <Navigate to="/login" />}
        />

        <Route path="/users" 
               element={user ? <Users /> : <Navigate to="/login" />}
        />




      </Routes>
    </>
  )
}

export default App