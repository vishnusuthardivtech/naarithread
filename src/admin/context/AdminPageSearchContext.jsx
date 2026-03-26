import { createContext, useContext, useMemo, useState } from 'react'

const AdminPageSearchContext = createContext(null)

export function AdminPageSearchProvider({ children }) {
  const [queries, setQueries] = useState({})

  const value = useMemo(
    () => ({
      getQuery(pathname) {
        return queries[pathname] || ''
      },
      setQuery(pathname, value) {
        setQueries((current) => ({
          ...current,
          [pathname]: value,
        }))
      },
    }),
    [queries],
  )

  return <AdminPageSearchContext.Provider value={value}>{children}</AdminPageSearchContext.Provider>
}

export function useAdminPageSearch() {
  const context = useContext(AdminPageSearchContext)
  if (!context) {
    throw new Error('useAdminPageSearch must be used within AdminPageSearchProvider')
  }

  return context
}
