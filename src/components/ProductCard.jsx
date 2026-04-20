import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { catalogConstants } from '../services/catalogService'
import { formatPrice } from '../utils/storage'
import StarRating from './StarRating'
import WishlistButton from './WishlistButton'

export default function ProductCard({ product, className = 'product-card', showRating = false, showNewBadge = false, showStock = false }) {
  const { addToCart, removeFromCart, isInCart } = useApp()
  const cardClassName = `${className} reveal`.replace(/\s+/g, ' ').trim()
  const inCart = isInCart(product.id)
  const rating = typeof product.rating === 'number' ? product.rating : 0
  const reviewCount = Number(product.reviewCount) || 0
  const inStock = Number(product.stock) > 0
  const [cartError, setCartError] = useState('')
  const imageToShow = product.imageToShow || product.images?.[0] || product.image || catalogConstants.PLACEHOLDER_IMAGE

  const handleCartClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setCartError('')

    if (!inStock) {
      setCartError('Out of Stock')
      return
    }

    if (inCart) {
      removeFromCart(product.id)
      return
    }

    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: imageToShow,
        quantity: 1,
      })
    } catch (error) {
      setCartError(error instanceof Error ? error.message : 'Unable to add to cart')
    }
  }

  return (
    <div
      className={cardClassName}
      data-id={product.id}
      data-name={product.name}
      data-price={product.price}
      data-image={imageToShow}
    >
      <Link to={`/product?id=${product.id}`}>
        <div className="product-image">
          {showNewBadge ? <span className="new-badge">NEW</span> : null}
          {showStock ? <span className={`product-stock-badge${inStock ? ' in-stock' : ' out-of-stock'}`}>{inStock ? 'In Stock' : 'Out of Stock'}</span> : null}
          <img
            src={imageToShow}
            alt={product.category || product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = catalogConstants.PLACEHOLDER_IMAGE
            }}
          />
          <div className="product-actions">
            <WishlistButton product={product} />

            <button
              className={`cart-btn${inCart ? ' active' : ''}${!inStock ? ' disabled' : ''}`}
              onClick={handleCartClick}
              aria-label={inStock ? (inCart ? 'Remove from cart' : 'Add to cart') : 'Out of stock'}
              aria-pressed={inCart}
              disabled={!inStock}
            >
              {inStock ? (
                <svg viewBox="0 0 24 24" className="icon-svg">
                  <circle cx="9" cy="20" r="1.5" />
                  <circle cx="18" cy="20" r="1.5" />
                  <path d="M2 3h3l2 12h11l2-8H6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="product-stock-icon">OOS</span>
              )}
            </button>

            <button
              className="quick-view-btn"
              data-id={product.id}
              data-name={product.name}
              data-price={product.price}
              data-image={imageToShow}
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
        <div className="product-rating-row">
          <StarRating value={rating} />
          <span className="rating-value">{reviewCount ? rating.toFixed(1).replace('.0', '') : 'New'}</span>
        </div>
        <button className={`product-card-stock-btn${inStock ? '' : ' is-disabled'}`} type="button" onClick={handleCartClick} disabled={!inStock}>
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        {cartError ? <p className="product-card-error">{cartError}</p> : null}
      </div>
    </div>
  )
}
