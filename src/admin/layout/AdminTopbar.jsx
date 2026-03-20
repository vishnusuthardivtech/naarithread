import { useLocation } from 'react-router-dom'

function getPageTitle(pathname) {
  if (pathname.startsWith('/admin/orders')) return 'Orders'
  if (pathname.startsWith('/admin/products')) return 'Products'
  if (pathname.startsWith('/admin/users')) return 'Users'
  if (pathname.startsWith('/admin/reports')) return 'Reports'
  if (pathname.startsWith('/admin/subscriptions')) return 'Subscriptions'
  return 'Dashboard'
}

export default function AdminTopbar({ onMenuToggle }) {
  const location = useLocation()
  const pageTitle = getPageTitle(location.pathname)

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-left">
        <button type="button" className="hamburger admin-topbar-btn" onClick={onMenuToggle} aria-label="Open sidebar">
          =
        </button>
        <div className="admin-topbar-brand">
          <strong>{pageTitle}</strong>
        </div>
      </div>
    </div>
  )
}
