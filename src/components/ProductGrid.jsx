import ProductCard from './ProductCard'

export default function ProductGrid({ products = [], cardClassName = 'product-card', showRating = false, showNewBadge = false }) {
  if (!products.length) {
    return <div className="product-grid-empty">No products found matching your filters</div>
  }

  return (
      <div className="lehenga-grid products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} className={cardClassName} showRating={showRating} showNewBadge={showNewBadge} />
      ))}
    </div>
  )
}
