import { getStoredCatalogProducts } from './catalogService'
import { getCurrentUser } from '../utils/cart'
import { getData, setData, subscribeToStorage } from '../utils/localStorage'

const REVIEWS_KEY = 'ntReviews'

function createReviewId() {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10)

  return `review_${Date.now()}_${randomPart}`
}

function getStoredReviews() {
  return getData(REVIEWS_KEY, [])
}

function saveStoredReviews(reviews) {
  setData(REVIEWS_KEY, reviews)
  return reviews
}

function normalizeReview(review = {}) {
  return {
    id: review.id || createReviewId(),
    productId: String(review.productId || ''),
    userId: String(review.userId || review.userEmail || ''),
    userName: String(review.userName || 'Customer').trim() || 'Customer',
    rating: Math.min(5, Math.max(1, Number(review.rating) || 1)),
    comment: String(review.comment || '').trim(),
    status: ['pending', 'approved', 'rejected'].includes(review.status) ? review.status : 'pending',
    isVerifiedPurchase: Boolean(review.isVerifiedPurchase),
    createdAt: review.createdAt || new Date().toISOString(),
  }
}

function getAllReviews() {
  return getStoredReviews()
    .map(normalizeReview)
    .sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
}

function getApprovedReviewsByProduct(productId) {
  return getAllReviews().filter((review) => review.productId === String(productId) && review.status === 'approved')
}

function hasVerifiedPurchase(productId, user = getCurrentUser()) {
  if (!user?.email || typeof window === 'undefined') {
    return false
  }

  const orders = getData('ntOrders', [])

  return orders.some((order) => {
    if (order?.userEmail && order.userEmail !== user.email) {
      return false
    }

    return Array.isArray(order?.products) && order.products.some((product) => String(product?.id) === String(productId))
  })
}

function computeRatingSummary(productId) {
  const approvedReviews = getApprovedReviewsByProduct(productId)
  const totalReviews = approvedReviews.length
  const totalRating = approvedReviews.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalReviews ? Number((totalRating / totalReviews).toFixed(1)) : 0
  const breakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: approvedReviews.filter((review) => review.rating === stars).length,
  }))

  return {
    averageRating,
    totalReviews,
    breakdown,
  }
}

function getProductName(productId) {
  return getStoredCatalogProducts().find((product) => product.id === String(productId))?.name || 'Product'
}

function attachReviewDisplayFields(review) {
  return {
    ...review,
    productName: getProductName(review.productId),
  }
}

export const reviewService = {
  async postReview(payload) {
    const user = payload.user || getCurrentUser()
    const productId = String(payload.productId || '')
    const comment = String(payload.comment || '').trim()
    const rating = Number(payload.rating)

    if (!user?.email) {
      throw new Error('You must be logged in to write a review')
    }

    if (!productId) {
      throw new Error('Product not found')
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      throw new Error('Please select a rating between 1 and 5')
    }

    if (!comment) {
      throw new Error('Please write a review comment')
    }

    const review = normalizeReview({
      id: createReviewId(),
      productId,
      userId: user.id || user.email,
      userName: user.name || user.email,
      rating,
      comment,
      status: 'pending',
      isVerifiedPurchase: hasVerifiedPurchase(productId, user),
      createdAt: new Date().toISOString(),
    })

    saveStoredReviews([review, ...getAllReviews()])
    return attachReviewDisplayFields(review)
  },

  async getProductReviews(productId) {
    return getApprovedReviewsByProduct(productId).map(attachReviewDisplayFields)
  },

  async getAdminReviews() {
    return getAllReviews().map(attachReviewDisplayFields)
  },

  async updateReviewStatus(id, status) {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Invalid review status')
    }

    let updatedReview = null
    const nextReviews = getAllReviews().map((review) => {
      if (review.id !== id) {
        return review
      }

      updatedReview = {
        ...review,
        status,
      }
      return updatedReview
    })

    if (!updatedReview) {
      throw new Error('Review not found')
    }

    saveStoredReviews(nextReviews)
    return attachReviewDisplayFields(updatedReview)
  },

  async getProductRatingSummary(productId) {
    return computeRatingSummary(productId)
  },

  getProductsWithRatings(products = getStoredCatalogProducts()) {
    return products.map((product) => {
      const summary = computeRatingSummary(product.id)

      return {
        ...product,
        rating: summary.totalReviews ? summary.averageRating : 0,
        reviewCount: summary.totalReviews,
      }
    })
  },

  subscribe(callback) {
    return subscribeToStorage(REVIEWS_KEY, callback)
  },
}
