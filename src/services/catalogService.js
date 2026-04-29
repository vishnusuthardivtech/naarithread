import { ADMIN_PRODUCTS_STORAGE_KEY } from '../admin/api/storage'
import { getData, setData, subscribeToStorage } from '../utils/localStorage'

const PRODUCT_CHANNEL_KEY = ADMIN_PRODUCTS_STORAGE_KEY
const toBaseImagePath = (path = '') => `${import.meta.env.BASE_URL}${String(path).replace(/^\/+/, '')}`
const PLACEHOLDER_IMAGE = toBaseImagePath('images/placeholder.jpg')

const CATEGORY_OPTIONS = ['Mirror Lehenga', 'Sequence Lehenga', 'Party Lehenga']
const COLLECTION_OPTIONS = ['collection1', 'collection2', 'collection3']

function normalizeImagePath(imagePath) {
  if (!imagePath) {
    return ''
  }

  const normalizedPath = String(imagePath).replace(/\\/g, '/').trim()
  if (!normalizedPath) {
    return ''
  }

  if (/^https?:\/\//.test(normalizedPath)) {
    return normalizedPath
  }

  return ''
}

function inferCategory(product = {}) {
  const normalizedCategory = String(product.category || '').trim()

  if (CATEGORY_OPTIONS.includes(normalizedCategory)) {
    return normalizedCategory
  }

  return CATEGORY_OPTIONS[0]
}

function inferCollection(product = {}) {
  const normalizedCollection = String(product.collection || '').trim()

  if (COLLECTION_OPTIONS.includes(normalizedCollection)) {
    return normalizedCollection
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
    ? [...product.images]
    : []

  return candidateImages
    .filter((image) => typeof image === 'string')
    .map((image) => normalizeImagePath(image.trim()))
    .filter(Boolean)
}

function getDetailValue(source = {}, keys = []) {
  if (!source || typeof source !== 'object' || Array.isArray(source)) {
    return ''
  }

  const normalizedKeys = keys.map((key) => String(key).toLowerCase().replace(/[^a-z]/g, ''))
  const entry = Object.entries(source).find(([key]) => normalizedKeys.includes(String(key).toLowerCase().replace(/[^a-z]/g, '')))

  return String(entry?.[1] || '').trim()
}

function inferDetails(product = {}) {
  const storedDetails = product.details && !Array.isArray(product.details) && typeof product.details === 'object'
    ? product.details
    : {}
  const productDetails = product.productDetails && !Array.isArray(product.productDetails) && typeof product.productDetails === 'object'
    ? product.productDetails
    : {}
  const detail = product.detail && !Array.isArray(product.detail) && typeof product.detail === 'object'
    ? product.detail
    : {}
  const specifications = product.specifications && !Array.isArray(product.specifications) && typeof product.specifications === 'object'
    ? product.specifications
    : {}
  const specs = product.specs && !Array.isArray(product.specs) && typeof product.specs === 'object'
    ? product.specs
    : {}
  const detailSources = [storedDetails, productDetails, detail, specifications, specs, product]
  const readDetail = (keys) => detailSources.map((source) => getDetailValue(source, keys)).find(Boolean) || ''

  return {
    fabric: readDetail(['fabric']),
    work: readDetail(['work']),
    occasion: readDetail(['occasion', 'occesion', 'ocassion']),
    craftedIn: readDetail(['craftedIn', 'crafted in', 'craftedin', 'crafted_in', 'craft', 'crafted']),
  }
}

function inferSourcePage(product = {}) {
  return product.sourcePage || ''
}

function inferVisibilityFlag(product = {}, key, sourcePage) {
  const directValue = product[key]
  if (typeof directValue === 'boolean') {
    return directValue
  }

  if (key === 'isNewArrival') {
    if (typeof product.showInNewArrival === 'boolean') {
      return product.showInNewArrival
    }

    return product.tag === 'new' || sourcePage === 'newArrival'
  }

  if (typeof product.showInBestSeller === 'boolean') {
    return product.showInBestSeller
  }

  return product.tag === 'best' || sourcePage === 'bestSeller' || sourcePage === 'homeBestSellers'
}

export function normalizeCatalogProduct(product = {}) {
  const sourcePage = inferSourcePage(product)
  const images = inferImages(product)
  const details = inferDetails(product)
  const stock = inferStock(product)
  const imageToShow = images[0] || PLACEHOLDER_IMAGE

  return {
    ...product,
    id: String(product.id || ''),
    name: String(product.name || '').trim(),
    price: Number(product.price) || 0,
    stock,
    category: String(inferCategory(product)).trim(),
    collection: String(inferCollection(product)).trim(),
    description: String(product.description || '').trim(),
    details,
    images,
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

export function getProductImage(product = {}) {
  return Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : PLACEHOLDER_IMAGE
}

function getAdminCatalogProducts() {
  const adminProducts = getData(PRODUCT_CHANNEL_KEY, [])
  const normalizedAdminProducts = Array.isArray(adminProducts)
    ? adminProducts.map(normalizeCatalogProduct).filter((product) => product.id)
    : []

  return Array.from(new Map(normalizedAdminProducts.map((product) => [product.id, product])).values())
}

export function getStoredCatalogProducts() {
  const adminProducts = getAdminCatalogProducts()

  if (!adminProducts.length) {
    console.warn('No admin products found')
  }

  return adminProducts
}

export function saveStoredCatalogProducts(products) {
  const adminProducts = products
    .map(normalizeCatalogProduct)
    .filter((product) => product.id)

  setData(PRODUCT_CHANNEL_KEY, adminProducts)
}

export function saveAdminCatalogProducts(products) {
  const normalizedProducts = products.map(normalizeCatalogProduct).filter((product) => product.id)
  setData(PRODUCT_CHANNEL_KEY, Array.from(new Map(normalizedProducts.map((product) => [product.id, product])).values()))
}

export function getAdminCatalogProductOverrides() {
  return getAdminCatalogProducts()
}

export function subscribeCatalogProducts(callback) {
  return subscribeToStorage(PRODUCT_CHANNEL_KEY, callback)
}

export function getCatalogOptions() {
  return {
    categories: CATEGORY_OPTIONS,
    collections: COLLECTION_OPTIONS,
  }
}

export function getProductsForListing(products, listingKey) {
  const normalizedProducts = products.map(normalizeCatalogProduct)
  const getUniquePageProducts = (items) => Array.from(new Map(items.map((product) => [product.id, product])).values())

  if (listingKey === 'newArrival') {
    return getUniquePageProducts(normalizedProducts.filter((product) => product.isNewArrival))
  }

  if (listingKey === 'bestSeller') {
    return getUniquePageProducts(normalizedProducts.filter((product) => product.isBestSeller))
  }

  if (listingKey === 'collection1') {
    return getUniquePageProducts(normalizedProducts.filter((product) => product.collection === 'collection1'))
  }

  if (listingKey === 'collection2') {
    return getUniquePageProducts(normalizedProducts.filter((product) => product.collection === 'collection2'))
  }

  if (listingKey === 'collection3') {
    return getUniquePageProducts(normalizedProducts.filter((product) => product.collection === 'collection3'))
  }

  return getUniquePageProducts(normalizedProducts)
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
