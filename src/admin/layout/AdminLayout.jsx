import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'
import { useAdminBodyClass } from '../hooks/useAdminBodyClass'
import { useState } from 'react'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useAdminBodyClass('admin-body')

  return (
    <>
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={`sidebar-overlay${sidebarOpen ? ' show' : ''}`} id="sidebarOverlay" onClick={() => setSidebarOpen(false)} />

      <main className="admin-main">
        <AdminTopbar onMenuToggle={() => setSidebarOpen((value) => !value)} />
        <Outlet />
      </main>
    </>
  )
}
