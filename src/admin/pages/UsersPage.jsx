import { useMemo, useState } from 'react'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { useAdminPageSearch } from '../context/AdminPageSearchContext'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { userService } from '../services/userService'

function formatJoinedDate(value) {
  if (!value) return 'Not recorded'
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function UsersPage() {
  const { data: users = [], loading, error, reload } = useAdminCollection(userService.getAll)
  const { getQuery } = useAdminPageSearch()
  const [selectedUser, setSelectedUser] = useState(null)
  const searchQuery = getQuery('/admin/users').trim().toLowerCase()
  const handleRefreshPage = () => window.location.reload()

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        if (!searchQuery) return true
        return [user.name, user.email].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(searchQuery),
        )
      }),
    [users, searchQuery],
  )

  const columns = [
    { header: 'Customer', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Orders', accessor: 'orderCount', render: (count) => count || 0 },
    { header: 'Joined', accessor: 'createdAt', render: formatJoinedDate },
    { header: 'Status', accessor: 'id', render: () => <Badge variant="success">Active</Badge> },
    {
      header: 'Action',
      accessor: 'id',
      render: (_, row) => (
        <Button size="sm" variant="secondary" onClick={() => setSelectedUser(row)}>
          View
        </Button>
      ),
    },
  ]

  if (loading) {
    return <LoadingState label="Loading users..." />
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-sub">Working refresh and view actions with topbar-only current-page search.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleRefreshPage}>
            Refresh
          </Button>
        </div>
      </div>

      {error ? <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{error}</div> : null}

      {filteredUsers.length === 0 ? (
        <EmptyState title="No Customers" description="No customers match the current page search." />
      ) : (
        <Card title={`Customers (${filteredUsers.length})`} subtitle={`Showing ${filteredUsers.length} of ${users.length}`}>
          <Table columns={columns} data={filteredUsers} />
        </Card>
      )}

      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        title={selectedUser ? selectedUser.name || 'Customer Details' : 'Customer Details'}
        footer={<Button variant="primary" onClick={() => setSelectedUser(null)}>Close</Button>}
      >
        {selectedUser ? (
          <div className="space-y-4">
            <div className="list-item">
              <span>Email</span>
              <span>{selectedUser.email || 'Not available'}</span>
            </div>
            <div className="list-item">
              <span>Orders</span>
              <span>{selectedUser.orderCount || 0}</span>
            </div>
            <div className="list-item">
              <span>Joined</span>
              <span>{formatJoinedDate(selectedUser.createdAt)}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
