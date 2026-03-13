import { readStorage, writeStorage } from './storage'

export function getCurrentUser() {
  return readStorage('ntLoggedInUser', null)
}

export function getCartKey(user = getCurrentUser()) {
  return user ? `ntCart_${user.email}` : null
}

export function getCart(user = getCurrentUser()) {
  const key = getCartKey(user)
  return key ? readStorage(key, []) : []
}

export function saveCart(cart, user = getCurrentUser()) {
  const key = getCartKey(user)
  if (!key) {
    return
  }

  writeStorage(key, cart)
}

export function getCartCount(user = getCurrentUser()) {
  return getCart(user).reduce((sum, item) => sum + (item.quantity || 0), 0)
}

export function addCartItem(product, user = getCurrentUser()) {
  const cart = getCart(user)
  const existingItem = cart.find(
    (item) => item.id === product.id && (item.size || '') === (product.size || ''),
  )

  if (existingItem) {
    existingItem.quantity += product.quantity || 1
  } else {
    cart.push(product)
  }

  saveCart(cart, user)
  return cart
}

export function updateCartItem(id, quantity, size) {
  const cart = getCart().map((item) => {
    if (item.id === id && (item.size || '') === (size || '')) {
      return { ...item, quantity }
    }

    return item
  })

  saveCart(cart)
  return cart
}

export function removeCartItem(id, size) {
  const cart = getCart().filter(
    (item) => !(item.id === id && (item.size || '') === (size || '')),
  )
  saveCart(cart)
  return cart
}

export function clearCart(user = getCurrentUser()) {
  saveCart([], user)
}

