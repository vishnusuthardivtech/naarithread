import { useState } from 'react'
import { formatPrice } from '../../utils/storage'
import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'

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
      <h1 className="page-title">Orders</h1>

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
                    <strong>Product:</strong> {firstItem || 'N/A'}
                  </p>
                  <p>
                    <strong>Amount:</strong> {formatPrice(order.total || 0)}
                  </p>
                </div>

                <div className={`order-status ${isDelivered ? 'delivered' : 'pending'}`}>{isDelivered ? 'Delivered' : order.status || 'Pending'}</div>

                <div className="order-action">
                  <button
                    type="button"
                    className={`deliver-btn${isDelivered ? ' disabled' : ''}`}
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
