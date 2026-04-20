import { createAdminId } from '../api/storage'
import { getCatalogOptions, getStoredCatalogProducts, normalizeCatalogProduct, saveStoredCatalogProducts } from '../../services/catalogService'

function validateProductPayload(payload) {
  const name = String(payload.name ?? '').trim()
  const category = String(payload.category ?? '').trim()
  const description = String(payload.description ?? '').trim()
  const price = Number(payload.price)
  const stock = Number(payload.stock)
  const images = Array.isArray(payload.images) ? payload.images.filter(Boolean) : []

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

  if (!description) {
    throw new Error('Description is required')
  }
}

function getProducts() {
  return getStoredCatalogProducts()
}

function persistProducts(products) {
  saveStoredCatalogProducts(products)
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
    const products = getProducts()
    const now = new Date().toISOString()
    const product = normalizeCatalogProduct({
      id: createAdminId('product'),
      name: payload.name.trim(),
      category: payload.category.trim(),
      collection: String(payload.collection ?? '').trim(),
      price: Number(payload.price) || 0,
      images: payload.images,
      stock: Number(payload.stock) || 0,
      isNewArrival: Boolean(payload.isNewArrival),
      isBestSeller: Boolean(payload.isBestSeller),
      description: payload.description.trim(),
      createdAt: now,
      updatedAt: now,
      sku: String(payload.sku ?? '').trim(),
    })

    persistProducts([product, ...products])
    return product
  },

  async update(id, payload) {
    validateProductPayload(payload)
    const products = getProducts()
    let updatedProduct = null

    const nextProducts = products.map((product) => {
      if (product.id !== id) {
        return product
      }

      updatedProduct = normalizeCatalogProduct({
        ...product,
        ...payload,
        name: String(payload.name ?? product.name).trim(),
        category: String(payload.category ?? product.category).trim(),
        collection: String(payload.collection ?? product.collection).trim(),
        description: String(payload.description ?? product.description).trim(),
        price: Number(payload.price ?? product.price) || 0,
        stock: Number(payload.stock ?? product.stock) || 0,
        images: payload.images ?? product.images,
        isNewArrival: Boolean(payload.isNewArrival ?? product.isNewArrival),
        isBestSeller: Boolean(payload.isBestSeller ?? product.isBestSeller),
        sku: String(payload.sku ?? product.sku).trim(),
        updatedAt: new Date().toISOString(),
      })

      return updatedProduct
    })

    if (!updatedProduct) {
      throw new Error('Product not found')
    }

    persistProducts(nextProducts)
    return updatedProduct
  },

  async delete(id) {
    const products = getProducts()
    const nextProducts = products.filter((product) => product.id !== id)

    if (nextProducts.length === products.length) {
      throw new Error('Product not found')
    }

    persistProducts(nextProducts)
    return true
  },
}
