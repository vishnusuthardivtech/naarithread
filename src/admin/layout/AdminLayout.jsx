import { Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import AdminToastViewport from '../components/AdminToastViewport'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

const titleByPath = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/users': 'Users',
}

export default function AdminLayout() {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pageTitle = useMemo(() => titleByPath[location.pathname] ?? 'Admin', [location.pathname])

  return (
    <div className="admin-shell flex">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen flex-1 p-4 md:p-6">
        <AdminTopbar title={pageTitle} onMenuToggle={() => setSidebarOpen((value) => !value)} />
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </div>
      <AdminToastViewport />
    </div>
  )
}
