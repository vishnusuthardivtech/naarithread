import { useAdminAuth } from '../hooks/useAdminAuth'

export default function AdminTopbar({ title, onMenuToggle }) {
  const { adminUser } = useAdminAuth()

  return (
    <header className="sticky top-0 z-30 mb-6 flex items-center justify-between rounded-3xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button type="button" className="admin-button-secondary md:hidden" onClick={onMenuToggle}>
          Menu
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Admin</p>
          <h1 className="text-xl font-semibold text-slate-950">{title}</h1>
        </div>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-slate-950">{adminUser?.username ?? 'admin'}</p>
        <p className="text-xs text-slate-500">Fixed admin session</p>
      </div>
    </header>
  )
}
