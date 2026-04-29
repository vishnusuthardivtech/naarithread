import { useEffect, useMemo, useState } from 'react'
import { getData, setData, subscribeToStorage } from '../utils/localStorage'

const ORDERS_KEY = 'ntOrders'

const getOrderEntries = () => getData(ORDERS_KEY, [])

const normalizeAddress = (address = {}) => ({
  fullName: address.fullName || address.name || '',
  phone: address.phone || '',
  email: address.email || '',
  address1: address.address1 || address.address || address.line1 || '',
  address2: address.address2 || address.line2 || '',
  city: address.city || '',
  state: address.state || '',
  pincode: address.pincode || '',
})

const normalizeProduct = (product = {}) => ({
  id: product?.id,
  name: product?.name || product?.title || '',
  price: Number(product.price) || 0,
  images: Array.isArray(product.images) ? product.images : [],
  quantity: product.quantity || 1,
})

const normalizeOrder = (order = {}) => ({
  id: order?.id || order?.orderId || `NT_${Date.now()}`,
  products: Array.isArray(order.products)
    ? order.products.map(normalizeProduct)
    : Array.isArray(order.items)
      ? order.items.map(normalizeProduct)
      : [],
  total: Number(order.total) || 0,
  address: normalizeAddress(order.address),
  date: order.date || order.createdAt || new Date().toISOString(),
  status: order.status || 'Placed',
  userEmail: order.userEmail || order.customerEmail || '',
})

const getUserOrders = (user) => {
  if (!user?.email) {
    return []
  }

  const legacyKey = `ntOrders_${user.email}`
  const entries = getOrderEntries().map(normalizeOrder)
  const hasCurrentUserOrders = entries.some((order) => !order?.userEmail || order.userEmail === user.email)

  if (!hasCurrentUserOrders) {
    const legacyOrders = getData(legacyKey, []).map(normalizeOrder)

    if (legacyOrders.length > 0) {
      const migratedOrders = [...entries, ...legacyOrders.map((order) => ({ ...order, userEmail: user.email }))]
      setData(ORDERS_KEY, migratedOrders)
      return migratedOrders
        .filter((order) => !order?.userEmail || order.userEmail === user.email)
        .slice()
        .reverse()
    }
  }

  return entries
    .filter((order) => !order?.userEmail || order.userEmail === user.email)
    .slice()
    .reverse()
}

export function useOrders(user) {
  const [orders, setOrders] = useState(() => getUserOrders(user))

  useEffect(() => {
    setOrders(getUserOrders(user))
  }, [user])

  useEffect(() => subscribeToStorage(ORDERS_KEY, () => {
    setOrders(getUserOrders(user))
  }), [user])

  const addOrder = ({ products = [], total = 0, address = {} }) => {
    if (!user?.email) {
      return null
    }

    const nextOrder = {
      id: `NT_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
      products: products.map(normalizeProduct),
      total,
      address: normalizeAddress(address),
      date: new Date().toISOString(),
      status: 'Placed',
      userEmail: user.email,
    }

    setData(ORDERS_KEY, [...getOrderEntries().map(normalizeOrder), nextOrder])
    return nextOrder
  }

  const removeOrder = (orderId) => {
    if (!user?.email) {
      return
    }

    const nextOrders = getOrderEntries()
      .map(normalizeOrder)
      .filter((order) => !((!order?.userEmail || order.userEmail === user.email) && order.id === orderId))

    setData(ORDERS_KEY, nextOrders)
  }

  return useMemo(() => ({
    orders,
    addOrder,
    removeOrder,
  }), [orders])
}
