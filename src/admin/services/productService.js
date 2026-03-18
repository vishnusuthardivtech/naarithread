import { allProducts } from '../../data/products'
import {
  ADMIN_PRODUCTS_STORAGE_KEY,
  createAdminId,
  hasAdminStorageKey,
  readAdminStorage,
  writeAdminStorage,
} from '../api/storage'

const CHANNEL = 'products'

function buildSeedProducts() {
  const uniqueProducts = Array.from(new Map(allProducts.map((product) => [product.id, product])).values())
  const now = new Date().toISOString()

  return uniqueProducts.map((product, index) => ({
    id: product.id || createAdminId('product'),
    name: product.name,
    category: product.category || 'Lehenga',
    price: Number(product.price) || 0,
    image: product.image || '',
    sku: `NT-${String(index + 1).padStart(4, '0')}`,
    stock: 1,
    status: 'active',
    description: '',
    createdAt: now,
    updatedAt: now,
  }))
}

function ensureProducts() {
  if (!hasAdminStorageKey(ADMIN_PRODUCTS_STORAGE_KEY)) {
    writeAdminStorage(ADMIN_PRODUCTS_STORAGE_KEY, buildSeedProducts(), CHANNEL)
  }

  return readAdminStorage(ADMIN_PRODUCTS_STORAGE_KEY, [])
}

function persistProducts(products) {
  writeAdminStorage(ADMIN_PRODUCTS_STORAGE_KEY, products, CHANNEL)
  return products
}

export const productService = {
  async getAll() {
    return ensureProducts().slice().sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
  },

  async getById(id) {
    return ensureProducts().find((product) => product.id === id) ?? null
  },

  async create(payload) {
    const products = ensureProducts()
    const now = new Date().toISOString()
    const product = {
      id: createAdminId('product'),
      name: payload.name.trim(),
      category: payload.category.trim(),
      price: Number(payload.price) || 0,
      image: payload.image.trim(),
      sku: payload.sku.trim() || `NT-${Math.floor(Math.random() * 100000)}`,
      stock: Number(payload.stock) || 0,
      status: payload.status || 'draft',
      description: payload.description.trim(),
      createdAt: now,
      updatedAt: now,
    }

    persistProducts([product, ...products])
    return product
  },

  async update(id, payload) {
    const products = ensureProducts()
    let updatedProduct = null

    const nextProducts = products.map((product) => {
      if (product.id !== id) {
        return product
      }

      updatedProduct = {
        ...product,
        ...payload,
        price: Number(payload.price ?? product.price) || 0,
        stock: Number(payload.stock ?? product.stock) || 0,
        updatedAt: new Date().toISOString(),
      }

      return updatedProduct
    })

    if (!updatedProduct) {
      throw new Error('Product not found')
    }

    persistProducts(nextProducts)
    return updatedProduct
  },

  async delete(id) {
    const products = ensureProducts()
    const nextProducts = products.filter((product) => product.id !== id)

    if (nextProducts.length === products.length) {
      throw new Error('Product not found')
    }

    persistProducts(nextProducts)
    return true
  },
}
