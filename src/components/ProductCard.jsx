import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { assetPath } from '../data/site'
import { formatPrice } from '../utils/storage'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product, className = 'product-card', showRating = false }) {
  const { addToCart } = useApp()
  const cardClassName = `${className} reveal`.replace(/\s+/g, ' ').trim()

  return (
    <div className={cardClassName}>
      <Link to={`/product?id=${product.id}`}>
        <div className="product-image">
          <img src={assetPath(product.image)} alt={product.category} />
          <div className="product-actions">
            <WishlistButton product={product} />

            <button
              className="cart-btn"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: assetPath(product.image),
                  quantity: 1,
                })
              }}
            >
              <svg viewBox="0 0 24 24" className="icon-svg">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M2 3h3l2 12h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button className="quick-view-btn" onClick={(event) => event.preventDefault()}>
              <span className="quick-text">Quick View</span>
              <span className="quick-icon">
                <svg viewBox="0 0 24 24" className="icon-svg">
                  <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </Link>

      <div className="product-info">
        <h3 className="category">{product.category}</h3>
        <p className="price">{formatPrice(product.price)}</p>
        {showRating && product.rating ? (
          <div className="product-rating" data-rating={product.rating}>
            <div className="stars">
              {[0, 1, 2, 3, 4].map((value) => (
                <svg key={value} viewBox="0 0 24 24" className={`star${value < Math.floor(product.rating) ? ' active' : ''}`}>
                  <path d="M12 .587l3.668 7.431L24 9.75l-6 5.847 1.417 8.268L12 19.771l-7.417 4.094L6 15.597 0 9.75l8.332-1.732z" />
                </svg>
              ))}
            </div>
            <div className="rating-text">{product.ratingText}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
