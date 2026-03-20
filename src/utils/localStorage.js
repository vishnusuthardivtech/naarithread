const STORAGE_EVENT = 'nt-storage-change'

const dispatchStorageChange = (key) => {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: { key } }))
}

export function getData(key, fallback) {
  if (typeof window === 'undefined' || !key) {
    return fallback
  }

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function setData(key, value) {
  if (typeof window === 'undefined' || !key) {
    return
  }

  window.localStorage.setItem(key, JSON.stringify(value))
  dispatchStorageChange(key)
}

export function removeData(key) {
  if (typeof window === 'undefined' || !key) {
    return
  }

  window.localStorage.removeItem(key)
  dispatchStorageChange(key)
}

export function subscribeToStorage(key, callback) {
  if (typeof window === 'undefined' || !key) {
    return () => {}
  }

  const handleStorage = (event) => {
    if (!event.key || event.key === key) {
      callback()
    }
  }

  const handleCustomStorage = (event) => {
    if (event.detail?.key === key) {
      callback()
    }
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(STORAGE_EVENT, handleCustomStorage)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(STORAGE_EVENT, handleCustomStorage)
  }
}
