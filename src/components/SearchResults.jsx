import { useState } from 'react'
import { useApp } from '../context/AppContext'
import FilterDrawer from './FilterDrawer'
import ProductGrid from './ProductGrid'

export default function SearchResults({ query, results = [] }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const { filterProducts } = useApp()
  const filteredResults = filterProducts(results, 'searchResults')

  return (
    <section className="search-results-page">
      <div className="search-results-shell">
        <FilterDrawer open={filterOpen} onOpen={() => setFilterOpen(true)} onClose={() => setFilterOpen(false)} listingKey="searchResults" />
        <div className="search-results-header">
          <h1>Search Results</h1>
          <p>
            {filteredResults.length
              ? `Showing ${filteredResults.length} result${filteredResults.length === 1 ? '' : 's'} for "${query}"`
              : `No results found for "${query}"`}
          </p>
        </div>

        {filteredResults.length ? <ProductGrid products={filteredResults} /> : <div className="search-results-empty">No results found</div>}
      </div>
    </section>
  )
}
