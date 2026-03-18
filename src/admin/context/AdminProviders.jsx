import { AdminAuthProvider } from './AdminAuthContext'
import { AdminToastProvider } from './AdminToastContext'

export function AdminProviders({ children }) {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>{children}</AdminToastProvider>
    </AdminAuthProvider>
  )
}
