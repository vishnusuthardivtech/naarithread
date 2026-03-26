import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAdminAuth } from '../hooks/useAdminAuth'
import { useAdminPageSearch } from '../context/AdminPageSearchContext'

const PAGE_META = {
  '/admin/dashboard': {
    title: 'Dashboard',
    subtitle: 'Performance, conversion, and operational snapshots for the store.',
  },
  '/admin/orders': {
    title: 'Orders',
    subtitle: 'Track fulfillment, customer activity, and order lifecycle status.',
  },
  '/admin/products': {
    title: 'Products',
    subtitle: 'Manage inventory, merchandising, and product presentation.',
  },
  '/admin/users': {
    title: 'Users',
    subtitle: 'Review customer profiles and buying behavior across the store.',
  },
  '/admin/reports': {
    title: 'Reports',
    subtitle: 'Monitor revenue trends, category performance, and fulfillment metrics.',
  },
  '/admin/subscriptions': {
    title: 'Subscribers',
    subtitle: 'Keep your email audience healthy and campaign-ready.',
  },
}

function resolvePageMeta(pathname) {
  const match = Object.entries(PAGE_META).find(([path]) => pathname.startsWith(path))
  return match ? match[1] : PAGE_META['/admin/dashboard']
}

export default function AdminTopbar({ onMenuToggle }) {
  const location = useLocation()
  const { adminUser } = useAdminAuth()
  const { getQuery, setQuery } = useAdminPageSearch()
  const [searchFocused, setSearchFocused] = useState(false)
  const pageMeta = resolvePageMeta(location.pathname)
  const query = getQuery(location.pathname)

  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-btn admin-btn-secondary admin-btn-sm"
          aria-label="Open sidebar"
          onClick={onMenuToggle}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="currentColor" d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h11v2H4v-2Z" />
          </svg>
        </button>

        <div className="admin-topbar-meta">
          <h1 className="admin-page-title">{pageMeta.title}</h1>
          <p className="admin-page-subtitle">{pageMeta.subtitle}</p>
        </div>
      </div>

      <div className="admin-topbar-right">
        <form className="admin-search-form" onSubmit={(event) => event.preventDefault()}>
          <div className="admin-search-shell">
            <span className="admin-search-icon">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path fill="currentColor" d="M10 4a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0-2a8 8 0 1 0 4.9 14.32l4.39 4.39 1.41-1.41-4.39-4.39A8 8 0 0 0 10 2Z" />
              </svg>
            </span>
            <input
              type="search"
              className="admin-search-input"
              placeholder={`Search ${pageMeta.title.toLowerCase()}`}
              aria-label={`Search ${pageMeta.title}`}
              value={query}
              onChange={(event) => setQuery(location.pathname, event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </form>

        <span className="admin-pill">{query ? `Results for "${query}"` : searchFocused ? 'Filtering This Page' : 'Live Admin'}</span>
        <div className="admin-avatar" title={adminUser?.email || 'Admin'}>
          {(adminUser?.email || 'A').charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  )
}
