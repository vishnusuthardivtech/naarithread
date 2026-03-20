import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { userService } from '../services/userService'

function formatJoinedDate(value) {
  if (!value) {
    return 'Not recorded'
  }

  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function UsersPage() {
  const { data: users, loading, error } = useAdminCollection(userService.getAll)

  if (loading) {
    return <LoadingState label="Loading users..." />
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Users</h1>
          <p className="page-sub">Customer records built from registered accounts and order activity.</p>
        </div>
      </div>

      {error ? <div className="error-banner">{error}</div> : null}

      <div className="users-wrapper">
        {users.length === 0 ? (
          <div className="empty-panel">No users found.</div>
        ) : (
          users.map((user) => (
            <div className="user-card" key={user.id}>
              <div className="user-info">
                <h3>{user.name || user.email}</h3>
                <p>{user.email}</p>
              </div>

              <div className="user-meta">
                <span>
                  <strong>Joined:</strong> {formatJoinedDate(user.createdAt || user.joinedAt)}
                </span>
                <span>
                  <strong>Orders:</strong> {user.orderCount || 0}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  )
}
