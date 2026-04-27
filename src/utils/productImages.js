import { assetPath, normalizeAssetPath } from '../data/site'
import { getStoredCatalogProducts } from '../services/catalogService'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/placeholder.jpg`

/**
 * Strict validation for product image URLs.
 * Must start with "/images/" OR "http" AND end with .jpg/.jpeg/.png/.webp
 */
export function isValidProductImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false

  const hasValidPrefix = trimmed.startsWith('/images/') || /^https?:\/\//.test(trimmed)
  const hasValidExtension = /\.(jpg|jpeg|png|webp)$/i.test(trimmed)

  return hasValidPrefix && hasValidExtension
}

const stripBaseUrl = (value = '') => {
  const baseUrl = import.meta.env.BASE_URL || '/'
  return value.startsWith(baseUrl) ? value.slice(baseUrl.length) : value
}

const normalizeStoredImagePath = (value = '') => {
  if (!value) {
    return ''
  }

  let nextValue = String(value).trim().replace(/\\/g, '/')

  if (!nextValue) {
    return ''
  }

  if (/^(https?:)?\/\//.test(nextValue) || nextValue.startsWith('data:') || nextValue.startsWith('blob:')) {
    return nextValue
  }

  nextValue = stripBaseUrl(nextValue).replace(/^\/+/, '')

  if (/^vite\.svg$/i.test(nextValue)) {
    return FALLBACK_IMAGE
  }

  nextValue = nextValue
    .replace(/^public\//i, '')
    .replace(/^src\//i, '')

  if (/^images\//i.test(nextValue)) {
    return `${import.meta.env.BASE_URL}${nextValue}`
  }

  if (/^assets\//i.test(nextValue)) {
    return assetPath(nextValue)
  }

  if (nextValue.includes('/images/')) {
    return `${import.meta.env.BASE_URL}images/${nextValue.replace(/^.*\/images\//, '')}`
  }

  if (nextValue.includes('/assets/')) {
    return assetPath(nextValue.replace(/^.*\/assets\//, 'assets/'))
  }

  return assetPath(normalizeAssetPath(nextValue))
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
  const directImage = item?.images?.[0] || item?.image || item?.img || item?.thumbnail || item?.photo
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
