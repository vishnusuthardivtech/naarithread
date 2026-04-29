import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { catalogConstants } from '../services/catalogService'
import { formatPrice } from '../utils/storage'

const QUICK_VIEW_SIZES = ['S', 'M', 'L', 'XL']

const getDatasetValue = (button, card, key) => button?.dataset?.[key] || card?.dataset?.[key] || ''

const getProductMeta = (product) => ({
  description:
    product?.description ||
    `${product?.name || 'This product'} is designed for modern celebrations with timeless elegance, premium craftsmanship, and comfortable festive wearability.`,
})

export default function QuickViewModal() {
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isWishlisted, products } = useApp()
  const [activeProduct, setActiveProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState('M')

  const productMap = useMemo(() => new Map(products.map((product) => [String(product.id), product])), [products])
  const isOpen = Boolean(activeProduct)
  const productMeta = activeProduct ? getProductMeta(activeProduct) : null

  useEffect(() => {
    const handleDocumentClick = (event) => {
      const button = event.target.closest('.quick-view-btn')

      if (!button) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const card = button.closest('.product-card')
      const id = getDatasetValue(button, card, 'id')
      const mappedProduct = id ? productMap.get(String(id)) : null
      const fallbackProduct = {
        id,
        name: getDatasetValue(button, card, 'name'),
        price: Number(getDatasetValue(button, card, 'price')) || 0,
        images: [getDatasetValue(button, card, 'image')].filter(Boolean),
      }

      setSelectedSize('M')
      setActiveProduct(mappedProduct || fallbackProduct)
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [productMap])

  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('quick-view-open')
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveProduct(null)
      }
    }

    document.body.classList.add('quick-view-open')
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('quick-view-open')
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isOpen || !activeProduct) {
    return null
  }

  const image = activeProduct.images?.[0]
  const imageToShow = image || catalogConstants.PLACEHOLDER_IMAGE

  const closeModal = () => setActiveProduct(null)

  const handleAddToCart = () => {
    try {
      const added = addToCart({
        id: activeProduct.id,
        name: activeProduct.name,
        price: activeProduct.price,
        images: Array.isArray(activeProduct.images) ? [...activeProduct.images] : [],
        quantity: 1,
        size: selectedSize,
      })

      if (added) {
        closeModal()
      }
    } catch {
      // Keep modal open and preserve existing layout when stock validation fails.
    }
  }

  const handleWishlist = () => {
    toggleWishlist(activeProduct)
  }

  const handleViewDetails = () => {
    navigate(activeProduct.id ? `/product?id=${activeProduct.id}` : '/product')
    closeModal()
  }

  return createPortal(
    <div className="quick-view-modal active" onClick={closeModal} role="presentation">
      <div
        className="quick-view-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
      >
        <div className="quick-view-panel quick-view-panel-media">
          <div className="quick-view-image-shell">
            <img
              src={imageToShow}
              alt={activeProduct.name}
              className="quick-view-image"
              loading="lazy"
            />
          </div>
        </div>

        <div className="quick-view-panel quick-view-panel-content">
          <button className="quick-view-close" type="button" onClick={closeModal} aria-label="Close quick view">
            <svg viewBox="0 0 24 24" className="icon-svg">
              <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          <div className="quick-view-copy">
            <p className="quick-view-label">Naarithread Edit</p>
            <h2 id="quick-view-title" className="quick-view-title">{activeProduct.name}</h2>
            <p className="quick-view-price">{formatPrice(activeProduct.price)}</p>
            <p className="quick-view-description">{productMeta?.description}</p>
          </div>

          <div className="quick-view-size-block">
            <span className="quick-view-section-title">Select Size</span>
            <div className="quick-view-sizes">
              {QUICK_VIEW_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`quick-view-size-btn${selectedSize === size ? ' active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quick-view-actions">
            <button type="button" className="quick-view-cart-btn" onClick={handleAddToCart} disabled={Number(activeProduct.stock) <= 0}>
              {Number(activeProduct.stock) > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              type="button"
              className={`quick-view-wishlist-btn${isWishlisted(activeProduct.id) ? ' active' : ''}`}
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
            >
              <svg viewBox="0 0 24 24" className="icon-svg">
                <path
                  d="M12 21s-7-4.5-9.5-8.2C-1 7.5 4 2.5 8 6c1.3 1.1 2 2 4 4 2-2 2.7-2.9 4-4 4-3.5 9 1.5 5.5 6.8C19 16.5 12 21 12 21z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <button type="button" className="quick-view-details-btn" onClick={handleViewDetails}>
            View Full Details
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

