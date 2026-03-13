import { useMemo } from 'react'
import { getWishlist } from '../utils/wishlist'

export function useWishlist(user, version) {
  return useMemo(() => {
    const items = getWishlist(user)
    return {
      items,
      count: items.length,
    }
  }, [user, version])
}

