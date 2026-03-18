import { NavLink } from 'react-router-dom'
import { logoPath } from '../../data/site'
import { useAdminAuth } from '../hooks/useAdminAuth'

const navigationItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
]

export default function AdminSidebar({ open, onClose }) {
  const { logout } = useAdminAuth()

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/55 transition md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 px-5 py-6 text-slate-100 shadow-2xl transition md:sticky md:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <img src={logoPath} alt="Naarithread" className="h-12 w-12 rounded-2xl bg-white/5 object-contain p-2" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-300">Naarithread</p>
            <h2 className="text-lg font-semibold">Admin System</h2>
          </div>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-white text-slate-950' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="admin-button rounded-2xl bg-white/10 text-white hover:bg-white/20" onClick={logout}>
          Logout
        </button>
      </aside>
    </>
  )
}
