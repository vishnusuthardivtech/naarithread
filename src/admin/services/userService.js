import { readAdminStorage, removeAdminStorage, writeAdminStorage } from '../api/storage'
import { orderService } from './orderService'

const USERS_KEY = 'ntUsers'
const CHANNEL = 'users'
const PROFILE_PREFIX = 'ntProfile_'
const ADDRESS_PREFIX = 'ntAddress_'
const LEGACY_WISHLIST_PREFIX = 'wishlist_'
const CART_PREFIX = 'cart_'

function normalizeUser(user = {}) {
  return {
    ...user,
    id: user.id || user.email,
    name: user.name || user.fullName || user.email || 'Customer',
    email: user.email || '',
    createdAt: user.createdAt || user.joinedAt || null,
  }
}

function mergeUsersFromOrders(users, orders) {
  const byEmail = new Map(users.filter((user) => user.email).map((user) => [user.email, user]))

  orders.forEach((order) => {
    const email = order.userEmail || order.customerEmail || order.address?.email || ''
    if (!email) {
      return
    }

    const existingUser = byEmail.get(email)
    byEmail.set(email, {
      ...(existingUser || {}),
      id: email,
      email,
      name: existingUser?.name || order.customerName || email.split('@')[0] || 'Customer',
      createdAt: existingUser?.createdAt || order.createdAt || order.date || null,
    })
  })

  return Array.from(byEmail.values())
}

function decorateUsers(users, orders) {
  return users
    .map(normalizeUser)
    .map((user) => {
      const userOrders = orders.filter((order) => (order.userEmail || order.customerEmail) === user.email)
      return {
        ...user,
        orderCount: userOrders.length,
        joinedAt: user.createdAt,
      }
    })
    .sort((left, right) => (left.name || left.email).localeCompare(right.name || right.email))
}

export const userService = {
  async getAll() {
    const storedUsers = readAdminStorage(USERS_KEY, []).map(normalizeUser)
    const orders = await orderService.getAll()
    return decorateUsers(mergeUsersFromOrders(storedUsers, orders), orders)
  },

  async getById(id) {
    const users = await this.getAll()
    return users.find((user) => user.id === id || user.email === id) ?? null
  },

  async create(payload) {
    const users = readAdminStorage(USERS_KEY, []).map(normalizeUser)
    if (users.some((user) => user.email === payload.email)) {
      throw new Error('User already exists')
    }

    const nextUser = normalizeUser({
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    })

    writeAdminStorage(USERS_KEY, [...users, nextUser], CHANNEL)
    return nextUser
  },

  async update(id, updates) {
    const users = readAdminStorage(USERS_KEY, []).map(normalizeUser)
    let updatedUser = null

    const nextUsers = users.map((user) => {
      if (user.email !== id && user.id !== id) {
        return user
      }

      updatedUser = normalizeUser({
        ...user,
        ...updates,
      })

      return updatedUser
    })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    writeAdminStorage(USERS_KEY, nextUsers, CHANNEL)
    return updatedUser
  },

  async delete(id) {
    const users = readAdminStorage(USERS_KEY, []).map(normalizeUser)
    const nextUsers = users.filter((user) => user.email !== id && user.id !== id)
    if (nextUsers.length === users.length) {
      throw new Error('User not found')
    }

    writeAdminStorage(USERS_KEY, nextUsers, CHANNEL)
    removeAdminStorage(`${PROFILE_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${ADDRESS_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${LEGACY_WISHLIST_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${CART_PREFIX}${id}`, CHANNEL)
    return true
  },
}
