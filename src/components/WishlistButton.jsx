import { useApp } from '../context/AppContext'

export default function WishlistButton({ product, className = 'wishlist-btn' }) {
  const { isWishlisted, toggleWishlist } = useApp()

  return (
    <button
      className={`${className}${isWishlisted(product.id) ? ' active' : ''}`}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        toggleWishlist(product)
      }}
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
  )
}

