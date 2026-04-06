import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

import { formatPrice } from '../utils/storage'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product, className = 'product-card', showRating = false, showNewBadge = false }) {
  const { addToCart, removeFromCart, isInCart } = useApp()
  const cardClassName = `${className} reveal`.replace(/\s+/g, ' ').trim()
  const inCart = isInCart(product.id)
  const rating = typeof product.rating === 'number' ? product.rating : 0

  const renderStars = (value) => Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1
    let state = 'empty'

    if (starValue <= Math.floor(value)) {
      state = 'full'
    } else if (starValue - value < 1) {
      state = 'half'
    }

    return (
      <span key={starValue} className={`rating-star ${state}`} aria-hidden="true">
        ★
      </span>
    )
  })

  const handleCartClick = (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (inCart) {
      removeFromCart(product.id)
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <div
      className={cardClassName}
      data-id={product.id}
      data-name={product.name}
      data-price={product.price}
      data-image={product.image}
    >
      <Link to={`/product?id=${product.id}`}>
        <div className="product-image">
          {showNewBadge ? <span className="new-badge">NEW</span> : null}
          <img src={product.image} alt={product.category} />
          <div className="product-actions">

            <WishlistButton product={product} />

            <button
              className={`cart-btn${inCart ? ' active' : ''}`}
              onClick={handleCartClick}
              aria-label={inCart ? 'Remove from cart' : 'Add to cart'}
              aria-pressed={inCart}
            >
              <svg viewBox="0 0 24 24" className="icon-svg">
                <circle cx="9" cy="20" r="1.5" />
                <circle cx="18" cy="20" r="1.5" />
                <path d="M2 3h3l2 12h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              className="quick-view-btn"
              data-id={product.id}
              data-name={product.name}
              data-price={product.price}
              data-image={product.image}
              onClick={(event) => event.preventDefault()}
            >
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
        <div className="product-rating" aria-label={`Rated ${rating} out of 5`}>
          <div className="rating-stars">{renderStars(rating)}</div>
          <span className="rating-value">{rating.toFixed(1).replace('.0', '')}</span>
        </div>
      </div>
    </div>
  )
}
