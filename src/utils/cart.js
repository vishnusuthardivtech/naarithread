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

const getItemSize = (item = {}) => item.selectedSize || item.size || ''

export function addCartItem(product, user = getCurrentUser()) {
  const cart = getCart(user)
  const productSize = getItemSize(product)
  const existingItemIndex = cart.findIndex((item) => item.id === product.id)

  if (existingItemIndex >= 0) {
    const existingItem = cart[existingItemIndex]
    const nextSize = productSize || getItemSize(existingItem)
    const nextCart = cart
      .map((item, index) => {
        if (index !== existingItemIndex) {
          return item
        }

        return {
          ...existingItem,
          ...product,
          quantity: existingItem.quantity || product.quantity || 1,
          size: nextSize,
          selectedSize: nextSize,
        }
      })
      .filter((item, index) => index === existingItemIndex || item.id !== product.id)

    saveCart(nextCart, user)
    return nextCart
  }

  const nextCart = [
    ...cart,
    {
      ...product,
      size: productSize,
      selectedSize: productSize,
    },
  ]

  saveCart(nextCart, user)
  return nextCart
}

export function updateCartItem(id, quantity, size) {
  const cart = getCart().map((item) => {
    if (item.id === id) {
      return { ...item, quantity }
    }

    return item
  })

  saveCart(cart)
  return cart
}

export function removeCartItem(id, size) {
  const cart = getCart().filter(
    (item) => item.id !== id,
  )
  saveCart(cart)
  return cart
}

export function clearCart(user = getCurrentUser()) {
  saveCart([], user)
}

