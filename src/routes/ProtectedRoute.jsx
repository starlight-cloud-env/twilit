import { useAuth } from '../context/AuthContext.jsx'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Wait for auth state to resolve before making any redirect decisions
  if (loading) return null

  // If not signed in, redirect to sign-in and remember where they were trying to go
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }

  return children
}