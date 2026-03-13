import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import { readStorage, writeStorage, formatPrice } from '../utils/storage'

export default function Orders() {
  const { user } = useApp()
  const [selectedCancelOrderId, setSelectedCancelOrderId] = useState(null)
  const [version, setVersion] = useState(0)
  const orders = useMemo(() => {
    if (!user) return []
    return readStorage(`ntOrders_${user.email}`, []).slice().reverse()
  }, [user, version])

  const cancelOrder = () => {
    const nextOrders = readStorage(`ntOrders_${user.email}`, []).filter((order) => order.orderId !== selectedCancelOrderId)
    writeStorage(`ntOrders_${user.email}`, nextOrders)
    setSelectedCancelOrderId(null)
    setVersion((value) => value + 1)
  }

  return (
    <>
      <main>
        <section className="orders-page">
          <h1 className="orders-title">My Orders</h1>
          <div id="ordersContainer">
            {orders.length === 0 ? <p style={{ textAlign: 'center' }}>No orders yet.</p> : null}
            {orders.map((order) => {
              const item = order.items[0]
              const statusClass = order.status === 'Paid' ? 'status-paid' : 'status-processing'
              return (
                <div className="order-card active" key={order.orderId}>
                  <div className="order-flex">
                    <div className="order-image"><img src={item.image} className="order-main-img" /></div>
                    <div className="order-details">
                      <div className="order-id"><strong>Order ID:</strong> {order.orderId}</div>
                      <div className="order-date">{order.date}</div>
                      <div className="order-meta"><span><strong>{item.name}</strong></span><span>Qty: {item.quantity}</span><span>{formatPrice(item.price * item.quantity)}</span></div>
                      <div className="order-bottom">
                        <div className={`order-status-badge ${statusClass}`}>{order.status}</div>
                        {order.status === 'Processing' ? <button className="cancel-order-btn" onClick={() => setSelectedCancelOrderId(order.orderId)}>Cancel Order</button> : null}
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

