import { formatPrice } from '../../utils/storage'
import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'

export default function ReportsPage() {
  const ordersState = useAdminCollection(orderService.getAll)
  const productsState = useAdminCollection(productService.getAll)

  if (ordersState.loading || productsState.loading) {
    return <LoadingState label="Loading reports..." />
  }

  const orders = ordersState.data
  const products = productsState.data
  const revenue = orders.reduce((sum, order) => sum + Number(order?.total || 0), 0)
  const averageOrder = orders.length ? revenue / orders.length : 0
  const deliveredOrders = orders.filter((order) => order?.status === 'Delivered').length

  return (
    <>
      <div className="reports-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-sub">Overview of orders, revenue, and catalog performance.</p>
        </div>
      </div>

      {ordersState.error || productsState.error ? <div className="error-banner">{ordersState.error || productsState.error}</div> : null}

      <section className="report-stats">
        <div className="stat-card">
          <p>Total Revenue</p>
          <h2>{formatPrice(revenue)}</h2>
        </div>
        <div className="stat-card">
          <p>Total Orders</p>
          <h2>{orders.length}</h2>
        </div>
        <div className="stat-card">
          <p>Delivered Orders</p>
          <h2>{deliveredOrders}</h2>
        </div>
        <div className="stat-card">
          <p>Average Order</p>
          <h2>{formatPrice(averageOrder)}</h2>
        </div>
      </section>

      <section className="top-products">
        <div className="table-header">
          <div>
            <h3>Catalog Summary</h3>
            <p className="page-sub">Top available product records in admin data.</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="empty-panel">No products found.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.slice(0, 6).map((product) => (
                <tr key={product.id}>
                  <td>{product?.name || 'Untitled product'}</td>
                  <td>{product?.category || 'Uncategorized'}</td>
                  <td>{formatPrice(product?.price || 0)}</td>
                  <td>{product?.status || 'In Stock'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  )
}
