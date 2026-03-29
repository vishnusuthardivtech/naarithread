import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { allProducts } from '../data/products'
import { assetPath, normalizeAssetPath } from '../data/site'
import { useOrders } from '../hooks/useOrders'
import { formatPrice } from '../utils/storage'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}vite.svg`

const getProductMatch = (item = {}) =>
  allProducts.find((product) => String(product.id) === String(item?.id)) ||
  allProducts.find((product) => product.name === item?.name) ||
  allProducts.find((product) => product.category === item?.name)

const normalizeOrderImage = (value = '') => {
  if (!value) {
    return ''
  }

  let nextValue = String(value).trim().replace(/\\/g, '/')

  if (!nextValue) {
    return ''
  }

  if (/^(https?:)?\/\//.test(nextValue) || nextValue.startsWith('data:') || nextValue.startsWith('blob:')) {
    return nextValue
  }

  const baseUrl = import.meta.env.BASE_URL || '/'
  if (nextValue.startsWith(baseUrl)) {
    nextValue = nextValue.slice(baseUrl.length)
  }

  nextValue = nextValue
    .replace(/^\/+/, '')
    .replace(/^public\//i, '')
    .replace(/^src\//i, '')

  if (/^images\//i.test(nextValue)) {
    return `${import.meta.env.BASE_URL}${nextValue}`
  }

  if (/^assets\//i.test(nextValue)) {
    return assetPath(nextValue)
  }

  if (nextValue.includes('/images/')) {
    return `${import.meta.env.BASE_URL}images/${nextValue.replace(/^.*\/images\//, '')}`
  }

  if (nextValue.includes('/assets/')) {
    return assetPath(nextValue.replace(/^.*\/assets\//, 'assets/'))
  }

  return assetPath(normalizeAssetPath(nextValue))
}

const resolveOrderImage = (item = {}) => {
  const matchedProduct = getProductMatch(item)
  if (matchedProduct?.image) {
    return matchedProduct.image
  }

  return normalizeOrderImage(item?.image || item?.img || item?.thumbnail || item?.photo) || FALLBACK_IMAGE
}

export default function Orders() {
  const { user } = useApp()
  const { orders, removeOrder } = useOrders(user)
  const [selectedCancelOrderId, setSelectedCancelOrderId] = useState(null)
  const rawOrders = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('ntOrders') || '[]') : []

  console.log('Orders:', orders)
  console.log('ntOrders:', rawOrders)

  const cancelOrder = () => {
    removeOrder(selectedCancelOrderId)
    setSelectedCancelOrderId(null)
  }

  return (
    <>
      <main>
        <section className="orders-page">
          <h1 className="orders-title">My Orders</h1>
          <div id="ordersContainer">
            {orders.length === 0 ? <p style={{ textAlign: 'center' }}>No orders yet</p> : null}
            {orders.map((order) => {
              const firstProduct = order?.products?.[0]
              const statusClass = order.status === 'Paid' ? 'status-paid' : 'status-processing'
              return (
                <div className="order-card active" key={order.id}>
                  <div className="order-flex">
                    <div className="order-image">
                      <img
                        src={resolveOrderImage(firstProduct)}
                        className="order-main-img"
                        alt={firstProduct?.name || 'Ordered product'}
                        onError={(event) => {
                          const fallbackProductImage = normalizeOrderImage(firstProduct?.image || firstProduct?.img || firstProduct?.thumbnail || firstProduct?.photo)
                          if (fallbackProductImage && event.currentTarget.dataset.fallbackApplied !== 'true') {
                            event.currentTarget.dataset.fallbackApplied = 'true'
                            event.currentTarget.src = fallbackProductImage
                            return
                          }

                          event.currentTarget.src = FALLBACK_IMAGE
                        }}
                      />
                    </div>
                    <div className="order-details">
                      <div className="order-id"><strong>Order ID:</strong> {order?.id}</div>
                      <div className="order-date">{new Date(order?.date).toLocaleString()}</div>
                      <div className="order-meta"><span><strong>{order?.products?.map((product) => product?.name || 'Unnamed Product').join(', ')}</strong></span><span>Total Items: {order?.products?.reduce((sum, product) => sum + (product?.quantity || 1), 0)}</span><span>{formatPrice(order?.total || 0)}</span></div>
                      <div className="order-meta"><span>{order?.address?.address1}{order?.address?.address2 ? `, ${order.address.address2}` : ''}</span><span>{order?.address?.city}, {order?.address?.state} - {order?.address?.pincode}</span><span>{order?.address?.phone}</span></div>
                      <div className="order-bottom">
                        <div className={`order-status-badge ${statusClass}`}>{order?.status}</div>
                        {order?.status === 'Placed' ? <button className="cancel-order-btn" onClick={() => setSelectedCancelOrderId(order?.id)}>Cancel Order</button> : null}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <div
        className={`cancel-modal${selectedCancelOrderId ? ' active' : ''}`}
        id="cancelModal"
        onClick={() => setSelectedCancelOrderId(null)}
      >
        <div className="cancel-modal-content" onClick={(event) => event.stopPropagation()}>
          <h3>Cancel this order?</h3>
          <p>This action cannot be undone.</p>
          <div className="cancel-modal-actions">
            <button className="modal-no" id="cancelNoBtn" onClick={() => setSelectedCancelOrderId(null)}>No</button>
            <button className="modal-yes" id="cancelYesBtn" onClick={cancelOrder}>Yes Cancel</button>
          </div>
        </div>
      </div>
    </>
  )
}
