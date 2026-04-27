import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import StarRating from '../components/StarRating'
import { useApp } from '../context/AppContext'
import { useReviews } from '../hooks/useReviews'
import { reviewService } from '../services/reviewService'
import { catalogConstants } from '../services/catalogService'
import { formatPrice } from '../utils/storage'

const getOriginalPrice = (price) => Math.ceil((price * 1.35) / 100) * 100

const getProductMeta = (product) => ({
  description:
    product?.description ||
    `${product?.name || 'This product'} is designed for modern celebrations with timeless elegance, premium craftsmanship, and comfortable festive wearability.`,
  details: product?.details || ['Fabric: Premium occasion fabric', 'Work: Signature festive detailing', 'Occasion: Celebration wear', 'Crafted in Surat'],
})

function formatReviewDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Product() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToCart, ensureUser, user, products } = useApp()
  const selectedId = searchParams.get('id')
  const product = useMemo(
    () => products.find((item) => item.id === selectedId),
    [products, selectedId],
  )
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [tab, setTab] = useState('desc')
  const [stickyVisible, setStickyVisible] = useState(false)
  const [activeImage, setActiveImage] = useState('')
  const [cartError, setCartError] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [reviewFormMessage, setReviewFormMessage] = useState('')
  const [reviewFormError, setReviewFormError] = useState('')
  const { reviews, summary, loading: reviewsLoading, error: reviewsError, reload: reloadReviews } = useReviews(selectedId)

  useEffect(() => {
    setQuantity(1)
    setSelectedSize('')
    setTab('desc')
    setActiveImage(product?.images?.[0] || product?.image || catalogConstants.PLACEHOLDER_IMAGE)
    setCartError('')
    setReviewForm({ rating: 0, comment: '' })
    setReviewFormMessage('')
    setReviewFormError('')
  }, [selectedId, product?.image, product?.images])

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
  const images = product.images?.length ? product.images : []
  const imageToShow = images.includes(activeImage) ? activeImage : product.images?.[0] || product.image || catalogConstants.PLACEHOLDER_IMAGE
  const originalPrice = getOriginalPrice(product.price)
  const discount = Math.max(1, Math.round(((originalPrice - product.price) / originalPrice) * 100))
  const rating = summary.totalReviews ? summary.averageRating : 0
  const reviewCount = summary.totalReviews
  const inStock = Number(product.stock) > 0

  const submitCart = () => {
    setCartError('')

    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images?.length ? [...product.images] : [imageToShow],
        image: imageToShow,
        quantity,
        size: selectedSize,
      })
    } catch (error) {
      setCartError(error instanceof Error ? error.message : 'Unable to add to cart')
    }
  }

  const handleBuyNow = () => {
    if (!inStock || !selectedSize) {
      return
    }

    submitCart()
    navigate('/cart')
  }

  const canSubmitReview = Boolean(reviewForm.rating && reviewForm.comment.trim() && !isSubmittingReview)

  const handleReviewSubmit = async (event) => {
    event.preventDefault()
    setReviewFormError('')
    setReviewFormMessage('')

    if (!ensureUser()) {
      return
    }

    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      setReviewFormError('Please add both a rating and review comment')
      return
    }

    setIsSubmittingReview(true)

    try {
      await reviewService.postReview({
        productId: product.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        user,
      })

      setReviewForm({ rating: 0, comment: '' })
      setReviewFormMessage('Review submitted successfully. It will appear after admin approval.')
      await reloadReviews()
    } catch (submitError) {
      setReviewFormError(submitError instanceof Error ? submitError.message : 'Unable to submit review')
    } finally {
      setIsSubmittingReview(false)
    }
  }

  return (
    <>
      <main className="pdp-page">
        <section className="pdp-container">
          <div className="pdp-gallery">
            <div className="pdp-main-image">
              <img
                src={imageToShow}
                alt={product.name}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.src = catalogConstants.PLACEHOLDER_IMAGE
                }}
              />
            </div>
            {images.length > 1 ? (
              <div className="pdp-thumbnails">
                {images.map((thumbnail) => (
                  <button
                    key={thumbnail}
                    type="button"
                    className={`pdp-thumb-btn${thumbnail === imageToShow ? ' active' : ''}`}
                    onClick={() => setActiveImage(thumbnail)}
                  >
                    <img
                      src={thumbnail}
                      alt={product.name}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = catalogConstants.PLACEHOLDER_IMAGE
                      }}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pdp-details">
            <h1 className="pdp-title">{product.name}</h1>
            <div className="pdp-rating">
              {reviewCount ? `${rating.toFixed(1)} ⭐` : 'No reviews yet'} <span>({reviewCount} Reviews)</span>
            </div>
            <div className={`pdp-stock-pill${inStock ? ' in-stock' : ' out-of-stock'}`}>
              {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
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
                    disabled={!inStock}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-quantity">
              <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={!inStock}>-</button>
              <span id="qty">{quantity}</span>
              <button onClick={() => setQuantity((value) => value + 1)} disabled={!inStock || quantity >= Number(product.stock)}>+</button>
            </div>

            <div className="pdp-buttons">
              <button className="royal-btn royal-outline" id="mainAddBtn" disabled={!selectedSize || !inStock} onClick={submitCart}>
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button className="royal-btn royal-gold" onClick={handleBuyNow} disabled={!selectedSize || !inStock}>
                {inStock ? 'Buy Now' : 'Unavailable'}
              </button>
              <button className="pdp-wishlist">
                <span>+</span>
              </button>
            </div>
            {cartError ? <p className="product-card-error">{cartError}</p> : null}

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
              <li>Category: {product.category}</li>
              <li>Collection: {product.collection || 'Not assigned'}</li>
              <li>Stock: {inStock ? `${product.stock} available` : 'Out of Stock'}</li>
            </ul>
          </div>

          <div className={`tab-content${tab === 'reviews' ? ' active' : ''}`} id="reviews">
            <section className="customer-reviews">
              <div className="customer-reviews-summary">
                <div className="customer-reviews-summary-main">
                  <h3>Customer Reviews</h3>
                  {reviewsLoading ? (
                    <div className="reviews-skeleton reviews-summary-skeleton" />
                  ) : reviewCount ? (
                    <>
                      <div className="customer-reviews-average">{rating.toFixed(1)} ⭐</div>
                      <p>{reviewCount} approved review{reviewCount > 1 ? 's' : ''}</p>
                    </>
                  ) : (
                    <p>Be the first to review this product.</p>
                  )}
                </div>

                <div className="customer-reviews-breakdown">
                  {summary.breakdown.map((item) => {
                    const percent = reviewCount ? (item.count / reviewCount) * 100 : 0

                    return (
                      <div className="review-breakdown-row" key={item.stars}>
                        <span>{item.stars} Star</span>
                        <div className="review-breakdown-bar">
                          <span style={{ width: `${percent}%` }} />
                        </div>
                        <strong>{item.count}</strong>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="customer-reviews-list">
                {reviewsLoading ? (
                  <>
                    <div className="reviews-skeleton review-card-skeleton" />
                    <div className="reviews-skeleton review-card-skeleton" />
                  </>
                ) : reviewsError ? (
                  <p className="review-feedback review-feedback-error">{reviewsError}</p>
                ) : reviews.length === 0 ? (
                  <p className="review-feedback">Be the first to review this product.</p>
                ) : (
                  reviews.map((review) => (
                    <article className="review-card" key={review.id}>
                      <div className="review-card-top">
                        <div>
                          <h4>{review.userName}</h4>
                          <p>{formatReviewDate(review.createdAt)}</p>
                        </div>
                        {review.isVerifiedPurchase ? <span className="verified-badge">Verified Buyer</span> : null}
                      </div>
                      <StarRating value={review.rating} className="review-card-rating" />
                      <p className="review-card-comment">{review.comment}</p>
                    </article>
                  ))
                )}
              </div>

              <div className="customer-review-form-wrap">
                <h3>Write a Review</h3>
                {!user ? (
                  <p className="review-feedback">Login to write a review</p>
                ) : (
                  <form className="customer-review-form" onSubmit={handleReviewSubmit}>
                    <div className="customer-review-form-field">
                      <label>Your Rating</label>
                      <StarRating
                        value={reviewForm.rating}
                        interactive
                        onChange={(value) => setReviewForm((current) => ({ ...current, rating: value }))}
                        className="customer-review-rating-picker"
                      />
                    </div>

                    <div className="customer-review-form-field">
                      <label htmlFor="review-comment">Your Review</label>
                      <textarea
                        id="review-comment"
                        value={reviewForm.comment}
                        onChange={(event) => setReviewForm((current) => ({ ...current, comment: event.target.value }))}
                        placeholder="Share your experience with the product"
                        rows={5}
                      />
                    </div>

                    {reviewFormError ? <p className="review-feedback review-feedback-error">{reviewFormError}</p> : null}
                    {reviewFormMessage ? <p className="review-feedback review-feedback-success">{reviewFormMessage}</p> : null}

                    <button className="royal-btn royal-gold review-submit-btn" type="submit" disabled={!canSubmitReview}>
                      {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>

      <div className={`sticky-cart-bar${stickyVisible ? ' active' : ''}`}>
        <div className="sticky-price">{formatPrice(product.price)}</div>
        <button className="sticky-add-btn" id="stickyAddBtn" disabled={!selectedSize || !inStock} onClick={submitCart}>
          {inStock ? 'Add to Cart' : 'Out of Stock'}
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
