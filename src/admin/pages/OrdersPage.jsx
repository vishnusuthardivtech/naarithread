import { useState } from 'react'
import { formatPrice } from '../../utils/storage'
import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'

function formatOrderDate(value) {
  if (!value) {
    return 'Not available'
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function OrdersPage() {
  const { data: orders, loading, error, reload } = useAdminCollection(orderService.getAll)
  const [actionError, setActionError] = useState('')

  if (loading) {
    return <LoadingState label="Loading orders..." />
  }

  const markDelivered = async (orderId) => {
    setActionError('')

    try {
      await orderService.update(orderId, { status: 'Delivered' })
      await reload()
    } catch (updateError) {
      setActionError(updateError instanceof Error ? updateError.message : 'Unable to update order')
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Orders</h1>
          <p className="page-sub">Monitor recent purchases and fulfillment status.</p>
        </div>
      </div>

      {error || actionError ? <div className="error-banner">{error || actionError}</div> : null}

      <div className="orders-wrapper">
        {orders.length === 0 ? (
          <div className="empty-panel">No orders found.</div>
        ) : (
          orders.map((order) => {
            const isDelivered = order.status === 'Delivered'
            const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0]?.name || order.items[0]?.title : ''

            return (
              <div className="order-card" key={order.id}>
                <div className="order-info">
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Customer:</strong> {order.customerName || 'N/A'}
                  </p>
                  <p>
                    <strong>Total:</strong> {formatPrice(order.total || 0)}
                  </p>
                  <p>
                    <strong>Date:</strong> {formatOrderDate(order.createdAt || order.date)}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status || 'Placed'}
                  </p>
                </div>

                <div className={`order-status ${isDelivered ? 'delivered' : 'pending'}`}>{isDelivered ? 'Delivered' : order.status || 'Pending'}</div>

                <div className="order-action">
                  <p>{firstItem || 'No items listed'}</p>
                  <button
                    type="button"
                    className={`deliver-btn${isDelivered ? ' disabled' : ''}`}
                    disabled={isDelivered}
                    onClick={() => {
                      if (!isDelivered) {
                        markDelivered(order.id)
                      }
                    }}
                  >
                    {isDelivered ? 'Delivered' : 'Mark as Delivered'}
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </>
  )
}
