import { useAdminToast } from '../hooks/useAdminToast'

const toneStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-rose-200 bg-rose-50 text-rose-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
}

export default function AdminToastViewport() {
  const { toasts, dismissToast } = useAdminToast()

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border p-4 shadow-lg ${toneStyles[toast.tone] ?? toneStyles.info}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.description ? <p className="mt-1 text-sm opacity-80">{toast.description}</p> : null}
            </div>
            <button type="button" className="text-sm font-semibold opacity-70 hover:opacity-100" onClick={() => dismissToast(toast.id)}>
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
