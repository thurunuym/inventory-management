import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Inventory from './pages/Inventory'
import { useAuth } from './context/authContext'

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  return (
    <Routes>

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/inventory" />}
      />

      <Route
        path="/inventory"
        element={user ? <Inventory /> : <Navigate to="/login" />}
      />
     
      <Route path="*" element={<Navigate to="/inventory" />} />

    </Routes>
  )
}

export default App