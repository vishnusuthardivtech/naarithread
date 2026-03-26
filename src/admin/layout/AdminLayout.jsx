import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import '../admin-new.css'
import { useAdminBodyClass } from '../hooks/useAdminBodyClass'
import { AdminPageSearchProvider } from '../context/AdminPageSearchContext'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useAdminBodyClass('admin-body')

  return (
    <div className="admin-root">
      <AdminPageSearchProvider>
        <div className="admin-layout">
          <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <button
            type="button"
            className={`sidebar-overlay${sidebarOpen ? ' show' : ''}`}
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="admin-main">
            <AdminTopbar onMenuToggle={() => setSidebarOpen((value) => !value)} />
            <main className="admin-content">
              <Outlet />
            </main>
          </div>
        </div>
      </AdminPageSearchProvider>
    </div>
  )
}
