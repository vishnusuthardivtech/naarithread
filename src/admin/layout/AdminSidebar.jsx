import { NavLink, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M4 13h7V4H4v9Zm9 7h7V4h-7v16ZM4 20h7v-5H4v5Z" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    to: '/admin/orders',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M7 4h10l1 4h2v2h-1l-1.1 7.2A2 2 0 0 1 15.92 19H8.08a2 2 0 0 1-1.98-1.8L5 10H4V8h2l1-4Zm1.56 4h6.88l-.5-2H9.06l-.5 2ZM8 12l.6 5h6.8l.6-5H8Z" />
      </svg>
    ),
  },
  {
    label: 'Products',
    to: '/admin/products',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M12 2 3 7l9 5 9-5-9-5Zm-7 8.6 6 3.34v7.07l-6-3.33V10.6Zm8 10.4v-7.07l6-3.34v7.07L13 21Z" />
      </svg>
    ),
  },
  {
    label: 'Reviews',
    to: '/admin/reviews',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="m12 17.27 4.15 2.51-1.1-4.72 3.67-3.18-4.83-.41L12 7l-1.89 4.47-4.83.41 3.67 3.18-1.1 4.72L12 17.27Z" />
      </svg>
    ),
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M16 11a4 4 0 1 0-3.999-4A4 4 0 0 0 16 11ZM8 12a3 3 0 1 0-3-3 3 3 0 0 0 3 3Zm8 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4ZM8 14c-.29 0-.62.02-.97.05C5.08 14.23 2 15.2 2 18v2h4v-2c0-1.54.82-2.82 2.35-3.73A8.69 8.69 0 0 0 8 14Z" />
      </svg>
    ),
  },
  {
    label: 'Reports',
    to: '/admin/reports',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14.5a1.5 1.5 0 0 1-2.56 1.06L15.88 18H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 11h2V8H7v6Zm4 0h2V6h-2v8Zm4 0h2v-4h-2v4Z" />
      </svg>
    ),
  },
  {
    label: 'Subscribers',
    to: '/admin/subscriptions',
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path fill="currentColor" d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.45-.25L12 11.18l6.55-4.68H5.45Zm13.05 1.23-6.06 4.32a.75.75 0 0 1-.88 0L5.5 7.73v9.52c0 .41.34.75.75.75h11.5c.41 0 .75-.34.75-.75V7.73Z" />
      </svg>
    ),
  },
]

function SidebarLink({ item, onClose }) {
  return (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
    >
      <span className="admin-nav-icon">{item.icon}</span>
      <span className="admin-nav-label">{item.label}</span>
    </NavLink>
  )
}

export default function AdminSidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { logout, adminUser } = useAdminAuth()

  const handleLogout = () => {
    logout()
    onClose?.()
    navigate('/admin/login', { replace: true })
  }

  return (
    <aside className={`admin-sidebar${open ? ' admin-sidebar-open' : ''}`}>
      <div className="admin-sidebar-header">
        <NavLink to="/admin/dashboard" className="admin-logo" onClick={onClose}>
          <span className="admin-logo-mark">NT</span>
          <span className="admin-logo-copy">
            <span className="admin-logo-title">Naarithread</span>
            <span className="admin-logo-subtitle">Luxury Admin</span>
          </span>
        </NavLink>
      </div>

      <nav className="admin-nav">
        <div>
          <p className="admin-sidebar-section-title">Navigation</p>
          <div className="admin-nav-list">
            {NAV_ITEMS.map((item) => (
              <SidebarLink key={item.to} item={item} onClose={onClose} />
            ))}
          </div>
        </div>

        <div>
          <p className="admin-sidebar-section-title">Account</p>
          <button type="button" className="admin-nav-item" onClick={handleLogout}>
            <span className="admin-nav-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M10 17v-3H3v-4h7V7l5 5-5 5Zm6-12h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2v-2h2V7h-2V5Z" />
              </svg>
            </span>
            <span className="admin-nav-label">Logout</span>
          </button>
        </div>
      </nav>

      <div className="admin-sidebar-footer">
        <p className="admin-sidebar-footer-title">{adminUser?.email || 'Admin session'}</p>
        <p className="admin-sidebar-footer-copy">
          Secure access is active. Session state persists locally until you log out.
        </p>
      </div>
    </aside>
  )
}
