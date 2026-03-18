import { useMemo, useState } from 'react'
import { formatPrice } from '../../utils/storage'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { useAdminToast } from '../hooks/useAdminToast'
import { orderService, orderStatusOptions } from '../services/orderService'

export default function OrdersPage() {
  const { data: orders, loading, error, reload } = useAdminCollection(orderService.getAll)
  const { pushToast } = useAdminToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState(null)

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const haystack = `${order.id} ${order.customerName} ${order.customerEmail}`.toLowerCase()
      const matchesSearch = haystack.includes(search.trim().toLowerCase())
      const matchesStatus = statusFilter === 'all' ? true : order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId)

    try {
      await orderService.update(orderId, { status })
      pushToast({
        title: 'Order updated',
        description: `Order ${orderId} is now marked as ${status}.`,
      })
      await reload()
    } catch (updateError) {
      pushToast({
        title: 'Unable to update order',
        description: updateError instanceof Error ? updateError.message : 'Unknown error',
        tone: 'error',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading orders..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations"
        title="Orders"
        description="Orders are aggregated from all customer order storage keys. Status changes persist instantly and refresh the UI without fake placeholders."
        actions={<button type="button" className="admin-button-primary" onClick={reload}>Refresh</button>}
      />

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div className="admin-panel">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Order Queue</h2>
            <p className="mt-1 text-sm text-slate-500">{filteredOrders.length} order(s) visible</p>
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              className="admin-input md:w-64"
              placeholder="Search by order or customer"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <select className="admin-select md:w-44" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All statuses</option>
              {orderStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <EmptyState title="No orders found" description="When customers place orders, they will appear here automatically." />
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-th">Order</th>
                  <th className="admin-th">Customer</th>
                  <th className="admin-th">Items</th>
                  <th className="admin-th">Total</th>
                  <th className="admin-th">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="admin-td">
                      <p className="font-semibold text-slate-950">{order.id}</p>
                      <p className="text-xs text-slate-500">{order.date || 'No date stored'}</p>
                    </td>
                    <td className="admin-td">
                      <p>{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.customerEmail}</p>
                    </td>
                    <td className="admin-td">{order.itemCount || 0}</td>
                    <td className="admin-td font-semibold text-slate-900">{formatPrice(order.total || 0)}</td>
                    <td className="admin-td">
                      <select
                        className="admin-select min-w-[160px]"
                        value={order.status || 'Processing'}
                        disabled={updatingId === order.id}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                      >
                        {orderStatusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
