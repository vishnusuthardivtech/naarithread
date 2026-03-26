import { ADMIN_PRODUCTS_STORAGE_KEY, createAdminId, readAdminStorage, writeAdminStorage } from '../api/storage'
import { allProducts } from '../../data/products'

const CHANNEL = 'products'

function normalizeStatus(status, stock) {
  if (status) {
    return status
  }

  return Number(stock) > 0 ? 'In Stock' : 'Out of Stock'
}

function validateProductPayload(payload) {
  const name = String(payload.name ?? '').trim()
  const category = String(payload.category ?? '').trim()
  const image = String(payload.image ?? '').trim()
  const description = String(payload.description ?? '').trim()
  const price = Number(payload.price)

  if (!name) {
    throw new Error('Product name is required')
  }

  if (!category) {
    throw new Error('Category is required')
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Price must be greater than zero')
  }

  if (!image) {
    throw new Error('Image URL is required')
  }

  if (!description) {
    throw new Error('Description is required')
  }
}

function getProducts() {
  const storedProducts = readAdminStorage(ADMIN_PRODUCTS_STORAGE_KEY, [])
  if (Array.isArray(storedProducts) && storedProducts.length > 0) {
    return storedProducts
  }

  return Array.isArray(allProducts) ? allProducts : []
}

function persistProducts(products) {
  writeAdminStorage(ADMIN_PRODUCTS_STORAGE_KEY, products, CHANNEL)
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

  async create(payload) {
    validateProductPayload(payload)
    const products = getProducts()
    const now = new Date().toISOString()
    const product = {
      id: createAdminId('product'),
      name: payload.name.trim(),
      category: payload.category.trim(),
      price: Number(payload.price) || 0,
      image: payload.image.trim(),
      sku: payload.sku.trim(),
      stock: Number(payload.stock) || 0,
      status: normalizeStatus(payload.status, payload.stock),
      description: payload.description.trim(),
      createdAt: now,
      updatedAt: now,
    }

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

      updatedProduct = {
        ...product,
        ...payload,
        name: String(payload.name ?? product.name).trim(),
        category: String(payload.category ?? product.category).trim(),
        image: String(payload.image ?? product.image).trim(),
        sku: String(payload.sku ?? product.sku).trim(),
        description: String(payload.description ?? product.description).trim(),
        price: Number(payload.price ?? product.price) || 0,
        stock: Number(payload.stock ?? product.stock) || 0,
        status: normalizeStatus(payload.status ?? product.status, payload.stock ?? product.stock),
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
    const products = getProducts()
    const nextProducts = products.filter((product) => product.id !== id)

    if (nextProducts.length === products.length) {
      throw new Error('Product not found')
    }

    persistProducts(nextProducts)
    return true
  },
}
