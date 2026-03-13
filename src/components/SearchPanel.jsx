import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function SearchPanel({ open, onClose }) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const { searchQuery, executeSearch } = useApp()
  const [value, setValue] = useState(searchQuery)

  useEffect(() => {
    setValue(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    if (open) {
      window.setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  const submitSearch = () => {
    const query = value.trim()
    if (!query) {
      return
    }

    executeSearch(query)
    onClose()
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className={`nav-search-panel${open ? ' active' : ''}`} id="navSearchPanel">
      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          id="navSearchInput"
          placeholder="Search lehengas, styles, colors..."
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitSearch()
            }
          }}
        />
        <button className="search-close" id="searchClose" onClick={onClose}>X</button>
      </div>
    </div>
  )
}
