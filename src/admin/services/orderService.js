import { getAllLocalStorageEntries, readAdminStorage, writeAdminStorage } from '../api/storage'

const ORDERS_KEY = 'ntOrders'
const LEGACY_PREFIX = 'ntOrders_'
const CHANNEL = 'orders'
const STATUS_ORDER = {
  Placed: 1,
  Processing: 2,
  Paid: 3,
  Shipped: 4,
  Delivered: 5,
  Cancelled: 6,
}

function normalizeAddress(address = {}) {
  return {
    fullName: address.fullName || address.name || '',
    phone: address.phone || '',
    email: address.email || '',
    address1: address.address1 || address.address || address.line1 || '',
    address2: address.address2 || address.line2 || '',
    city: address.city || '',
    state: address.state || '',
    pincode: address.pincode || '',
  }
}

function normalizeItem(item = {}) {
  return {
    id: item.id || item.productId || '',
    name: item.name || item.title || 'Product',
    price: Number(item.price) || 0,
    quantity: Number(item.quantity) || 1,
    images: Array.isArray(item.images) ? item.images : [item.image || item.img].filter(Boolean),
    image: item.images?.[0] || item.image || item.img || '',
  }
}

function normalizeOrder(order = {}, fallbackEmail = '') {
  const items = Array.isArray(order.items)
    ? order.items.map(normalizeItem)
    : Array.isArray(order.products)
      ? order.products.map(normalizeItem)
      : []
  const address = normalizeAddress(order.address)
  const customerEmail = order.customerEmail || order.userEmail || address.email || fallbackEmail
  const customerName = order.customerName || address.fullName || customerEmail.split('@')[0] || 'Customer'

  return {
    ...order,
    id: order.id || order.orderId || `NT_${Date.now()}`,
    orderId: order.orderId || order.id || `NT_${Date.now()}`,
    items,
    products: items,
    address,
    customerName,
    customerEmail,
    userEmail: customerEmail,
    total:
      Number(order.total) ||
      items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
    status: order.status || 'Placed',
    createdAt: order.createdAt || order.date || new Date().toISOString(),
    date: order.date || order.createdAt || new Date().toISOString(),
    itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  }
}

function readLegacyOrders() {
  return getAllLocalStorageEntries()
    .filter((entry) => Array.isArray(entry) && String(entry[0]).startsWith(LEGACY_PREFIX))
    .flatMap(([key, rawValue]) => {
      try {
        const parsed = JSON.parse(rawValue)
        const fallbackEmail = String(key).slice(LEGACY_PREFIX.length)
        return Array.isArray(parsed) ? parsed.map((order) => normalizeOrder(order, fallbackEmail)) : []
      } catch {
        return []
      }
    })
}

function getOrders() {
  const currentOrders = readAdminStorage(ORDERS_KEY, [])

  if (Array.isArray(currentOrders) && currentOrders.length > 0) {
    return currentOrders.map((order) => normalizeOrder(order))
  }

  const legacyOrders = readLegacyOrders()
  if (legacyOrders.length > 0) {
    writeAdminStorage(ORDERS_KEY, legacyOrders, CHANNEL)
  }

  return legacyOrders
}

function persistOrders(orders) {
  writeAdminStorage(
    ORDERS_KEY,
    orders.map((order) => normalizeOrder(order)),
    CHANNEL,
  )
}

export const orderStatusOptions = ['Placed', 'Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled']

export const orderService = {
  async getAll() {
    return getOrders().sort((left, right) => {
      const dateDelta = new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      if (dateDelta !== 0) {
        return dateDelta
      }

      return (STATUS_ORDER[left.status] ?? 99) - (STATUS_ORDER[right.status] ?? 99)
    })
  },

  async getById(id) {
    return getOrders().find((order) => order.id === id) ?? null
  },

  async create(payload) {
    const orders = getOrders()
    const order = normalizeOrder(payload, payload.userEmail || payload.customerEmail || '')
    persistOrders([order, ...orders])
    return order
  },

  async update(id, updates) {
    const orders = getOrders()
    let updatedOrder = null

    const nextOrders = orders.map((order) => {
      if (order.id !== id) {
        return order
      }

      updatedOrder = normalizeOrder({ ...order, ...updates }, order.userEmail)
      return updatedOrder
    })

    if (!updatedOrder) {
      throw new Error('Order not found')
    }

    persistOrders(nextOrders)
    return updatedOrder
  },

  async delete(id) {
    const orders = getOrders()
    const nextOrders = orders.filter((order) => order.id !== id)

    if (nextOrders.length === orders.length) {
      throw new Error('Order not found')
    }

    persistOrders(nextOrders)
    return true
  },
}
