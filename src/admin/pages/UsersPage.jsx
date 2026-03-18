import { useMemo, useState } from 'react'
import { formatPrice } from '../../utils/storage'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { useAdminToast } from '../hooks/useAdminToast'
import { userService } from '../services/userService'

export default function UsersPage() {
  const { data: users, loading, error, reload } = useAdminCollection(userService.getAll)
  const { pushToast } = useAdminToast()
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredUsers = useMemo(() => {
    return users.filter((user) => `${user.name} ${user.email}`.toLowerCase().includes(search.trim().toLowerCase()))
  }, [search, users])

  const removeUser = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await userService.delete(deleteTarget.id)
      pushToast({
        title: 'User deleted',
        description: `${deleteTarget.email} and related admin-facing data were removed.`,
      })
      await reload()
    } catch (deleteError) {
      pushToast({
        title: 'Unable to delete user',
        description: deleteError instanceof Error ? deleteError.message : 'Unknown error',
        tone: 'error',
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading users..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customers"
        title="Users"
        description="This list reads the real storefront registration data. No fake users are injected into the admin UI."
        actions={
          <input
            className="admin-input md:w-72"
            placeholder="Search users by name or email"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        }
      />

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div className="admin-panel">
        {filteredUsers.length === 0 ? (
          <EmptyState title="No users found" description="Registered customers will appear here automatically." />
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-th">User</th>
                  <th className="admin-th">Joined</th>
                  <th className="admin-th">Orders</th>
                  <th className="admin-th">Spent</th>
                  <th className="admin-th">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="admin-td">
                      <p className="font-semibold text-slate-950">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="admin-td">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not recorded'}</td>
                    <td className="admin-td">{user.orderCount || 0}</td>
                    <td className="admin-td font-semibold text-slate-900">{formatPrice(user.totalSpent || 0)}</td>
                    <td className="admin-td">
                      <button type="button" className="admin-button-danger" onClick={() => setDeleteTarget(user)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete user?"
        description={`This will remove ${deleteTarget?.email ?? 'this user'} and their admin-linked order/profile records from localStorage.`}
        confirmLabel="Delete user"
        onConfirm={removeUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
