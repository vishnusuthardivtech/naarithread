import { createAdminId } from '../api/storage'
import { getAdminCatalogProductOverrides, getCatalogOptions, getStoredCatalogProducts, normalizeCatalogProduct, saveAdminCatalogProducts } from '../../services/catalogService'

function validateProductPayload(payload) {
  const name = String(payload.name ?? '').trim()
  const category = String(payload.category ?? '').trim()
  const description = String(payload.description ?? '').trim()
  const price = Number(payload.price)
  const stock = Number(payload.stock)
  const images = Array.isArray(payload.images)
    ? payload.images.filter((image) => typeof image === 'string').map((image) => image.trim()).filter(Boolean)
    : []

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
    throw new Error('At least one product image is required')
  }

  if (images.some((image) => image.startsWith('data:') || image.startsWith('blob:'))) {
    throw new Error('Use image URLs only, not uploaded files')
  }

  if (!description) {
    throw new Error('Description is required')
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
    const product = normalizeCatalogProduct({
      id: createAdminId('product'),
      name: payload.name.trim(),
      category: payload.category.trim(),
      collection: String(payload.collection ?? '').trim(),
      price: Number(payload.price) || 0,
      images: payload.images.filter((image) => typeof image === 'string').map((image) => image.trim()).filter(Boolean),
      stock: Number(payload.stock) || 0,
      isNewArrival: Boolean(payload.isNewArrival),
      isBestSeller: Boolean(payload.isBestSeller),
      description: payload.description.trim(),
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

    const updatedProduct = normalizeCatalogProduct({
      ...existingProduct,
      ...payload,
      name: String(payload.name ?? existingProduct.name).trim(),
      category: String(payload.category ?? existingProduct.category).trim(),
      collection: String(payload.collection ?? existingProduct.collection).trim(),
      description: String(payload.description ?? existingProduct.description).trim(),
      price: Number(payload.price ?? existingProduct.price) || 0,
      stock: Number(payload.stock ?? existingProduct.stock) || 0,
      images: payload.images?.filter((image) => typeof image === 'string').map((image) => image.trim()).filter(Boolean) ?? existingProduct.images,
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
