import { useEffect, useMemo, useRef, useState } from 'react'
import { formatPrice } from '../../utils/storage'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Modal from '../components/Modal'
import { useAdminPageSearch } from '../context/AdminPageSearchContext'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'

const statusFilterOptions = [
  'all',
  'Placed',
  'Processing',
  'Paid',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
]

const adminStatusSelectStyle = {
  minWidth: '240px',
  padding: '14px 44px 14px 18px',
  borderRadius: '22px',
  border: '1px solid rgba(212, 175, 55, 0.35)',
  background: 'linear-gradient(180deg, rgba(38, 21, 12, 0.96), rgba(22, 10, 8, 0.96))',
  color: '#f6ead2',
  fontWeight: 600,
  lineHeight: 1.25,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  boxShadow: 'inset 0 1px 0 rgba(255, 240, 212, 0.05), 0 10px 24px rgba(0, 0, 0, 0.28)',
  backgroundImage:
    `linear-gradient(180deg, rgba(38, 21, 12, 0.96), rgba(22, 10, 8, 0.96)),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20'%3E%3Cpath fill='%23f3ddac' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.89a.75.75 0 1 1 1.08 1.04l-4.25 4.46a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundPosition: '0 0, right 16px center',
  backgroundSize: '100% 100%, 16px 16px',
}

const adminStatusOptionStyle = {
  background: '#17110d',
  color: '#f6ead2',
}

function formatOrderDate(value) {
  if (!value) return 'Not available'
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function OrderActions({ order, isOpen, onToggle, onClose, onAction }) {
  const dropdownRef = useRef(null)
  const normalizedStatus = order.status || 'Placed'

  useEffect(() => {
    if (!isOpen) return undefined

    function handleOutsideClick(event) {
      if (!dropdownRef.current?.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen, onClose])

  const options = [
    { label: 'View', action: 'view' },
    {
      label:
        normalizedStatus === 'Shipped' || normalizedStatus === 'Out for Delivery' || normalizedStatus === 'Delivered'
          ? 'Already Shipped'
          : 'Mark as Shipped',
      action: 'ship',
      disabled:
        normalizedStatus === 'Shipped' ||
        normalizedStatus === 'Out for Delivery' ||
        normalizedStatus === 'Delivered' ||
        normalizedStatus === 'Cancelled',
    },
    {
      label:
        normalizedStatus === 'Out for Delivery' || normalizedStatus === 'Delivered'
          ? 'Already Out for Delivery'
          : 'Mark as Out for Delivery',
      action: 'out-for-delivery',
      disabled:
        normalizedStatus === 'Out for Delivery' ||
        normalizedStatus === 'Delivered' ||
        normalizedStatus === 'Cancelled',
    },
    {
      label: normalizedStatus === 'Delivered' ? 'Already Delivered' : 'Mark as Delivered',
      action: 'deliver',
      disabled: normalizedStatus === 'Delivered' || normalizedStatus === 'Cancelled',
    },
    {
      label: normalizedStatus === 'Cancelled' ? 'Already Cancelled' : 'Cancel Order',
      action: 'cancel',
      disabled: normalizedStatus === 'Cancelled' || normalizedStatus === 'Delivered',
      tone: 'danger',
    },
  ]

  return (
    <div className={`admin-dropdown${isOpen ? ' open' : ''}`} ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        className="admin-dropdown-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        Actions
        <span>{isOpen ? '▲' : '▼'}</span>
      </Button>

      <div className="admin-dropdown-menu">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            className={`admin-dropdown-option${option.tone === 'danger' ? ' danger' : ''}`}
            disabled={option.disabled}
            onClick={() => {
              if (!option.disabled) {
                onAction(option.action)
                onClose()
              }
            }}
          >
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function OrdersPage() {
  const { data: orders = [], loading, error, reload } = useAdminCollection(orderService.getAll)
  const { getQuery } = useAdminPageSearch()
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [actionError, setActionError] = useState('')
  const [openMenuId, setOpenMenuId] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const searchQuery = getQuery('/admin/orders').trim().toLowerCase()
  const handleRefreshPage = () => window.location.reload()

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const normalizedStatus = order.status || 'Placed'
        const matchesStatus = selectedStatus === 'all' || normalizedStatus === selectedStatus
        const matchesSearch =
          !searchQuery ||
          [order.customerName, order.id, order.customerEmail, normalizedStatus].some((value) =>
            String(value || '')
              .toLowerCase()
              .includes(searchQuery),
          )

        return matchesStatus && matchesSearch
      }),
    [orders, searchQuery, selectedStatus],
  )

  async function updateStatus(orderId, status) {
    setActionError('')
    try {
      await orderService.update(orderId, { status })
      await reload()
    } catch (updateError) {
      setActionError(updateError instanceof Error ? updateError.message : 'Unable to update order')
    }
  }

  function handleAction(order, action) {
    if (action === 'view') {
      setSelectedOrder(order)
      return
    }

    if (action === 'ship') {
      updateStatus(order.id, 'Shipped')
      return
    }

    if (action === 'out-for-delivery') {
      updateStatus(order.id, 'Out for Delivery')
      return
    }

    if (action === 'deliver') {
      updateStatus(order.id, 'Delivered')
      return
    }

    if (action === 'cancel') {
      updateStatus(order.id, 'Cancelled')
    }
  }

  if (loading) {
    return <LoadingState label="Loading orders..." />
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Orders</h1>
          <p className="page-sub">Protected order operations with compact action dropdowns and working status updates.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleRefreshPage}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <select
          className="admin-select"
          style={adminStatusSelectStyle}
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          {statusFilterOptions.map((status) => (
            <option key={status} value={status} style={adminStatusOptionStyle}>
              {status === 'all' ? 'All Status' : status}
            </option>
          ))}
        </select>
        <span className="admin-pill">{filteredOrders.length} matching orders</span>
      </div>

      {error || actionError ? (
        <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{error || actionError}</div>
      ) : null}

      {filteredOrders.length === 0 ? (
        <EmptyState title="No Orders" description="No orders match the current page search or status filter." />
      ) : (
        <Card title={`Orders (${filteredOrders.length})`} subtitle="Use the dropdown on each order card to view or update it.">
          <div className="admin-order-layout">
            {filteredOrders.map((order) => (
              <div key={order.id} className="admin-order-card">
                <div className="admin-order-top">
                  <div>
                    <h3 className="admin-order-title">#{order.id}</h3>
                    <p className="page-sub">{order.customerName || 'Guest Customer'}</p>
                  </div>

                  <div className="admin-order-actions">
                    <OrderActions
                      order={order}
                      isOpen={openMenuId === order.id}
                      onToggle={() => setOpenMenuId((current) => (current === order.id ? '' : order.id))}
                      onClose={() => setOpenMenuId('')}
                      onAction={(action) => handleAction(order, action)}
                    />
                  </div>
                </div>

                <div className="admin-order-summary">
                  <div className="admin-order-meta-item">
                    <span className="admin-order-meta-label">Total</span>
                    <div className="admin-order-meta-value">{formatPrice(order.total || 0)}</div>
                  </div>
                  <div className="admin-order-meta-item">
                    <span className="admin-order-meta-label">Date</span>
                    <div className="admin-order-meta-value">{formatOrderDate(order.createdAt || order.date)}</div>
                  </div>
                  <div className="admin-order-meta-item">
                    <span className="admin-order-meta-label">Items</span>
                    <div className="admin-order-meta-value">{order.itemCount || order.items?.length || 0}</div>
                  </div>
                  <div className="admin-order-meta-item">
                    <span className="admin-order-meta-label">Email</span>
                    <div className="admin-order-meta-value">{order.customerEmail || order.address?.email || 'Not available'}</div>
                  </div>
                </div>

                <div className="admin-order-meta">
                  <div className="admin-order-meta-item">
                    <span className="admin-order-meta-label">Top Item</span>
                    <div className="admin-order-meta-value">{order.items?.[0]?.name || 'No items listed'}</div>
                  </div>
                  <div className="admin-order-meta-item">
                    <span className="admin-order-meta-label">Shipping Address</span>
                    <div className="admin-order-meta-value">
                      {[
                        order.address?.address1,
                        order.address?.address2,
                        order.address?.city,
                        order.address?.state,
                        order.address?.pincode,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Not available'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder ? `Order ${selectedOrder.id}` : 'Order Details'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
            {selectedOrder?.status !== 'Delivered' && selectedOrder?.status !== 'Cancelled' ? (
              <Button
                variant="primary"
                onClick={async () => {
                  if (!selectedOrder) return
                  await updateStatus(selectedOrder.id, 'Shipped')
                  setSelectedOrder((current) => (current ? { ...current, status: 'Shipped' } : current))
                }}
              >
                Mark as Shipped
              </Button>
            ) : null}
          </>
        }
      >
        {selectedOrder ? (
          <div className="space-y-6">
            <div className="admin-order-view-grid">
              <div className="admin-order-meta-item">
                <span className="admin-order-meta-label">Customer</span>
                <div className="admin-order-meta-value">{selectedOrder.customerName || 'Guest Customer'}</div>
              </div>
              <div className="admin-order-meta-item">
                <span className="admin-order-meta-label">Status</span>
                <div className="admin-order-meta-value">{selectedOrder.status || 'Placed'}</div>
              </div>
              <div className="admin-order-meta-item">
                <span className="admin-order-meta-label">Total</span>
                <div className="admin-order-meta-value">{formatPrice(selectedOrder.total || 0)}</div>
              </div>
              <div className="admin-order-meta-item">
                <span className="admin-order-meta-label">Placed On</span>
                <div className="admin-order-meta-value">{formatOrderDate(selectedOrder.createdAt || selectedOrder.date)}</div>
              </div>
            </div>

            <div>
              <h3 className="admin-form-section-title">Items</h3>
              <div className="admin-order-item-list">
                {(selectedOrder.items || []).map((item, index) => (
                  <div key={`${item.id || item.name}-${index}`} className="admin-order-item">
                    <div>
                      <div className="font-semibold">{item.name || 'Product'}</div>
                      <div className="text-sm text-text-secondary">Qty: {item.quantity || 1}</div>
                    </div>
                    <div className="font-semibold">{formatPrice((item.price || 0) * (item.quantity || 1))}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
