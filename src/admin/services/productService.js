import { createAdminId } from '../api/storage'
import { getAdminCatalogProductOverrides, getCatalogOptions, getStoredCatalogProducts, normalizeCatalogProduct, saveAdminCatalogProducts } from '../../services/catalogService'

function validateProductPayload(payload) {
  const name = String(payload.name ?? '').trim()
  const category = String(payload.category ?? '').trim()
  const description = String(payload.description ?? '').trim()
  const price = Number(payload.price)
  const stock = Number(payload.stock)
  const images = sanitizeImages(payload.images)
  const details = sanitizeDetails(payload.details)

  if (!name) {
    throw new Error('Product name is required')
  }

  if (!category) {
    throw new Error('Category is required')
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Price must be greater than zero')
  }

  if (!Number.isFinite(stock) || stock < 0) {
    throw new Error('Stock must be zero or greater')
  }

  if (!images.length) {
    throw new Error('Please enter at least one image URL')
  }

  if (!description) {
    throw new Error('Description is required')
  }

  if (!details.fabric) {
    throw new Error('Fabric is required')
  }

  if (!details.work) {
    throw new Error('Work is required')
  }

  if (!details.occasion) {
    throw new Error('Occasion is required')
  }

  if (!details.craftedIn) {
    throw new Error('Crafted In is required')
  }
}

function sanitizeImages(images = []) {
  const baseUrl = String(import.meta.env.BASE_URL || '/')
  const baseUrlWithoutSlash = baseUrl.replace(/\/+$/, '')

  return Array.isArray(images)
    ? images.filter((image) => typeof image === 'string').map((image) => image.trim()).filter(Boolean)
      .map((image) => {
        let normalizedImage = String(image).replace(/\\/g, '/').trim()
        if (!normalizedImage) return ''

        normalizedImage = normalizedImage.replace(/^file:\/\/\/+/i, '')
        normalizedImage = normalizedImage.replace(/^[A-Za-z]:\//, '')
        normalizedImage = normalizedImage.replace(/^[A-Za-z]:\\/, '')

        if (/\/public\/images\//i.test(normalizedImage)) {
          normalizedImage = normalizedImage.replace(/^.*\/public\/images\//i, '/images/')
        } else if (/^public\/images\//i.test(normalizedImage)) {
          normalizedImage = normalizedImage.replace(/^public\/images\//i, '/images/')
        } else if (/\/images\//i.test(normalizedImage)) {
          normalizedImage = normalizedImage.replace(/^.*(?=\/images\/)/, '')
        }

        normalizedImage = normalizedImage.replace(/\/+/g, '/')
        if (!normalizedImage.startsWith('/')) {
          normalizedImage = `/${normalizedImage}`
        }

        return normalizedImage.startsWith(baseUrlWithoutSlash)
          ? normalizedImage
          : `${baseUrlWithoutSlash}${normalizedImage}`
      })
      .filter(Boolean)
    : []
}

function sanitizeDetails(details = {}) {
  return {
    fabric: String(details.fabric || '').trim(),
    work: String(details.work || '').trim(),
    occasion: String(details.occasion || '').trim(),
    craftedIn: String(details.craftedIn || '').trim(),
  }
}

function getProducts() {
  return getStoredCatalogProducts()
}

function persistAdminProducts(products) {
  saveAdminCatalogProducts(products)
  return products
}

export const productService = {
  async getAll() {
    return getProducts()
      .slice()
      .sort((left, right) => String(right.updatedAt || '').localeCompare(String(left.updatedAt || '')))
  },

  async getById(id) {
    return getProducts().find((product) => product.id === id) ?? null
  },

  async getOptions() {
    return getCatalogOptions(getProducts())
  },

  async create(payload) {
    validateProductPayload(payload)
    const adminProducts = getAdminCatalogProductOverrides()
    const now = new Date().toISOString()
    const images = sanitizeImages(payload.images)
    const description = payload.description.trim()
    const details = sanitizeDetails(payload.details)
    const product = normalizeCatalogProduct({
      id: createAdminId('product'),
      name: payload.name.trim(),
      category: payload.category.trim(),
      collection: String(payload.collection ?? '').trim(),
      price: Number(payload.price) || 0,
      images: [...images],
      stock: Number(payload.stock) || 0,
      isNewArrival: Boolean(payload.isNewArrival),
      isBestSeller: Boolean(payload.isBestSeller),
      description,
      details,
      createdAt: now,
      updatedAt: now,
      sku: String(payload.sku ?? '').trim(),
    })

    persistAdminProducts([...adminProducts, product])
    return product
  },

  async update(id, payload) {
    validateProductPayload(payload)
    const products = getProducts()
    const adminProducts = getAdminCatalogProductOverrides()
    const existingProduct = products.find((product) => product.id === id)

    if (!existingProduct) {
      throw new Error('Product not found')
    }

    const images = payload.images ? sanitizeImages(payload.images) : [...(existingProduct.images || [])]
    const description = String(payload.description ?? existingProduct.description).trim()
    const details = payload.details ? sanitizeDetails(payload.details) : sanitizeDetails(existingProduct.details)
    const updatedProduct = normalizeCatalogProduct({
      ...existingProduct,
      ...payload,
      name: String(payload.name ?? existingProduct.name).trim(),
      category: String(payload.category ?? existingProduct.category).trim(),
      collection: String(payload.collection ?? existingProduct.collection).trim(),
      description,
      details,
      price: Number(payload.price ?? existingProduct.price) || 0,
      stock: Number(payload.stock ?? existingProduct.stock) || 0,
      images: [...images],
      isNewArrival: Boolean(payload.isNewArrival ?? existingProduct.isNewArrival),
      isBestSeller: Boolean(payload.isBestSeller ?? existingProduct.isBestSeller),
      sku: String(payload.sku ?? existingProduct.sku).trim(),
      updatedAt: new Date().toISOString(),
    })

    const nextAdminProducts = adminProducts.map((product) => (product.id === id ? updatedProduct : product))

    persistAdminProducts(nextAdminProducts)
    return updatedProduct
  },

  async delete(id) {
    const adminProducts = getAdminCatalogProductOverrides()
    const nextProducts = adminProducts.filter((product) => product.id !== id)

    if (nextProducts.length === adminProducts.length) {
      throw new Error('Product not found')
    }

    persistAdminProducts(nextProducts)
    return true
  },
}
