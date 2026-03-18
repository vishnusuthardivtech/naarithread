import { useMemo } from 'react'
import { formatPrice } from '../../utils/storage'
import PageHeader from '../components/PageHeader'
import LoadingState from '../components/LoadingState'
import StatCard from '../components/StatCard'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'
import { userService } from '../services/userService'

export default function DashboardPage() {
  const productsState = useAdminCollection(productService.getAll)
  const ordersState = useAdminCollection(orderService.getAll)
  const usersState = useAdminCollection(userService.getAll)

  const loading = productsState.loading || ordersState.loading || usersState.loading
  const error = productsState.error || ordersState.error || usersState.error

  const metrics = useMemo(() => {
    const revenue = ordersState.data.reduce((sum, order) => sum + Number(order.total || 0), 0)
    return {
      products: productsState.data.length,
      orders: ordersState.data.length,
      users: usersState.data.length,
      revenue,
    }
  }, [ordersState.data, productsState.data.length, usersState.data.length])

  const recentOrders = ordersState.data.slice(0, 5)

  if (loading) {
    return <LoadingState label="Loading dashboard metrics..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Dynamic Dashboard"
        description="All metrics below are read from the live service layer. If the data is empty, the dashboard shows 0 without filler values."
      />

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Products" value={metrics.products} hint="Live product records in admin storage" />
        <StatCard label="Total Orders" value={metrics.orders} hint="Aggregated from all customer order keys" />
        <StatCard label="Total Users" value={metrics.users} hint="Registered storefront users" />
        <StatCard label="Revenue" value={formatPrice(metrics.revenue)} hint="Sum of recorded order totals" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="admin-panel">
          <h2 className="text-lg font-semibold text-slate-950">Recent Orders</h2>
          <p className="mt-1 text-sm text-slate-500">Latest real orders flowing into the admin system.</p>

          <div className="mt-5 overflow-x-auto">
            {recentOrders.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No orders found.
              </p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="admin-th">Order</th>
                    <th className="admin-th">Customer</th>
                    <th className="admin-th">Status</th>
                    <th className="admin-th">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="admin-td">
                        <p className="font-semibold text-slate-900">{order.id}</p>
                        <p className="text-xs text-slate-500">{order.date || 'No date'}</p>
                      </td>
                      <td className="admin-td">
                        <p>{order.customerName}</p>
                        <p className="text-xs text-slate-500">{order.customerEmail}</p>
                      </td>
                      <td className="admin-td">
                        <span className="admin-badge bg-slate-100 text-slate-700">{order.status || 'Processing'}</span>
                      </td>
                      <td className="admin-td font-semibold text-slate-900">{formatPrice(order.total || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="admin-panel">
          <h2 className="text-lg font-semibold text-slate-950">Quick Health</h2>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Inventory Status</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {productsState.data.filter((product) => Number(product.stock) > 0).length}
              </p>
              <p className="mt-1 text-sm text-slate-500">Products currently in stock</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Pending Orders</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {ordersState.data.filter((order) => order.status === 'Processing').length}
              </p>
              <p className="mt-1 text-sm text-slate-500">Orders waiting for next action</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Repeat Customers</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {usersState.data.filter((user) => user.orderCount > 1).length}
              </p>
              <p className="mt-1 text-sm text-slate-500">Users with more than one order</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
