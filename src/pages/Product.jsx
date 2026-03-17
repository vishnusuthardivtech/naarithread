import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { findProductById, getProductMeta } from '../data/products'
import { formatPrice } from '../utils/storage'

const reviewCountByRating = {
  4.8: 126,
  4.7: 94,
  4.6: 81,
  4.5: 67,
}

const getOriginalPrice = (price) => Math.ceil((price * 1.35) / 100) * 100

export default function Product() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart } = useApp()
  const selectedId = searchParams.get('id')
  const product = useMemo(() => findProductById(selectedId), [selectedId])
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [tab, setTab] = useState('desc')
  const [stickyVisible, setStickyVisible] = useState(false)

  useEffect(() => {
    setQuantity(1)
    setSelectedSize('')
    setTab('desc')
  }, [selectedId])

  useEffect(() => {
    const onScroll = () => {
      const pdpButtons = document.querySelector('.pdp-buttons')
      if (!pdpButtons) return
      const rect = pdpButtons.getBoundingClientRect()
      setStickyVisible(rect.top < window.innerHeight - 150)
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [product])

  if (!product) {
    return (
      <main className="pdp-page">
        <section className="pdp-not-found">
          <h1>Product not found</h1>
        </section>
      </main>
    )
  }

  const productMeta = getProductMeta(product)
  const image = product.image
  const originalPrice = getOriginalPrice(product.price)
  const discount = Math.max(1, Math.round(((originalPrice - product.price) / originalPrice) * 100))
  const rating = product.rating || 4.8
  const reviewCount = reviewCountByRating[rating] || 126

  const submitCart = () =>
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
      quantity,
      size: selectedSize,
    })

  return (
    <>
      <main className="pdp-page">
        <section className="pdp-container">
          <div className="pdp-gallery">
            <div className="pdp-main-image">
              <img src={image} alt={product.name} />
            </div>
          </div>

          <div className="pdp-details">
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-rating">
              {rating} <span>({reviewCount} Reviews)</span>
            </div>
            <div className="pdp-price-box">
              <span className="pdp-mrp">{formatPrice(originalPrice)}</span>
              <span className="pdp-price">{formatPrice(product.price)}</span>
              <span className="pdp-discount">{discount}% OFF</span>
            </div>
            <p className="pdp-description">{productMeta.description}</p>

            <div className="pdp-size-section">
              <h4>Select Size</h4>
              <div className="pdp-sizes">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    className={`size-btn${selectedSize === size ? ' active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-quantity">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))}>-</button>
              <span id="qty">{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)}>+</button>
            </div>

            <div className="pdp-buttons">
              <button className="royal-btn royal-outline" id="mainAddBtn" disabled={!selectedSize} onClick={submitCart}>
                Add to Cart
              </button>
              <button className="royal-btn royal-gold" onClick={() => navigate('/cart')}>
                Buy Now
              </button>
              <button className="pdp-wishlist">
                <span>+</span>
              </button>
            </div>

            <div className="pdp-trust">
              <div className="trust-item">
                <span className="trust-icon">*</span>
                <span>Secure Payment</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">*</span>
                <span>Easy Returns</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">*</span>
                <span>Free Shipping</span>
              </div>
            </div>
          </div>
        </section>

        <section className="pdp-tabs">
          <div className="tab-buttons">
            <button className={`tab-btn${tab === 'desc' ? ' active' : ''}`} onClick={() => setTab('desc')}>
              Description
            </button>
            <button className={`tab-btn${tab === 'details' ? ' active' : ''}`} onClick={() => setTab('details')}>
              Product Details
            </button>
            <button className={`tab-btn${tab === 'reviews' ? ' active' : ''}`} onClick={() => setTab('reviews')}>
              Reviews
            </button>
          </div>

          <div className={`tab-content${tab === 'desc' ? ' active' : ''}`} id="desc">
            <p>{productMeta.description}</p>
          </div>

          <div className={`tab-content${tab === 'details' ? ' active' : ''}`} id="details">
            <ul>
              {productMeta.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>

          <div className={`tab-content${tab === 'reviews' ? ' active' : ''}`} id="reviews">
            <p>
              {rating} out of 5 based on {reviewCount} reviews.
            </p>
          </div>
        </section>
      </main>

      <div className={`sticky-cart-bar${stickyVisible ? ' active' : ''}`}>
        <div className="sticky-price">{formatPrice(product.price)}</div>
        <button className="sticky-add-btn" id="stickyAddBtn" disabled={!selectedSize} onClick={submitCart}>
          Add to Cart
        </button>
      </div>

      <div className="cart-toast" id="cartToast">
        <div className="toast-content">
          <span>Added to Cart</span>
        </div>
      </div>
    </>
  )
}
