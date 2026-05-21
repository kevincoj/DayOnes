import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import ProtectedRoute from '../components/ProtectedRoute'

function HomePage() {
  return <h1 className="text-2xl p-8">Home Page</h1>
}

// --- The main App component ---
export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>} />

        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>

    </BrowserRouter>
  )
}