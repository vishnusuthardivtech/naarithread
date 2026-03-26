import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

export default function ProtectedAdminRoute({ children }) {
  const { isAuthenticated } = useAdminAuth()
  const location = useLocation()
  const isAdminRoot = location.pathname === '/admin' || location.pathname === '/admin/'

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  if (isAdminRoot) {
    return <Navigate to="/admin/login" replace state={{ from: '/admin/dashboard' }} />
  }

  return children
}
