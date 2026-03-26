import { createContext, useContext, useMemo, useState } from 'react'
import {
  ADMIN_AUTH_STORAGE_KEY,
  readAdminStorage,
  removeAdminStorage,
  writeAdminStorage,
} from '../api/storage'

const AdminAuthContext = createContext(null)

const FIXED_ADMIN_EMAIL = 'vishnu2005suthar@gmail.com'
const FIXED_ADMIN_PASSWORD = 'vishnu@2005'
const ADMIN_LOGIN_FLAG_KEY = 'isAdminLoggedIn'

function createSession() {
  return {
    email: FIXED_ADMIN_EMAIL,
    isAdminLoggedIn: true,
    loggedInAt: new Date().toISOString(),
  }
}

function readStoredSession() {
  const storedSession = readAdminStorage(ADMIN_AUTH_STORAGE_KEY, null)
  const legacyLoggedIn = typeof window !== 'undefined' ? window.localStorage.getItem(ADMIN_LOGIN_FLAG_KEY) === 'true' : false

  if (storedSession?.email === FIXED_ADMIN_EMAIL && storedSession?.isAdminLoggedIn !== false) {
    return {
      ...storedSession,
      isAdminLoggedIn: true,
    }
  }

  if (legacyLoggedIn) {
    return createSession()
  }

  return null
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)

  const login = async (email, password) => {
    if (email.trim().toLowerCase() !== FIXED_ADMIN_EMAIL || password !== FIXED_ADMIN_PASSWORD) {
      throw new Error('Invalid admin email or password')
    }

    const nextSession = createSession()

    writeAdminStorage(ADMIN_AUTH_STORAGE_KEY, nextSession, 'admin-auth')
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADMIN_LOGIN_FLAG_KEY, 'true')
    }
    setSession(nextSession)
    return nextSession
  }

  const logout = () => {
    removeAdminStorage(ADMIN_AUTH_STORAGE_KEY, 'admin-auth')
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(ADMIN_LOGIN_FLAG_KEY)
    }
    setSession(null)
  }

  const value = useMemo(
    () => ({
      session,
      adminUser: session,
      isAuthenticated: Boolean(session),
      login,
      logout,
      fixedEmail: FIXED_ADMIN_EMAIL,
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
