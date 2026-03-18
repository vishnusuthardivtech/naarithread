import { readStorage, removeStorage, writeStorage } from '../../utils/storage'

export const ADMIN_AUTH_STORAGE_KEY = 'ntAdminSession'
export const ADMIN_PRODUCTS_STORAGE_KEY = 'ntAdminProducts'
export const ADMIN_STORAGE_EVENT = 'nt-admin-storage'

export function readAdminStorage(key, fallback) {
  return readStorage(key, fallback)
}

export function hasAdminStorageKey(key) {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(key) !== null
}

export function emitAdminStorage(channel) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(
    new CustomEvent(ADMIN_STORAGE_EVENT, {
      detail: {
        channel,
        at: Date.now(),
      },
    }),
  )
}

export function writeAdminStorage(key, value, channel = key) {
  writeStorage(key, value)
  emitAdminStorage(channel)
}

export function removeAdminStorage(key, channel = key) {
  removeStorage(key)
  emitAdminStorage(channel)
}

export function getAllLocalStorageEntries() {
  if (typeof window === 'undefined') {
    return []
  }

  return Array.from({ length: window.localStorage.length }, (_, index) => {
    const key = window.localStorage.key(index)
    return key ? [key, window.localStorage.getItem(key)] : null
  }).filter(Boolean)
}

export function subscribeAdminStorage(listener) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (event) => listener(event.key ?? 'storage')
  const handleAdminStorage = (event) => listener(event.detail?.channel ?? ADMIN_STORAGE_EVENT)

  window.addEventListener('storage', handleStorage)
  window.addEventListener(ADMIN_STORAGE_EVENT, handleAdminStorage)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(ADMIN_STORAGE_EVENT, handleAdminStorage)
  }
}

export function createAdminId(prefix) {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)

  return `${prefix}_${Date.now()}_${randomPart}`
}
