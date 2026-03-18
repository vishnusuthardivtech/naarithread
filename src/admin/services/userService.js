import { readAdminStorage, removeAdminStorage, writeAdminStorage } from '../api/storage'

const USERS_KEY = 'ntUsers'
const ORDERS_PREFIX = 'ntOrders_'
const PROFILE_PREFIX = 'ntProfile_'
const ADDRESS_PREFIX = 'ntAddress_'
const WISHLIST_PREFIX = 'wishlist_'
const CART_PREFIX = 'cart_'
const CHANNEL = 'users'

function getUserOrders(email) {
  return readAdminStorage(`${ORDERS_PREFIX}${email}`, [])
}

function buildUserRecord(user) {
  const orders = getUserOrders(user.email)
  const totalSpent = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)

  return {
    ...user,
    id: user.email,
    createdAt: user.createdAt || null,
    orderCount: orders.length,
    totalSpent,
  }
}

export const userService = {
  async getAll() {
    return readAdminStorage(USERS_KEY, [])
      .map(buildUserRecord)
      .sort((left, right) => left.name.localeCompare(right.name))
  },

  async getById(id) {
    const user = readAdminStorage(USERS_KEY, []).find((entry) => entry.email === id)
    return user ? buildUserRecord(user) : null
  },

  async create(payload) {
    const users = readAdminStorage(USERS_KEY, [])
    if (users.some((user) => user.email === payload.email)) {
      throw new Error('User already exists')
    }

    const nextUser = {
      ...payload,
      createdAt: payload.createdAt || new Date().toISOString(),
    }

    writeAdminStorage(USERS_KEY, [...users, nextUser], CHANNEL)
    return buildUserRecord(nextUser)
  },

  async update(id, updates) {
    const users = readAdminStorage(USERS_KEY, [])
    let updatedUser = null

    const nextUsers = users.map((user) => {
      if (user.email !== id) {
        return user
      }

      updatedUser = {
        ...user,
        ...updates,
      }

      return updatedUser
    })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    writeAdminStorage(USERS_KEY, nextUsers, CHANNEL)
    return buildUserRecord(updatedUser)
  },

  async delete(id) {
    const users = readAdminStorage(USERS_KEY, [])
    const nextUsers = users.filter((user) => user.email !== id)
    if (nextUsers.length === users.length) {
      throw new Error('User not found')
    }

    writeAdminStorage(USERS_KEY, nextUsers, CHANNEL)
    removeAdminStorage(`${ORDERS_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${PROFILE_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${ADDRESS_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${WISHLIST_PREFIX}${id}`, CHANNEL)
    removeAdminStorage(`${CART_PREFIX}${id}`, CHANNEL)
    return true
  },
}
