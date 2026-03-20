import { ADMIN_PRODUCTS_STORAGE_KEY, createAdminId, readAdminStorage, writeAdminStorage } from '../api/storage'

const CHANNEL = 'products'

function getProducts() {
  return readAdminStorage(ADMIN_PRODUCTS_STORAGE_KEY, [])
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
      status: payload.status || 'active',
      description: payload.description.trim(),
      createdAt: now,
      updatedAt: now,
    }

    persistProducts([product, ...products])
    return product
  },

  async update(id, payload) {
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
