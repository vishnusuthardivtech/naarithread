import { useCallback, useEffect, useState } from 'react'
import { reviewService } from '../services/reviewService'

export function useReviews(productId) {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ averageRating: 0, totalReviews: 0, breakdown: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!productId) {
      setReviews([])
      setSummary({ averageRating: 0, totalReviews: 0, breakdown: [] })
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const [nextReviews, nextSummary] = await Promise.all([
        reviewService.getProductReviews(productId),
        reviewService.getProductRatingSummary(productId),
      ])

      setReviews(nextReviews)
      setSummary(nextSummary)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load reviews')
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => reviewService.subscribe(load), [load])

  return {
    reviews,
    summary,
    loading,
    error,
    reload: load,
  }
}
