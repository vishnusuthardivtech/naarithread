import { readStorage, writeStorage } from './storage'
import { getCurrentUser } from './cart'

export function getWishlistKey(user = getCurrentUser()) {
  return user ? `wishlist_${user.email}` : null
}

export function getWishlist(user = getCurrentUser()) {
  const key = getWishlistKey(user)
  return key ? readStorage(key, []) : []
}

export function saveWishlist(wishlist, user = getCurrentUser()) {
  const key = getWishlistKey(user)
  if (!key) {
    return
  }

  writeStorage(key, wishlist)
}

export function isWishlisted(id, user = getCurrentUser()) {
  return getWishlist(user).some((item) => item.id === id)
}

export function toggleWishlistItem(product, user = getCurrentUser()) {
  const wishlist = getWishlist(user)
  const exists = wishlist.find((item) => item.id === product.id)
  const nextWishlist = exists
    ? wishlist.filter((item) => item.id !== product.id)
    : [...wishlist, product]

  saveWishlist(nextWishlist, user)
  return nextWishlist
}

