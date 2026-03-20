import { formatPrice } from '../../utils/storage'
import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { orderService } from '../services/orderService'
import { productService } from '../services/productService'
import { userService } from '../services/userService'

export default function DashboardPage() {
  const productsState = useAdminCollection(productService.getAll)
  const ordersState = useAdminCollection(orderService.getAll)
  const usersState = useAdminCollection(userService.getAll)

  if (productsState.loading || ordersState.loading || usersState.loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  const revenue = ordersState.data.reduce((sum, order) => sum + Number(order.total || 0), 0)

  return (
    <>
      <div className="topbar">
        <h1>Dashboard</h1>
      </div>

      {productsState.error || ordersState.error || usersState.error ? (
        <div className="error-banner">{productsState.error || ordersState.error || usersState.error}</div>
      ) : null}

      <section className="dashboard-cards">
        <div className="dash-card">
          <h3>Total Products</h3>
          <span>{productsState.data.length}</span>
        </div>

        <div className="dash-card">
          <h3>Total Orders</h3>
          <span>{ordersState.data.length}</span>
        </div>

        <div className="dash-card">
          <h3>Total Users</h3>
          <span>{usersState.data.length}</span>
        </div>

        <div className="dash-card">
          <h3>Revenue</h3>
          <span>{formatPrice(revenue)}</span>
        </div>
      </section>
    </>
  )
}
