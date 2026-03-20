import { getData, removeData, setData } from './localStorage'

export function getDataFromStorage(key, fallback) {
  return getData(key, fallback)
}

export function setDataInStorage(key, value) {
  setData(key, value)
}

export { getData, setData }

export function getStorageData(key, fallback) {
  return getData(key, fallback)
}

export function setStorageData(key, value) {
  setData(key, value)
}

export function readStorage(key, fallback) {
  return getData(key, fallback)
}

export function writeStorage(key, value) {
  setData(key, value)
}

export function getDataValue(key, fallback) {
  return getData(key, fallback)
}

export function setDataValue(key, value) {
  setData(key, value)
}

export function removeStorage(key) {
  removeData(key)
}

export function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}
