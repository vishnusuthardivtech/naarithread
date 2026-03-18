export default function LoadingState({ label = 'Loading admin data...' }) {
  return (
    <div className="admin-panel flex min-h-[220px] flex-col items-center justify-center gap-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  )
}
