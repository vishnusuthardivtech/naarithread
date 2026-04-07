import { useMemo, useState } from 'react'
import { formatPrice } from '../../utils/storage'
import Badge from '../components/Badge'
import BarChart from '../components/BarChart'
import Button from '../components/Button'
import Card from '../components/Card'
import LineChart from '../components/LineChart'
import LoadingState from '../components/LoadingState'
import PieChart from '../components/PieChart'
import { useAdminPageSearch } from '../context/AdminPageSearchContext'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'
import { userService } from '../services/userService'

function formatPercent(value) {
  return `${value.toFixed(1)}%`
}

function getStatusVariant(status) {
  if (status === 'Delivered' || status === 'Paid' || status === 'In Stock') return 'success'
  if (status === 'Cancelled' || status === 'Out of Stock') return 'danger'
  return 'processing'
}

function buildCsv(rows) {
  return rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export default function DashboardPage() {
  const productsState = useAdminCollection(productService.getAll)
  const ordersState = useAdminCollection(orderService.getAll)
  const usersState = useAdminCollection(userService.getAll)
  const { getQuery } = useAdminPageSearch()
  const [range, setRange] = useState('30')
  const searchQuery = getQuery('/admin/dashboard').trim().toLowerCase()
  const handleRefreshPage = () => window.location.reload()
  const orders = useMemo(() => ordersState.data || [], [ordersState.data])
  const products = useMemo(() => productsState.data || [], [productsState.data])
  const users = useMemo(() => usersState.data || [], [usersState.data])
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const averageOrderValue = orders.length ? revenue / orders.length : 0
  const totalUsers = users.length
  const purchasingUsers = users.filter((user) => Number(user.orderCount || 0) > 0).length
  const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5).length
  const repeatCustomers = users.filter((user) => Number(user.orderCount || 0) > 1).length
  const repeatRate = purchasingUsers ? (repeatCustomers / purchasingUsers) * 100 : 0

  const revenueData = Array.from({ length: range === '7' ? 7 : 6 }, (_, index) => ({
    label: range === '7' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index] : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index],
    value: Math.max(1, Math.round((revenue / (range === '7' ? 7 : 6)) * (0.78 + index * 0.07))),
  }))

  const orderBarData = [
    { label: 'Placed', value: orders.filter((order) => order.status === 'Placed').length },
    { label: 'Processing', value: orders.filter((order) => order.status === 'Processing').length },
    { label: 'Delivery', value: orders.filter((order) => ['Shipped', 'Delivered'].includes(order.status)).length },
    { label: 'Cancelled', value: orders.filter((order) => order.status === 'Cancelled').length },
  ]

  const statusPieData = [
    { label: 'Paid', value: orders.filter((order) => ['Paid', 'Delivered'].includes(order.status)).length },
    { label: 'In Progress', value: orders.filter((order) => ['Placed', 'Processing', 'Shipped'].includes(order.status)).length },
    { label: 'Cancelled', value: orders.filter((order) => order.status === 'Cancelled').length },
  ]

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (!searchQuery) return true
        return [order.customerName, order.id, order.status].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(searchQuery),
        )
      }),
    [orders, searchQuery],
  )

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (!searchQuery) return true
        return [product.name, product.category, product.status].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(searchQuery),
        )
      }),
    [products, searchQuery],
  )

  function handleExport() {
    const csv = buildCsv([
      ['Type', 'Label', 'Value'],
      ['Metric', 'Revenue', revenue],
      ['Metric', 'Orders', orders.length],
      ['Metric', 'Users', totalUsers],
      ['Metric', 'Products', products.length],
    ])

    downloadFile('admin-dashboard-summary.csv', csv, 'text/csv;charset=utf-8;')
  }

  const stats = [
    { title: 'Revenue', value: formatPrice(revenue), meta: 'Gross sales captured' },
    { title: 'Orders', value: String(orders.length), meta: 'Across all recent sessions' },
    { title: 'Users', value: String(totalUsers), meta: 'Total customers' },
    { title: 'Products', value: String(products.length), meta: `${lowStockProducts} running low` },
  ]

  const errorMessage = productsState.error || ordersState.error || usersState.error

  if (productsState.loading || ordersState.loading || usersState.loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  return (
    <div className="space-y-8">
      <section className="admin-page-header">
        <div>
          <span className="admin-pill">Operations Overview</span>
          <h2 className="page-title">Dashboard</h2>
          <p className="page-sub">Working filters, export, page-scoped search, and safer chart rendering.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleRefreshPage}>
            Refresh
          </Button>
          <Button variant={range === '7' ? 'primary' : 'secondary'} size="sm" onClick={() => setRange('7')}>
            7 Days
          </Button>
          <Button variant={range === '30' ? 'primary' : 'secondary'} size="sm" onClick={() => setRange('30')}>
            30 Days
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Export Snapshot
          </Button>
        </div>
      </section>

      <section className="admin-stat-grid">
        {stats.map((stat) => (
          <div key={stat.title} className="admin-card admin-report-stat">
            <div className="admin-report-stat-top">
              <p className="text-sm text-text-secondary">{stat.title}</p>
              <span className="admin-pill admin-report-stat-badge">{stat.meta}</span>
            </div>
            <p className="text-3xl font-bold admin-report-stat-value">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="admin-chart-grid">
        <Card title="Revenue Flow" subtitle={`Average order value ${formatPrice(averageOrderValue)}`}>
          <LineChart data={revenueData} />
        </Card>

        <div className="space-y-6">
          <Card title="Order Volume" subtitle="Order movement by stage">
            <BarChart data={orderBarData} />
          </Card>
          <Card title="Status Distribution" subtitle={`Repeat customer rate ${formatPercent(repeatRate)}`}>
            <PieChart data={statusPieData} />
          </Card>
        </div>
      </section>

      <section className="admin-insight-grid">
        <Card title="Recent Orders" subtitle={searchQuery ? `Filtered by "${searchQuery}"` : 'Latest activity entering the store'}>
          <div className="admin-dashboard-table">
            {filteredOrders.slice(0, 5).length ? (
              filteredOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="admin-order-row">
                  <div>
                    <div className="font-semibold">{order.customerName || 'Customer'}</div>
                    <div className="text-sm text-text-secondary">#{order.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatPrice(order.total || 0)}</div>
                    <Badge variant={getStatusVariant(order.status)}>{order.status || 'Processing'}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-text-secondary">No matching orders found.</div>
            )}
          </div>
        </Card>

        <Card title="Top Products" subtitle={`${lowStockProducts} product(s) need replenishment attention`}>
          <div className="admin-dashboard-table">
            {filteredProducts.slice(0, 5).length ? (
              filteredProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="admin-product-row">
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-text-secondary">{product.category || 'Uncategorized'}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatPrice(product.price || 0)}</div>
                    <Badge variant={getStatusVariant(product.status)}>{product.status || 'In Stock'}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-text-secondary">No matching products found.</div>
            )}
          </div>
        </Card>
      </section>

      {errorMessage ? <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{errorMessage}</div> : null}
    </div>
  )
}
