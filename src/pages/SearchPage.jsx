import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SearchResults from '../components/SearchResults'
import { useApp } from '../context/AppContext'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { executeSearch, searchProducts } = useApp()
  const query = searchParams.get('q')?.trim() ?? ''
  const results = useMemo(() => searchProducts(query), [query, searchProducts])

  useEffect(() => {
    if (!query) {
      navigate('/', { replace: true })
      return
    }

    executeSearch(query)
  }, [query, executeSearch, navigate])

  return <SearchResults query={query} results={results} />
}
