import { createContext, useContext, useMemo, useState } from 'react'
import {
  ADMIN_AUTH_STORAGE_KEY,
  readAdminStorage,
  removeAdminStorage,
  writeAdminStorage,
} from '../api/storage'

const AdminAuthContext = createContext(null)

const FIXED_ADMIN_USERNAME = 'admin'
const FIXED_ADMIN_PASSWORD = 'admin123'

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => readAdminStorage(ADMIN_AUTH_STORAGE_KEY, null))

  const login = async (username, password) => {
    if (username.trim() !== FIXED_ADMIN_USERNAME || password !== FIXED_ADMIN_PASSWORD) {
      throw new Error('Invalid admin credentials')
    }

    const nextSession = {
      username: FIXED_ADMIN_USERNAME,
      loggedInAt: new Date().toISOString(),
    }

    writeAdminStorage(ADMIN_AUTH_STORAGE_KEY, nextSession, 'admin-auth')
    setSession(nextSession)
    return nextSession
  }

  const logout = () => {
    removeAdminStorage(ADMIN_AUTH_STORAGE_KEY, 'admin-auth')
    setSession(null)
  }

  const value = useMemo(
    () => ({
      session,
      adminUser: session,
      isAuthenticated: Boolean(session),
      login,
      logout,
      fixedUsername: FIXED_ADMIN_USERNAME,
    }),
    [session],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuthContext() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuthContext must be used within AdminAuthProvider')
  }

  return context
}
