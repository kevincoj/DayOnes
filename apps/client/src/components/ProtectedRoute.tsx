import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// "children" is whatever component is nested inside <ProtectedRoute>
// In our case that will be <HomePage /> or any other protected page
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()

  // If there's no logged-in user, redirect to login
  // "replace" means it replaces the history entry so the back button
  // doesn't bring them back to the protected page
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Otherwise render the page they were trying to visit
  return <>{children}</>
}