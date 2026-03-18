import { useCallback, useEffect, useState } from 'react'
import { subscribeAdminStorage } from '../api/storage'

export function useAdminCollection(getItems, dependencies = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const result = await getItems()
      setData(Array.isArray(result) ? result : [])
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load data')
    } finally {
      setLoading(false)
    }
  }, [getItems, ...dependencies])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    const unsubscribe = subscribeAdminStorage(() => {
      load()
    })

    const handleFocus = () => {
      load()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      unsubscribe()
      window.removeEventListener('focus', handleFocus)
    }
  }, [load])

  return {
    data,
    setData,
    loading,
    error,
    reload: load,
  }
}
