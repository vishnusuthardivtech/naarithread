import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import '../admin-new.css'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useAdminBodyClass } from '../hooks/useAdminBodyClass'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useAdminBodyClass('admin-auth')

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(email, password)
      navigate(location.state?.from || '/admin/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-shell">
      <div className="admin-login-wrap">
        <section className="admin-login-panel">
          <div>
            <span className="admin-login-eyebrow">Luxury Dashboard</span>
            <h1 className="admin-login-title">Premium control for the Naarithread admin experience.</h1>
            <p className="admin-login-subtitle">
              Review revenue, product movement, subscriber growth, and order flow in a fully isolated
              dashboard environment built specifically for the admin workspace.
            </p>

            <div className="admin-login-metrics">
              <div className="admin-login-metric">
                <span className="admin-login-metric-value">Revenue</span>
                <span className="admin-login-metric-label">Daily performance pulse</span>
              </div>
              <div className="admin-login-metric">
                <span className="admin-login-metric-value">Orders</span>
                <span className="admin-login-metric-label">Live fulfillment visibility</span>
              </div>
              <div className="admin-login-metric">
                <span className="admin-login-metric-value">Catalog</span>
                <span className="admin-login-metric-label">Inventory and product edits</span>
              </div>
            </div>
          </div>

          <div className="admin-login-credentials">
            Access is restricted to authorized admins only. Session persistence uses local storage and
            protected routing before any admin page is rendered.
          </div>
        </section>

        <section className="admin-login-card">
          <div className="admin-login-brand">
            <div className="admin-login-brand-mark">NT</div>
            <div>
              <h2 className="admin-login-card-title">Naarithread Admin</h2>
              <p className="admin-login-card-copy">Sign in to continue to the protected dashboard.</p>
            </div>
          </div>

          <form className="admin-login-form" onSubmit={handleSubmit}>
            {error ? <div className="admin-login-error">{error}</div> : null}

            <div>
              <label className="admin-label" htmlFor="admin-email">
                Admin Email
              </label>
              <input
                id="admin-email"
                className="admin-input"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="admin-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                className="admin-input"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="admin-btn admin-btn-primary admin-btn-lg" disabled={loading}>
              {loading ? 'Signing In...' : 'Login to Dashboard'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
