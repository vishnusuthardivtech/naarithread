import { ADMIN_PRODUCTS_STORAGE_KEY } from '../admin/api/storage'
import { allProducts as staticProducts, productsByPage } from '../data/products'
import { assetPath } from '../data/site'
import { getData, setData, subscribeToStorage } from '../utils/localStorage'

const PRODUCT_CHANNEL_KEY = ADMIN_PRODUCTS_STORAGE_KEY
const toBaseImagePath = (path = '') => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`
const PLACEHOLDER_IMAGE = toBaseImagePath('images/placeholder.jpg')

const CATEGORY_OPTIONS = ['Mirror Lehenga', 'Sequence Lehenga', 'Party Lehenga']
const COLLECTION_OPTIONS = ['collection1', 'collection2', 'collection3']

const sourcePageToCollection = {
  collection1: 'collection1',
  collection2: 'collection2',
  collection3: 'collection3',
}

const sourcePageToCategory = {
  collection1: 'Mirror Lehenga',
  collection2: 'Sequence Lehenga',
  collection3: 'Party Lehenga',
}

const productSourceMap = (() => {
  const map = new Map()

  Object.entries(productsByPage || {}).forEach(([pageKey, products]) => {
    if (!Array.isArray(products)) {
      return
    }

    products.forEach((product) => {
      if (!product?.id || map.has(String(product.id))) {
        return
      }

      map.set(String(product.id), pageKey)
    })
  })

  return map
})()

function normalizeImagePath(imagePath) {
  if (!imagePath) {
    return ''
  }

  const normalizedPath = String(imagePath).replace(/\\/g, '/').trim()
  const featuredMatch = normalizedPath.match(/(?:^|\/)(?:featured|featured lehengas)\/(\d+)\.(jpg|jpeg|png|webp)$/i)

  if (featuredMatch) {
    return toBaseImagePath(`images/products/lehenga${featuredMatch[1]}.jpg`)
  }

  if (/^(https?:)?\/\//.test(normalizedPath) || normalizedPath.startsWith('data:') || normalizedPath.startsWith('blob:')) {
    return normalizedPath
  }

  if (normalizedPath.startsWith('/images/featured/')) {
    return toBaseImagePath(
      normalizedPath.replace(/^\/+/, '').replace(/images\/featured\/(\d+)\.(jpg|jpeg|png|webp)$/i, 'images/products/lehenga$1.jpg'),
    )
  }

  if (normalizedPath.startsWith('/images/')) {
    return toBaseImagePath(normalizedPath)
  }

  if (/^images\//i.test(normalizedPath)) {
    return toBaseImagePath(normalizedPath)
  }

  return assetPath(normalizedPath)
}

function inferCategory(product = {}) {
  const normalizedCategory = String(product.category || '').trim()

  if (CATEGORY_OPTIONS.includes(normalizedCategory)) {
    return normalizedCategory
  }

  if (product.sourcePage && sourcePageToCategory[product.sourcePage]) {
    return sourcePageToCategory[product.sourcePage]
  }

  return CATEGORY_OPTIONS[0]
}

function inferCollection(product = {}) {
  const normalizedCollection = String(product.collection || '').trim()

  if (COLLECTION_OPTIONS.includes(normalizedCollection)) {
    return normalizedCollection
  }

  if (product.sourcePage && sourcePageToCollection[product.sourcePage]) {
    return sourcePageToCollection[product.sourcePage]
  }

  return ''
}

function inferStock(product = {}) {
  if (Number.isFinite(Number(product.stock))) {
    return Math.max(0, Number(product.stock))
  }

  return 12
}

function inferImages(product = {}) {
  const candidateImages = Array.isArray(product.images) && product.images.length
    ? product.images
    : [product.image].filter(Boolean)

  return candidateImages.map(normalizeImagePath).filter(Boolean)
}

function inferSourcePage(product = {}) {
  return product.sourcePage || productSourceMap.get(String(product.id)) || 'allProducts'
}

function inferVisibilityFlag(product = {}, key, sourcePage) {
  const directValue = product[key]
  if (typeof directValue === 'boolean') {
    return directValue
  }

  if (key === 'isNewArrival') {
    return product.isNewArrival
      ?? product.showInNewArrival
      ?? (product.tag === 'new')
      ?? (sourcePage === 'newArrival')
  }

  return product.isBestSeller
    ?? product.showInBestSeller
    ?? (product.tag === 'best')
    ?? (sourcePage === 'bestSeller' || sourcePage === 'homeBestSellers')
}

export function normalizeCatalogProduct(product = {}) {
  const sourcePage = inferSourcePage(product)
  const images = inferImages(product)
  const stock = inferStock(product)
  const imageToShow = images[0] || normalizeImagePath(product.image) || PLACEHOLDER_IMAGE

  return {
    ...product,
    id: String(product.id || ''),
    name: String(product.name || '').trim(),
    price: Number(product.price) || 0,
    stock,
    category: String(inferCategory(product)).trim(),
    collection: String(inferCollection(product)).trim(),
    description: String(product.description || '').trim(),
    images,
    image: imageToShow,
    imageToShow,
    isNewArrival: Boolean(inferVisibilityFlag(product, 'isNewArrival', sourcePage)),
    isBestSeller: Boolean(inferVisibilityFlag(product, 'isBestSeller', sourcePage)),
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || product.createdAt || new Date().toISOString(),
    sourcePage,
    status: stock > 0 ? 'In Stock' : 'Out of Stock',
    sku: String(product.sku || '').trim(),
  }
}

function buildInitialCatalog() {
  return Array.from(new Map(staticProducts.map((product) => [product.id, normalizeCatalogProduct(product)])).values())
}

export function getStoredCatalogProducts() {
  const storedProducts = getData(PRODUCT_CHANNEL_KEY, [])
  if (Array.isArray(storedProducts) && storedProducts.length > 0) {
    return storedProducts.map(normalizeCatalogProduct)
  }

  return buildInitialCatalog()
}

export function saveStoredCatalogProducts(products) {
  setData(PRODUCT_CHANNEL_KEY, products.map(normalizeCatalogProduct))
}

export function subscribeCatalogProducts(callback) {
  return subscribeToStorage(PRODUCT_CHANNEL_KEY, callback)
}

export function getCatalogOptions(products = getStoredCatalogProducts()) {
  return {
    categories: CATEGORY_OPTIONS,
    collections: COLLECTION_OPTIONS,
  }
}

export function getProductsForListing(products, listingKey) {
  const normalizedProducts = products.map(normalizeCatalogProduct)

  if (listingKey === 'newArrival') {
    const taggedProducts = normalizedProducts.filter((product) => product.isNewArrival)
    return taggedProducts.length > 0 ? taggedProducts : normalizedProducts
  }

  if (listingKey === 'bestSeller') {
    const taggedProducts = normalizedProducts.filter((product) => product.isBestSeller)
    return taggedProducts.length > 0 ? taggedProducts : normalizedProducts
  }

  if (listingKey === 'collection1') {
    const collectionProducts = normalizedProducts.filter((product) => product.collection === 'collection1' || product.sourcePage === 'collection1')
    return collectionProducts.length > 0 ? collectionProducts : normalizedProducts
  }

  if (listingKey === 'collection2') {
    const collectionProducts = normalizedProducts.filter((product) => product.collection === 'collection2' || product.sourcePage === 'collection2')
    return collectionProducts.length > 0 ? collectionProducts : normalizedProducts
  }

  if (listingKey === 'collection3') {
    const collectionProducts = normalizedProducts.filter((product) => product.collection === 'collection3' || product.sourcePage === 'collection3')
    return collectionProducts.length > 0 ? collectionProducts : normalizedProducts
  }

  return normalizedProducts
}

export function updateCatalogStockLevels(orderProducts = []) {
  if (!Array.isArray(orderProducts) || orderProducts.length === 0) {
    return { success: true, updatedProducts: getStoredCatalogProducts() }
  }

  const catalogProducts = getStoredCatalogProducts()
  const productMap = new Map(catalogProducts.map((product) => [String(product.id), product]))
  const stockErrors = []

  orderProducts.forEach((item) => {
    const product = productMap.get(String(item.id))
    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)

    if (!product) {
      stockErrors.push(`${item.name || 'Product'} is no longer available`)
      return
    }

    if (product.stock < requestedQuantity) {
      stockErrors.push(`${product.name} only has ${product.stock} item(s) left`)
    }
  })

  if (stockErrors.length > 0) {
    return {
      success: false,
      error: stockErrors[0],
      updatedProducts: catalogProducts,
    }
  }

  const nextProducts = catalogProducts.map((product) => {
    const orderItem = orderProducts.find((item) => String(item.id) === String(product.id))
    if (!orderItem) {
      return product
    }

    const nextStock = Math.max(0, product.stock - (Math.max(1, Number(orderItem.quantity) || 1)))
    return normalizeCatalogProduct({
      ...product,
      stock: nextStock,
      updatedAt: new Date().toISOString(),
    })
  })

  saveStoredCatalogProducts(nextProducts)

  return {
    success: true,
    updatedProducts: nextProducts,
  }
}

export function validateCartItemsAgainstStock(cartItems = []) {
  const productMap = new Map(getStoredCatalogProducts().map((product) => [String(product.id), product]))

  for (const item of cartItems) {
    const product = productMap.get(String(item.id))
    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)

    if (!product) {
      return { valid: false, error: `${item.name || 'Product'} is unavailable`, product: null }
    }

    if (product.stock <= 0) {
      return { valid: false, error: `${product.name} is out of stock`, product }
    }

    if (requestedQuantity > product.stock) {
      return { valid: false, error: `${product.name} only has ${product.stock} item(s) available`, product }
    }
  }

  return { valid: true, error: '', product: null }
}

export const catalogConstants = {
  CATEGORY_OPTIONS,
  COLLECTION_OPTIONS,
  PLACEHOLDER_IMAGE,
}
