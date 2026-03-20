import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { logoPath } from '../../data/site'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useAdminBodyClass } from '../hooks/useAdminBodyClass'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useAdminBodyClass('admin-auth')

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate(location.state?.from || '/admin/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Invalid admin email or password')
    }
  }

  return (
    <div className="login-card">
      <img src={logoPath} className="admin-logo" alt="Naarithread" />

      <h2>Admin Panel</h2>
      <p className="sub">Sign in to manage Naarithread</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
        />

        {error ? <p className="login-error">{error}</p> : null}

        <button type="submit">Login as Admin</button>
      </form>
    </div>
  )
}
