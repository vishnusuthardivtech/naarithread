import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { logoPath } from '../../data/site'
import { useAdminAuth } from '../hooks/useAdminAuth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, login } = useAdminAuth()
  const [form, setForm] = useState({ username: 'admin', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(form.username, form.password)
      navigate(location.state?.from || '/admin/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to login')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-shell flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-admin md:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-slate-950 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Naarithread Admin</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight">Dynamic React admin dashboard for products, orders, and users.</h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-slate-300">
              Fixed admin authentication, live dashboard metrics, service-backed CRUD, and localStorage persistence inside the
              existing React app.
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Access</p>
            <p className="mt-3 text-lg font-semibold">Username: admin</p>
            <p className="mt-1 text-sm text-slate-300">Password is fixed in code as requested.</p>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <img src={logoPath} alt="Naarithread" className="h-14 w-14 rounded-2xl border border-slate-200 bg-slate-50 p-2" />
          <h2 className="mt-8 text-3xl font-semibold text-slate-950">Admin Login</h2>
          <p className="mt-2 text-sm text-slate-500">Use the fixed admin credentials to access protected admin routes.</p>

          <form className="mt-8 space-y-5" onSubmit={submit}>
            <div>
              <label className="admin-label" htmlFor="admin-username">
                Username
              </label>
              <input
                id="admin-username"
                className="admin-input"
                value={form.username}
                onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                autoComplete="username"
              />
            </div>

            <div>
              <label className="admin-label" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                className="admin-input"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                autoComplete="current-password"
              />
            </div>

            {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}

            <button type="submit" className="admin-button-primary w-full" disabled={submitting}>
              {submitting ? 'Checking credentials...' : 'Login to Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
