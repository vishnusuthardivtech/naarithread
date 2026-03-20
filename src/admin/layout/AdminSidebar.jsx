import { NavLink } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'

function SidebarLink({ to, children, onClose }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'active' : undefined)} onClick={onClose}>
      {children}
    </NavLink>
  )
}

export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAdminAuth()

  return (
    <aside className={`admin-sidebar${open ? ' show' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-brand">
          <strong>Naarithread</strong>
          <span>Dashboard</span>
        </div>
        <button type="button" className="sidebar-collapse-btn" onClick={onClose} aria-label="Close sidebar">
          x
        </button>
      </div>

      <nav className="sidebar-menu">
        <div className="sidebar-section">
          <p className="sidebar-label">General</p>
          <SidebarLink to="/admin/dashboard" onClose={onClose}>
            Dashboard
          </SidebarLink>
          <SidebarLink to="/admin/orders" onClose={onClose}>
            Orders
          </SidebarLink>
          <SidebarLink to="/admin/users" onClose={onClose}>
            Users
          </SidebarLink>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Catalog</p>
          <SidebarLink to="/admin/products" onClose={onClose}>
            Products
          </SidebarLink>
          <SidebarLink to="/admin/reports" onClose={onClose}>
            Reports
          </SidebarLink>
          <SidebarLink to="/admin/subscriptions" onClose={onClose}>
            Subscriptions
          </SidebarLink>
        </div>

        <div className="sidebar-section sidebar-support">
          <p className="sidebar-label">Support</p>
          <a
            href="#logout"
            className="logout"
            onClick={(event) => {
              event.preventDefault()
              onClose()
              logout()
            }}
          >
            Logout
          </a>
        </div>
      </nav>

      <div className="sidebar-plan-card">
        <div className="sidebar-plan-icon">NT</div>
        <div>
          <strong>Naarithread</strong>
          <span>Admin workspace</span>
        </div>
      </div>
    </aside>
  )
}
