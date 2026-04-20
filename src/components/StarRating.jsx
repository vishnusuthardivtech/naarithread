export default function StarRating({
  value = 0,
  interactive = false,
  onChange,
  className = '',
  buttonClassName = '',
  labelPrefix = 'Rated',
}) {
  const safeValue = Number(value) || 0

  const renderStarState = (starValue) => {
    if (starValue <= Math.floor(safeValue)) {
      return 'full'
    }

    if (starValue - safeValue < 1) {
      return 'half'
    }

    return 'empty'
  }

  return (
    <div className={`product-rating ${className}`.trim()} aria-label={`${labelPrefix} ${safeValue} out of 5`}>
      <div className="rating-stars">
        {Array.from({ length: 5 }, (_, index) => {
          const starValue = index + 1
          const state = interactive ? (starValue <= safeValue ? 'full' : 'empty') : renderStarState(starValue)

          if (!interactive) {
            return (
              <span key={starValue} className={`rating-star ${state}`} aria-hidden="true">
                ★
              </span>
            )
          }

          return (
            <button
              key={starValue}
              type="button"
              className={`rating-star-button ${buttonClassName}`.trim()}
              onClick={() => onChange?.(starValue)}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <span className={`rating-star ${state}`} aria-hidden="true">
                ★
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
