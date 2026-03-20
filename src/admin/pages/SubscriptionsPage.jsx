import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { userService } from '../services/userService'

export default function SubscriptionsPage() {
  const { data: users, loading, error } = useAdminCollection(userService.getAll)

  if (loading) {
    return <LoadingState label="Loading subscriptions..." />
  }

  return (
    <>
      <div className="reports-header">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-sub">Customer list connected to the admin workspace.</p>
        </div>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      <section className="subscriber-table">
        {users.length === 0 ? (
          <div className="empty-panel">No subscribers found.</div>
        ) : (
          <div>
            <div className="table-row table-head">
              <span>Name</span>
              <span>Email</span>
              <span>Orders</span>
              <span>Status</span>
            </div>
            {users.map((user) => (
              <div className="table-row" key={user.id}>
                <span>{user?.name || 'Customer'}</span>
                <span>{user?.email || 'Not available'}</span>
                <span>{user?.orderCount || 0}</span>
                <span>Active</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
