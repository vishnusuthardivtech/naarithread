import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useOrders } from '../hooks/useOrders'
import { getStoredCatalogProducts } from '../services/catalogService'
import { formatPrice } from '../utils/storage'

const FALLBACK_IMAGE = `${import.meta.env.BASE_URL}images/placeholder.jpg`

const getProductMatch = (item = {}) => {
  const products = getStoredCatalogProducts()

  return (
    products.find((product) => String(product.id) === String(item?.id)) ||
    products.find((product) => product.name === item?.name) ||
    products.find((product) => product.category === item?.name)
  )
}

const resolveOrderImage = (item = {}) => {
  const matchedProduct = getProductMatch(item)
  const image = matchedProduct?.images?.[0] || item?.images?.[0]
  return image || FALLBACK_IMAGE
}

const getProductSizeLabel = (item = {}) => item?.selectedSize || item?.size || 'N/A'

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
              const statusClass =
                order?.status === 'Paid' || order?.status === 'Out for Delivery' || order?.status === 'Delivered'
                  ? 'status-paid'
                  : 'status-processing'
              return (
                <div className="order-card active" key={order.id}>
                  <div className="order-flex">
                    <div className="order-image">
                      <img
                        src={resolveOrderImage(firstProduct)}
                        className="order-main-img"
                        alt={firstProduct?.name || 'Ordered product'}
                      />
                    </div>
                    <div className="order-details">
                      <div className="order-id"><strong>Order ID:</strong> {order?.id}</div>
                      <div className="order-date">{new Date(order?.date).toLocaleString()}</div>
                      <div className="order-meta"><span>Total Items: {order?.products?.reduce((sum, product) => sum + (Number(product?.quantity) || 1), 0)}</span><span>{formatPrice(order?.total || 0)}</span></div>
                      <div className="order-products-list">
                        {(order?.products || []).map((product, index) => (
                          <div key={`${product?.id || product?.name}-${index}`} className="order-product-item">
                            <div className="order-product-thumb">
                              <img
                                src={resolveOrderImage(product)}
                                alt={product?.name || 'Ordered product'}
                              />
                            </div>
                            <div className="order-product-info">
                              <strong>{product?.name || 'Unnamed Product'}</strong>
                              <span>Size: {getProductSizeLabel(product)}</span>
                              <span>Qty: {product?.quantity || 1}</span>
                            </div>
                            <div className="order-product-price">{formatPrice(product?.price || 0)}</div>
                          </div>
                        ))}
                      </div>
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
