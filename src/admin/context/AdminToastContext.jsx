import { createContext, useContext, useMemo, useState } from 'react'

const AdminToastContext = createContext(null)

export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const pushToast = ({ title, description = '', tone = 'success' }) => {
    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    const toast = { id, title, description, tone }
    setToasts((current) => [...current, toast])
    window.setTimeout(() => dismissToast(id), 3200)
  }

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      dismissToast,
    }),
    [toasts],
  )

  return <AdminToastContext.Provider value={value}>{children}</AdminToastContext.Provider>
}

export function useAdminToastContext() {
  const context = useContext(AdminToastContext)
  if (!context) {
    throw new Error('useAdminToastContext must be used within AdminToastProvider')
  }

  return context
}
