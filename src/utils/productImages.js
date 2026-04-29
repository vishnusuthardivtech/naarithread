import { getStoredCatalogProducts } from '../services/catalogService'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/placeholder.jpg`

/**
 * Validation for product image URLs.
 * Admin-managed products use HTTP(S) URLs only.
 */
export function isValidProductImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false

  return /^https?:\/\//.test(trimmed)
}

const normalizeStoredImagePath = (value = '') => {
  if (!value) {
    return ''
  }

  let nextValue = String(value).trim().replace(/\\/g, '/')

  if (!nextValue) {
    return ''
  }

  if (/^https?:\/\//.test(nextValue)) {
    return nextValue
  }

  return ''
}

const findMatchingProduct = (item = {}) => {
  const products = getStoredCatalogProducts()

  return (
    products.find((product) => String(product.id) === String(item?.id)) ||
    products.find((product) => product.name === item?.name) ||
    products.find((product) => product.category === item?.name)
  )
}

export const resolveProductImage = (item = {}) => {
  const directImage = item?.images?.[0]
  const normalizedDirectImage = normalizeStoredImagePath(directImage)

  // Only return direct image if it's a valid format
  if (normalizedDirectImage && isValidProductImageUrl(normalizedDirectImage)) {
    return normalizedDirectImage
  }

  const matchedProduct = findMatchingProduct(item)
  if (matchedProduct?.images?.[0] && isValidProductImageUrl(matchedProduct.images[0])) {
    return normalizeStoredImagePath(matchedProduct.images[0])
  }

  return FALLBACK_IMAGE
}

export { FALLBACK_IMAGE }
