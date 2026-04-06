import { useState } from 'react'
import FilterDrawer from '../components/FilterDrawer'
import ProductGrid from '../components/ProductGrid'
import { useApp } from '../context/AppContext'

export default function SharedCatalogPage({ title, subtitle, products, cardClassName, showRating, listingKey, showNewBadge = false }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const { filterProducts } = useApp()
  const filteredProducts = filterProducts(products || [], listingKey)

  return (
    <section className="featured-lehengas">
      <div className="featured-container">
        <FilterDrawer open={filterOpen} onOpen={() => setFilterOpen(true)} onClose={() => setFilterOpen(false)} listingKey={listingKey} />
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
        <ProductGrid products={filteredProducts} cardClassName={cardClassName} showRating={showRating} showNewBadge={showNewBadge} />
      </div>
    </section>
  )
}
