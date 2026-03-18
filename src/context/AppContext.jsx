import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { allProducts, productsByPage } from '../data/products'
import { addCartItem, clearCart, getCart, getCartCount, getCurrentUser, removeCartItem, updateCartItem } from '../utils/cart'
import { getWishlist, isWishlisted, toggleWishlistItem } from '../utils/wishlist'
import { readStorage, removeStorage, writeStorage } from '../utils/storage'

const AppContext = createContext(null)

const MIN_FILTER_PRICE = 0
const MAX_FILTER_PRICE = 20000

const defaultFilters = {
  availability: false,
  priceMin: MIN_FILTER_PRICE,
  priceMax: MAX_FILTER_PRICE,
  colors: [],
  categories: [],
}

const inferColor = (product) => {
  const text = `${product.name} ${product.category}`.toLowerCase()

  if (text.includes('red') || text.includes('ruby')) return 'Red'
  if (text.includes('pink') || text.includes('blush')) return 'Pink'
  if (text.includes('green') || text.includes('emerald')) return 'Green'
  if (text.includes('black') || text.includes('midnight')) return 'Black'
  if (text.includes('gold') || text.includes('ivory') || text.includes('royale')) return 'Gold'

  return 'Gold'
}

const inferCategory = (product, sourcePage) => {
  const text = `${product.name} ${product.category}`.toLowerCase()

  if (text.includes('bridal')) return 'Bridal'
  if (sourcePage === 'collection3' || text.includes('party')) return 'Party Wear'
  if (sourcePage === 'collection1' || text.includes('mirror')) return 'Mirror Work'

  return 'Lehenga'
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [authOpen, setAuthOpen] = useState(false)
  const [cartVersion, setCartVersion] = useState(0)
  const [wishlistVersion, setWishlistVersion] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastBrowsePath, setLastBrowsePath] = useState('/')
  const [listingFilters, setListingFilters] = useState({})
  const [filterVersion, setFilterVersion] = useState(0)

  useEffect(() => {
    const loggedInUser = getCurrentUser()
    setUser(loggedInUser)
  }, [])

  const refreshCart = () => setCartVersion((value) => value + 1)
  const refreshWishlist = () => setWishlistVersion((value) => value + 1)

  const productSourceMap = useMemo(() => {
    const sourceMap = new Map()

    Object.entries(productsByPage).forEach(([pageKey, products]) => {
      if (pageKey === 'allProducts') {
        return
      }

      products.forEach((product) => {
        if (!sourceMap.has(product.id)) {
          sourceMap.set(product.id, pageKey)
        }
      })
    })

    return sourceMap
  }, [])

  const enrichedProducts = useMemo(() => {
    const uniqueProducts = Array.from(new Map(allProducts.map((product) => [product.id, product])).values())

    return uniqueProducts.map((product) => {
      const sourcePage = productSourceMap.get(product.id) ?? 'allProducts'

      return {
        ...product,
        inStock: true,
        color: inferColor(product),
        filterCategory: inferCategory(product, sourcePage),
        sourcePage,
      }
    })
  }, [productSourceMap])

  const enrichedProductMap = useMemo(() => new Map(enrichedProducts.map((product) => [product.id, product])), [enrichedProducts])

  const getListingFilters = useCallback((listingKey) => listingFilters[listingKey] ?? defaultFilters, [listingFilters])

  const normalizeFilters = useCallback((filters) => ({
    availability: Boolean(filters.availability),
    priceMin: Math.max(MIN_FILTER_PRICE, Number(filters.priceMin ?? MIN_FILTER_PRICE)),
    priceMax: Math.min(MAX_FILTER_PRICE, Number(filters.priceMax ?? MAX_FILTER_PRICE)),
    colors: [...(filters.colors ?? [])],
    categories: [...(filters.categories ?? [])],
  }), [])

  const applyListingFilters = useCallback((listingKey, filters) => {
    const normalized = normalizeFilters(filters)
    normalized.priceMin = Math.min(normalized.priceMin, normalized.priceMax)
    normalized.priceMax = Math.max(normalized.priceMax, normalized.priceMin)

    setListingFilters((current) => ({
      ...current,
      [listingKey]: normalized,
    }))
    setFilterVersion((value) => value + 1)
  }, [normalizeFilters])

  const resetListingFilters = useCallback((listingKey) => {
    setListingFilters((current) => {
      const next = { ...current }
      delete next[listingKey]
      return next
    })
    setFilterVersion((value) => value + 1)
  }, [])

  const filterProducts = useCallback((products, listingKey) => {
    const filters = listingFilters[listingKey] ?? defaultFilters

    return products
      .map((product) => enrichedProductMap.get(product.id) ?? {
        ...product,
        inStock: true,
        color: inferColor(product),
        filterCategory: inferCategory(product, 'allProducts'),
      })
      .filter((product) => {
        if (filters.availability && !product.inStock) {
          return false
        }

        const price = Number(product.price)
        if (price < filters.priceMin || price > filters.priceMax) {
          return false
        }

        if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
          return false
        }

        if (filters.categories.length > 0 && !filters.categories.includes(product.filterCategory)) {
          return false
        }

        return true
      })
  }, [enrichedProductMap, listingFilters])

  const searchProducts = useCallback((query) => {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      return []
    }

    const loweredQuery = normalizedQuery.toLowerCase()
    return enrichedProducts.filter((product) => product.name.toLowerCase().includes(loweredQuery))
  }, [enrichedProducts])

  const executeSearch = useCallback((query) => {
    const normalizedQuery = query.trim()

    if (!normalizedQuery) {
      setSearchQuery('')
      setSearchResults([])
      setIsSearching(false)
      return []
    }

    const results = searchProducts(normalizedQuery)

    setSearchQuery(normalizedQuery)
    setSearchResults(results)
    setIsSearching(true)
    return results
  }, [searchProducts])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearching(false)
  }, [])

  const cartItems = useMemo(() => getCart(user), [user, cartVersion])
  const wishlistItems = useMemo(() => getWishlist(user), [user, wishlistVersion])
  const isInCart = useCallback((id) => cartItems.some((item) => item.id === id), [cartItems])

  const login = (email, password) => {
    const users = readStorage('ntUsers', [])
    const validUser = users.find((item) => item.email === email && item.password === password)

    if (!validUser) {
      throw new Error('Invalid email or password')
    }

    writeStorage('ntLoggedInUser', validUser)
    setUser(validUser)
    setAuthOpen(false)
    refreshCart()
    refreshWishlist()
    return validUser
  }

  const register = (name, email, password) => {
    const users = readStorage('ntUsers', [])
    if (users.find((item) => item.email === email)) {
      throw new Error('Email already registered')
    }

    const newUser = { id: email, name, email, password, createdAt: new Date().toISOString() }
    writeStorage('ntUsers', [...users, newUser])
    writeStorage('ntLoggedInUser', newUser)
    setUser(newUser)
    setAuthOpen(false)
    refreshCart()
    refreshWishlist()
    return newUser
  }

  const logout = () => {
    removeStorage('ntLoggedInUser')
    setUser(null)
    refreshCart()
    refreshWishlist()
  }

  const ensureUser = () => {
    if (!getCurrentUser()) {
      setAuthOpen(true)
      return false
    }

    return true
  }

  const addToCart = (product) => {
    if (!ensureUser()) {
      return false
    }

    addCartItem(product)
    refreshCart()
    return true
  }

  const changeCartQuantity = (id, quantity, size) => {
    updateCartItem(id, quantity, size)
    refreshCart()
  }

  const removeFromCart = (id, size) => {
    removeCartItem(id, size)
    refreshCart()
  }

  const emptyCart = () => {
    clearCart()
    refreshCart()
  }

  const toggleWishlist = (product) => {
    if (!ensureUser()) {
      return false
    }

    toggleWishlistItem(product)
    refreshWishlist()
    return true
  }

  const value = useMemo(() => ({
    user,
    authOpen,
    setAuthOpen,
    login,
    register,
    logout,
    ensureUser,
    addToCart,
    changeCartQuantity,
    removeFromCart,
    emptyCart,
    toggleWishlist,
    isWishlisted: (id) => isWishlisted(id),
    isInCart,
    cartItems,
    cartCount: getCartCount(user),
    wishlistItems,
    wishlistCount: wishlistItems.length,
    cartVersion,
    wishlistVersion,
    searchQuery,
    searchResults,
    isSearching,
    executeSearch,
    clearSearch,
    lastBrowsePath,
    setLastBrowsePath,
    filterVersion,
    defaultFilters,
    minFilterPrice: MIN_FILTER_PRICE,
    maxFilterPrice: MAX_FILTER_PRICE,
    getListingFilters,
    applyListingFilters,
    resetListingFilters,
    filterProducts,
    searchProducts,
  }), [user, authOpen, cartVersion, wishlistVersion, isInCart, cartItems, wishlistItems, searchQuery, searchResults, isSearching, executeSearch, clearSearch, lastBrowsePath, filterVersion, getListingFilters, applyListingFilters, resetListingFilters, filterProducts, searchProducts])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside AppProvider')
  }

  return context
}
