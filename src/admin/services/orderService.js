import { getAllLocalStorageEntries, readAdminStorage, writeAdminStorage } from '../api/storage'

const ORDERS_PREFIX = 'ntOrders_'
const CHANNEL = 'orders'
const STATUS_ORDER = {
  Processing: 1,
  Paid: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 5,
}

function parseOrdersEntry([key, rawValue]) {
  if (!key.startsWith(ORDERS_PREFIX) || !rawValue) {
    return []
  }

  const userEmail = key.slice(ORDERS_PREFIX.length)

  try {
    const orders = JSON.parse(rawValue)
    return Array.isArray(orders)
      ? orders.map((order) => ({
          ...order,
          id: order.orderId,
          userEmail,
          customerName: order.customerName || order.address?.fullName || userEmail.split('@')[0],
          customerEmail: order.customerEmail || userEmail,
          itemCount: Array.isArray(order.items)
            ? order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
            : 0,
          total:
            Number(order.total) ||
            (Array.isArray(order.items)
              ? order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
              : 0),
          createdAt: order.createdAt || order.date || new Date(0).toISOString(),
        }))
      : []
  } catch {
    return []
  }
}

function getOrdersWithKeys() {
  return getAllLocalStorageEntries()
    .filter((entry) => Array.isArray(entry) && String(entry[0]).startsWith(ORDERS_PREFIX))
    .flatMap((entry) => parseOrdersEntry(entry).map((order) => ({ storageKey: entry[0], order })))
}

export const orderStatusOptions = ['Processing', 'Paid', 'Shipped', 'Delivered', 'Cancelled']

export const orderService = {
  async getAll() {
    return getOrdersWithKeys()
      .map(({ order }) => order)
      .sort((left, right) => {
        const dateDelta = new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        if (dateDelta !== 0) {
          return dateDelta
        }

        return (STATUS_ORDER[left.status] ?? 99) - (STATUS_ORDER[right.status] ?? 99)
      })
  },

  async getById(id) {
    return getOrdersWithKeys().find(({ order }) => order.id === id)?.order ?? null
  },

  async create(payload) {
    const storageKey = `${ORDERS_PREFIX}${payload.userEmail}`
    const existingOrders = readAdminStorage(storageKey, [])
    const order = {
      ...payload,
      id: payload.orderId,
    }

    writeAdminStorage(storageKey, [order, ...existingOrders], CHANNEL)
    return order
  },

  async update(id, updates) {
    const match = getOrdersWithKeys().find((entry) => entry.order.id === id)
    if (!match) {
      throw new Error('Order not found')
    }

    const existingOrders = readAdminStorage(match.storageKey, [])
    const nextOrders = existingOrders.map((order) =>
      order.orderId === id
        ? {
            ...order,
            ...updates,
          }
        : order,
    )

    writeAdminStorage(match.storageKey, nextOrders, CHANNEL)
    return {
      ...match.order,
      ...updates,
    }
  },

  async delete(id) {
    const match = getOrdersWithKeys().find((entry) => entry.order.id === id)
    if (!match) {
      throw new Error('Order not found')
    }

    const existingOrders = readAdminStorage(match.storageKey, [])
    const nextOrders = existingOrders.filter((order) => order.orderId !== id)
    writeAdminStorage(match.storageKey, nextOrders, CHANNEL)
    return true
  },
}
