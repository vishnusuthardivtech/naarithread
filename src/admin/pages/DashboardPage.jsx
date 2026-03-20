import { formatPrice } from '../../utils/storage'
import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'
import { userService } from '../services/userService'

function formatPercent(value) {
  return `${value.toFixed(1)}%`
}

export default function DashboardPage() {
  const productsState = useAdminCollection(productService.getAll)
  const ordersState = useAdminCollection(orderService.getAll)
  const usersState = useAdminCollection(userService.getAll)

  if (productsState.loading || ordersState.loading || usersState.loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  const orders = ordersState.data
  const products = productsState.data
  const users = usersState.data
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0)
  const averageOrderValue = orders.length ? revenue / orders.length : 0
  const recentOrders = orders.slice(0, 5)
  const topProducts = products.slice(0, 5)
  const activeCustomers = users.filter((user) => Number(user.orderCount || 0) > 0).length
  const repeatCustomers = users.filter((user) => Number(user.orderCount || 0) > 1).length
  const repeatRate = activeCustomers ? (repeatCustomers / activeCustomers) * 100 : 0
  const lowStock = products.filter((product) => Number(product.stock ?? 10) <= 5).length
  const paidOrders = orders.filter((order) => ['Paid', 'Delivered'].includes(order.status)).length
  const processingOrders = orders.filter((order) => ['Placed', 'Processing', 'Shipped'].includes(order.status)).length
  const cancelledOrders = orders.filter((order) => order.status === 'Cancelled').length
  const totalOrders = orders.length || 1

  const statCards = [
    { title: 'Revenue', value: formatPrice(revenue), detail: 'Total collected value', badge: '+12%', tone: 'primary', icon: 'Rs' },
    { title: 'Orders', value: String(orders.length), detail: 'Placed from checkout', badge: '+8%', tone: 'info', icon: 'Or' },
    { title: 'AOV', value: formatPrice(averageOrderValue), detail: 'Average order value', badge: '+5%', tone: 'teal', icon: 'Av' },
    { title: 'Active Customers', value: String(activeCustomers), detail: 'Customers with orders', badge: '+5%', tone: 'primary', icon: 'Ac' },
    { title: 'Repeat Rate', value: formatPercent(repeatRate), detail: `${repeatCustomers} repeat customers`, badge: 'Loyal', tone: 'violet', icon: 'Rp' },
    { title: 'Low Stock', value: String(lowStock), detail: 'Products needing review', badge: `${lowStock} low`, tone: 'info', icon: 'Ls' },
  ]

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="dashboard-kicker">Performance Center</span>
          <h1 className="dashboard-hero-title">Monitor growth, inventory, and store momentum from one place.</h1>
          <p className="page-sub dashboard-hero-subtitle">
            Review revenue, fulfillment movement, customer activity, and product performance with a cleaner control-center
            experience.
          </p>
        </div>

        <div className="dashboard-hero-side">
          <div className="dashboard-range-row">
            <span className="dashboard-range-label">Current Range</span>
            <div className="dashboard-range-toggle">
              <button type="button" className="admin-filter-chip subtle">
                Day
              </button>
              <button type="button" className="admin-filter-chip">
                Month
              </button>
              <button type="button" className="admin-filter-chip subtle">
                Year
              </button>
            </div>
          </div>

          <div className="dashboard-hero-stats">
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-label">Last 6 Months</span>
              <strong>{orders.length}</strong>
              <p>Orders in view</p>
            </div>
            <div className="dashboard-mini-stat">
              <span className="dashboard-mini-label">Catalog</span>
              <strong>{products.length}</strong>
              <p>Tracked products</p>
            </div>
          </div>
        </div>
      </section>

      <div className="topbar admin-page-header dashboard-toolbar">
        <div>
          <span className="dashboard-toolbar-label">Dashboard</span>
          <p className="page-sub">Track products, orders, users, and store performance in one place.</p>
        </div>
        <div className="admin-header-actions">
          <button type="button" className="admin-filter-chip">
            Oct 18 - Nov 18
          </button>
          <button type="button" className="admin-filter-chip">
            Monthly
          </button>
          <button type="button" className="admin-filter-chip">
            Export
          </button>
        </div>
      </div>

      {productsState.error || ordersState.error || usersState.error ? (
        <div className="error-banner">{productsState.error || ordersState.error || usersState.error}</div>
      ) : null}

      <section className="dashboard-stats-grid">
        {statCards.map((card) => (
          <div className={`dash-card dash-card-${card.tone}`} key={card.title}>
            <div className="dash-card-top">
              <span className="dash-card-icon">{card.icon}</span>
              <span className="trend-chip positive">{card.badge}</span>
            </div>
            <div className="dash-card-content">
              <h3>{card.title}</h3>
              <span>{card.value}</span>
              <p>{card.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-analytics-grid">
        <div className="dashboard-panel dashboard-panel-large">
          <div className="panel-header">
            <div>
              <h3>Sales Overview</h3>
              <p>{formatPrice(revenue)} total revenue</p>
            </div>
            <div className="panel-actions">
              <button type="button" className="admin-filter-chip subtle">
                Filter
              </button>
              <button type="button" className="admin-filter-chip subtle">
                Sort
              </button>
            </div>
          </div>

          <div className="sales-bars">
            {[
              { label: 'Oct', value: 45 },
              { label: 'Nov', value: 28 },
              { label: 'Dec', value: 68 },
            ].map((item) => (
              <div className="sales-month" key={item.label}>
                <div className="sales-stack">
                  <span style={{ height: `${Math.max(item.value - 24, 12)}%` }} />
                  <span style={{ height: `${Math.max(item.value - 14, 16)}%` }} />
                  <span style={{ height: `${Math.max(item.value - 4, 20)}%` }} />
                  <span style={{ height: `${item.value}%` }} />
                </div>
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>

          <div className="sales-legend">
            <span>Store</span>
            <span>Catalog</span>
            <span>Users</span>
            <span>Orders</span>
          </div>
        </div>

        <div className="dashboard-side-stack">
          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Payment Mix</h3>
                <p>Order status distribution</p>
              </div>
            </div>

            <div className="payment-mix">
              {[
                { label: 'Paid', value: paidOrders },
                { label: 'Processing', value: processingOrders },
                { label: 'Cancelled', value: cancelledOrders },
              ].map((item) => (
                <div className="payment-mix-row" key={item.label}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{formatPercent((item.value / totalOrders) * 100)}</span>
                  </div>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-panel">
            <div className="panel-header">
              <div>
                <h3>Store Snapshot</h3>
                <p>Average order value</p>
              </div>
              <button type="button" className="admin-filter-chip subtle">
                Weekly
              </button>
            </div>

            <div className="snapshot-value">{formatPrice(averageOrderValue)}</div>

            <div className="mini-bars">
              {[22, 34, 74, 28, 49, 39, 58].map((height, index) => (
                <div className="mini-bar-wrap" key={`${height}-${index}`}>
                  <span className={`mini-bar${index === 2 ? ' featured' : ''}`} style={{ height: `${height}%` }} />
                  <small>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index]}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-bottom-grid">
        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Orders</h3>
              <p>Latest order activity</p>
            </div>
          </div>

          <div className="admin-list">
            {recentOrders.length === 0 ? (
              <div className="empty-panel">No orders found.</div>
            ) : (
              recentOrders.map((order) => (
                <div className="admin-list-row" key={order.id}>
                  <div>
                    <strong>{order.customerName || order.address?.fullName || 'Customer'}</strong>
                    <span>{order.id}</span>
                  </div>
                  <div>
                    <strong>{formatPrice(order.total || 0)}</strong>
                    <span>{order.status || 'Placed'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="panel-header">
            <div>
              <h3>Top Products</h3>
              <p>Best visible catalog items</p>
            </div>
          </div>

          <div className="admin-list">
            {topProducts.length === 0 ? (
              <div className="empty-panel">No products found.</div>
            ) : (
              topProducts.map((product) => (
                <div className="admin-list-row" key={product.id}>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category || 'Uncategorized'}</span>
                  </div>
                  <div>
                    <strong>{formatPrice(product.price || 0)}</strong>
                    <span>{product.status || 'In Stock'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
