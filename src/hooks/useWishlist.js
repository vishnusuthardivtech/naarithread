import { useEffect, useMemo, useState } from 'react'
import { getData, removeData, setData, subscribeToStorage } from '../utils/localStorage'

const WISHLIST_KEY = 'ntWishlist'

const getWishlistEntries = () => getData(WISHLIST_KEY, [])

const toPriceNumber = (value, fallback = 0) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeWishlistItem = (product, user) => ({
  id: product?.id,
  name: product?.name || product?.title || '',
  price: toPriceNumber(product?.price, Number(String(product?.priceLabel ?? '').replace(/[^0-9]/g, '')) || 0),
  images: Array.isArray(product?.images) ? [...product.images] : [],
  userEmail: product?.userEmail || user.email,
})

const withoutUserEmail = (item) => {
  const nextItem = { ...item }
  delete nextItem.userEmail
  return nextItem
}

const getUserWishlist = (user) => {
  if (!user?.email) {
    return []
  }

  const legacyKey = `wishlist_${user.email}`
  const entries = getWishlistEntries()
  const hasCurrentUserEntries = entries.some((item) => !item?.userEmail || item.userEmail === user.email)

  if (!hasCurrentUserEntries) {
    const legacyItems = getData(legacyKey, [])

    if (legacyItems.length > 0) {
      const migratedEntries = [...entries, ...legacyItems.map((item) => normalizeWishlistItem(item, user))]
      setData(WISHLIST_KEY, migratedEntries)
      removeData(legacyKey)
      return migratedEntries
        .filter((item) => item.userEmail === user.email)
        .map(withoutUserEmail)
    }
  }

  return entries
    .filter((item) => !item?.userEmail || item.userEmail === user.email)
    .map(withoutUserEmail)
}

export function useWishlist(user) {
  const [items, setItems] = useState(() => getUserWishlist(user))

  useEffect(() => {
    setItems(getUserWishlist(user))
  }, [user])

  useEffect(() => subscribeToStorage(WISHLIST_KEY, () => {
    setItems(getUserWishlist(user))
  }), [user])

  const toggleItem = (product) => {
    if (!user?.email) {
      return []
    }

    const entries = getWishlistEntries()
    const itemExists = entries.some((item) => (!item?.userEmail || item.userEmail === user.email) && item.id === product.id)
    const nextEntries = itemExists
      ? entries.filter((item) => !((!item?.userEmail || item.userEmail === user.email) && item.id === product.id))
      : [...entries, normalizeWishlistItem(product, user)]
    const nextItems = nextEntries
      .filter((item) => !item?.userEmail || item.userEmail === user.email)
      .map(withoutUserEmail)

    setItems(nextItems)
    setData(WISHLIST_KEY, nextEntries)
    return nextItems
  }

  const removeItem = (id) => {
    if (!user?.email) {
      return
    }

    const nextEntries = getWishlistEntries().filter((item) => !((!item?.userEmail || item.userEmail === user.email) && item.id === id))
    const nextItems = nextEntries
      .filter((item) => !item?.userEmail || item.userEmail === user.email)
      .map(withoutUserEmail)

    setItems(nextItems)
    setData(WISHLIST_KEY, nextEntries)
  }

  const hasItem = (id) => items.some((item) => item.id === id)

  return useMemo(() => ({
    items,
    count: items.length,
    toggleItem,
    removeItem,
    hasItem,
  }), [items])
}
