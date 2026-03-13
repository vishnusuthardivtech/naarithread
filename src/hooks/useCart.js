import { useMemo } from 'react'
import { getCart, getCartCount } from '../utils/cart'

export function useCart(user, version) {
  return useMemo(() => ({
    items: getCart(user),
    count: getCartCount(user),
  }), [user, version])
}

