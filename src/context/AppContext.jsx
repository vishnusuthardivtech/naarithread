import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { reviewService } from '../services/reviewService'
import { addCartItem, clearCart, getCart, getCartCount, getCurrentUser, removeCartItem, updateCartItem } from '../utils/cart'
import { catalogConstants, getCatalogOptions, getProductsForListing, getStoredCatalogProducts, normalizeCatalogProduct, subscribeCatalogProducts, validateCartItemsAgainstStock } from '../services/catalogService'
import { useWishlist } from '../hooks/useWishlist'
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
  const normalizedCategory = String(product.category || '').trim()

  if (catalogConstants.CATEGORY_OPTIONS.includes(normalizedCategory)) {
    return normalizedCategory
  }

  if (sourcePage === 'collection1') return 'Mirror Lehenga'
  if (sourcePage === 'collection2') return 'Sequence Lehenga'
  if (sourcePage === 'collection3') return 'Party Lehenga'

  return catalogConstants.CATEGORY_OPTIONS[0]
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [authOpen, setAuthOpen] = useState(false)
  const [cartVersion, setCartVersion] = useState(0)
  const [catalogVersion, setCatalogVersion] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastBrowsePath, setLastBrowsePath] = useState('/')
  const [listingFilters, setListingFilters] = useState({})
  const [filterVersion, setFilterVersion] = useState(0)
  const [reviewsVersion, setReviewsVersion] = useState(0)

  useEffect(() => {
    const loggedInUser = getCurrentUser()
    setUser(loggedInUser)
  }, [])

  useEffect(() => reviewService.subscribe(() => {
    setReviewsVersion((value) => value + 1)
  }), [])

  useEffect(() => subscribeCatalogProducts(() => {
    setCatalogVersion((value) => value + 1)
  }), [])

  const refreshCart = () => setCartVersion((value) => value + 1)

  const enrichedProducts = useMemo(() => {
    const uniqueProducts = getStoredCatalogProducts()
    const ratedProducts = reviewService.getProductsWithRatings(uniqueProducts)
    const { categories, collections } = getCatalogOptions(ratedProducts)

    const products = ratedProducts.map((product) => ({
      ...product,
      inStock: Number(product.stock) > 0,
      color: inferColor(product),
      filterCategory: inferCategory(product, product.sourcePage),
    }))

    products.categoryOptions = categories
    products.collectionOptions = collections
    return products
  }, [catalogVersion, reviewsVersion])

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
    const filtersActive =
      filters.availability
      || filters.priceMin !== MIN_FILTER_PRICE
      || filters.priceMax !== MAX_FILTER_PRICE
      || filters.colors.length > 0
      || filters.categories.length > 0

    const normalizedProducts = products
      .map((product) => enrichedProductMap.get(product.id) ?? {
        ...normalizeCatalogProduct(product),
        inStock: Number(product.stock) > 0,
        color: inferColor(product),
        filterCategory: inferCategory(product, product.sourcePage || ''),
      })

    if (!filtersActive) {
      return normalizedProducts
    }

    return normalizedProducts
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
  const { items: wishlistItems, count: wishlistCount, toggleItem, removeItem, hasItem } = useWishlist(user)
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
    return newUser
  }

  const logout = () => {
    removeStorage('ntLoggedInUser')
    setUser(null)
    refreshCart()
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

    const stockCheck = validateCartItemsAgainstStock([
      {
        id: product.id,
        quantity: Math.max(1, Number(product.quantity) || 1),
        name: product.name,
      },
    ])

    if (!stockCheck.valid) {
      throw new Error(stockCheck.error)
    }

    addCartItem(product)
    refreshCart()
    return true
  }

  const changeCartQuantity = (id, quantity, size) => {
    const stockCheck = validateCartItemsAgainstStock([{ id, quantity }])
    if (!stockCheck.valid) {
      throw new Error(stockCheck.error)
    }

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

    toggleItem(product)
    return true
  }

  const removeFromWishlist = (id) => {
    removeItem(id)
  }

  const getProductsForPage = useCallback((listingKey) => getProductsForListing(enrichedProducts, listingKey), [enrichedProducts])
  const categoryOptions = enrichedProducts.categoryOptions || catalogConstants.CATEGORY_OPTIONS
  const collectionOptions = enrichedProducts.collectionOptions || catalogConstants.COLLECTION_OPTIONS

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    console.log('[catalog-debug]', {
      productsLength: enrichedProducts.length,
      sampleImage: enrichedProducts[0]?.images?.[0] || null,
      filtersActive: Object.keys(listingFilters).some((listingKey) => {
        const filters = listingFilters[listingKey]
        return filters?.availability
          || filters?.priceMin !== MIN_FILTER_PRICE
          || filters?.priceMax !== MAX_FILTER_PRICE
          || (filters?.colors?.length ?? 0) > 0
          || (filters?.categories?.length ?? 0) > 0
      }),
    })
  }, [enrichedProducts, listingFilters])

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
    removeFromWishlist,
    isWishlisted: hasItem,
    isInCart,
    cartItems,
    cartCount: getCartCount(user),
    wishlistItems,
    wishlistCount,
    cartVersion,
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
    products: enrichedProducts,
    getProductsForPage,
    categoryOptions,
    collectionOptions,
    validateCartItemsAgainstStock,
  }), [user, authOpen, cartVersion, toggleWishlist, removeFromWishlist, hasItem, isInCart, cartItems, wishlistItems, wishlistCount, searchQuery, searchResults, isSearching, executeSearch, clearSearch, lastBrowsePath, filterVersion, getListingFilters, applyListingFilters, resetListingFilters, filterProducts, searchProducts, enrichedProducts])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used inside AppProvider')
  }

  return context
}
