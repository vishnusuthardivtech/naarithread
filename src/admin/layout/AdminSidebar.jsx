import { NavLink } from 'react-router-dom'
import { logoPath } from '../../data/site'
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
        <img src={logoPath} alt="Naarithread" />
      </div>

      <nav className="sidebar-menu">
        <SidebarLink to="/admin/dashboard" onClose={onClose}>
          Dashboard
        </SidebarLink>
        <SidebarLink to="/admin/products" onClose={onClose}>
          Products
        </SidebarLink>
        <SidebarLink to="/admin/orders" onClose={onClose}>
          Orders
        </SidebarLink>
        <SidebarLink to="/admin/users" onClose={onClose}>
          Users
        </SidebarLink>
        <a href="#reports" onClick={(event) => event.preventDefault()}>
          Reports
        </a>
        <a href="#subscriptions" onClick={(event) => event.preventDefault()}>
          Subscriptions
        </a>
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
      </nav>
    </aside>
  )
}
