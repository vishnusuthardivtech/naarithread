import { getStoredCatalogProducts } from '../services/catalogService'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/placeholder.jpg`

/**
 * Validation for stored product image values.
 * Supports HTTP(S) URLs and local catalog paths.
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

  nextValue = nextValue.replace(/^file:\/\/\/+/, '')
  nextValue = nextValue.replace(/^[A-Za-z]:\//, '')
  nextValue = nextValue.replace(/^[A-Za-z]:\\/, '')

  if (/\/public\/images\//i.test(nextValue)) {
    nextValue = nextValue.replace(/^.*\/public\/images\//i, '/images/')
  } else if (/^public\/images\//i.test(nextValue)) {
    nextValue = nextValue.replace(/^public\/images\//i, '/images/')
  } else if (/\/images\//i.test(nextValue)) {
    nextValue = nextValue.replace(/^.*(?=\/images\/)/, '')
  }

  nextValue = nextValue.replace(/\/+/g, '/')
  if (!nextValue.startsWith('/')) {
    nextValue = `/${nextValue}`
  }

  return nextValue
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
  const directImage = item?.images?.[0] || item?.image
  const normalizedDirectImage = normalizeStoredImagePath(directImage)

  if (normalizedDirectImage) {
    return normalizedDirectImage
  }

  const matchedProduct = findMatchingProduct(item)
  const matchedImage = matchedProduct?.images?.[0] || matchedProduct?.image
  const normalizedMatchedImage = normalizeStoredImagePath(matchedImage)

  if (normalizedMatchedImage) {
    return normalizedMatchedImage
  }

  return FALLBACK_IMAGE
}

export { FALLBACK_IMAGE }
