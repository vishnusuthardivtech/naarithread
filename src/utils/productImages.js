import { allProducts } from '../data/products'
import { assetPath, normalizeAssetPath } from '../data/site'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}vite.svg`

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

const findMatchingProduct = (item = {}) =>
  allProducts.find((product) => String(product.id) === String(item?.id)) ||
  allProducts.find((product) => product.name === item?.name) ||
  allProducts.find((product) => product.category === item?.name)

export const resolveProductImage = (item = {}) => {
  const directImage = item?.image || item?.img || item?.thumbnail || item?.photo
  const normalizedDirectImage = normalizeStoredImagePath(directImage)

  if (normalizedDirectImage && normalizedDirectImage !== FALLBACK_IMAGE) {
    return normalizedDirectImage
  }

  const matchedProduct = findMatchingProduct(item)
  if (matchedProduct?.image) {
    return normalizeStoredImagePath(matchedProduct.image)
  }

  return normalizedDirectImage || FALLBACK_IMAGE
}

export { FALLBACK_IMAGE }
