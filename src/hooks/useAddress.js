import { useEffect, useMemo, useState } from 'react'
import { getData, setData, subscribeToStorage } from '../utils/localStorage'

const ADDRESSES_KEY = 'ntAddresses'

const getAddressEntries = () => getData(ADDRESSES_KEY, [])

const normalizeAddress = (address = {}, fallbackUserEmail = '') => ({
  id: address.id || `ADDR_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
  name: address.name || address.fullName || '',
  line1: address.line1 || address.address1 || address.address || '',
  line2: address.line2 || address.address2 || '',
  address: address.address || [address.line1 || address.address1 || '', address.line2 || address.address2 || ''].filter(Boolean).join(', '),
  city: address.city || '',
  state: address.state || '',
  pincode: address.pincode || '',
  phone: address.phone || '',
  isDefault: Boolean(address.isDefault ?? address.current),
  userEmail: address.userEmail || fallbackUserEmail,
})

const getUserAddresses = (user) => {
  if (!user?.email) {
    return []
  }

  const legacyKey = `ntAddress_${user.email}`
  const entries = getAddressEntries().map((address) => normalizeAddress(address, user.email))
  const hasCurrentUserAddresses = entries.some((address) => address.userEmail === user.email)

  if (!hasCurrentUserAddresses) {
    const legacyAddresses = getData(legacyKey, []).map((address) => normalizeAddress(address, user.email))

    if (legacyAddresses.length > 0) {
      const migratedAddresses = [...entries, ...legacyAddresses]
      setData(ADDRESSES_KEY, migratedAddresses)
      return migratedAddresses.filter((address) => address.userEmail === user.email)
    }
  }

  return entries
    .filter((address) => address.userEmail === user.email)
}

export function useAddress(user) {
  const [addresses, setAddresses] = useState(() => getUserAddresses(user))

  useEffect(() => {
    setAddresses(getUserAddresses(user))
  }, [user])

  useEffect(() => subscribeToStorage(ADDRESSES_KEY, () => {
    setAddresses(getUserAddresses(user))
  }), [user])

  const saveAddress = (address, addressId = null) => {
    if (!user?.email) {
      return null
    }

    const entries = getAddressEntries().map((item) => normalizeAddress(item))
    const normalizedAddress = normalizeAddress(
      {
        ...address,
        id: addressId || address.id,
      },
      user.email,
    )
    const otherUsers = entries.filter((item) => item.userEmail !== user.email)
    const currentUserAddresses = entries.filter((item) => item.userEmail === user.email)
    const existingAddress = currentUserAddresses.find((item) => item.id === normalizedAddress.id)
    const shouldBeDefault = normalizedAddress.isDefault || existingAddress?.isDefault || currentUserAddresses.length === 0
    const nextUserAddresses = shouldBeDefault
      ? currentUserAddresses.map((item) => ({ ...item, isDefault: false }))
      : [...currentUserAddresses]
    const existingIndex = nextUserAddresses.findIndex((item) => item.id === normalizedAddress.id)
    const nextAddress = { ...normalizedAddress, isDefault: shouldBeDefault }

    if (existingIndex >= 0) {
      nextUserAddresses[existingIndex] = nextAddress
    } else {
      nextUserAddresses.push(nextAddress)
    }

    setData(ADDRESSES_KEY, [...otherUsers, ...nextUserAddresses])
    return nextAddress
  }

  const setDefaultAddress = (addressId) => {
    if (!user?.email) {
      return
    }

    const nextAddresses = getAddressEntries()
      .map((address) => normalizeAddress(address))
      .map((address) => (
        address.userEmail === user.email
          ? { ...address, isDefault: address.id === addressId }
          : address
      ))

    setData(ADDRESSES_KEY, nextAddresses)
  }

  const deleteAddress = (addressId) => {
    if (!user?.email) {
      return
    }

    const entries = getAddressEntries().map((address) => normalizeAddress(address))
    const remaining = entries.filter((address) => !(address.userEmail === user.email && address.id === addressId))
    const userAddresses = remaining.filter((address) => address.userEmail === user.email)

    if (userAddresses.length > 0 && !userAddresses.some((address) => address.isDefault)) {
      userAddresses[0] = { ...userAddresses[0], isDefault: true }
    }

    setData(ADDRESSES_KEY, [...remaining.filter((address) => address.userEmail !== user.email), ...userAddresses])
  }

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault) || null,
    [addresses],
  )

  return useMemo(() => ({
    addresses,
    defaultAddress,
    saveAddress,
    setDefaultAddress,
    deleteAddress,
  }), [addresses, defaultAddress])
}
