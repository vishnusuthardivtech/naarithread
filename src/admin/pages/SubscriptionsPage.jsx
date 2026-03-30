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

export default function SubscriptionsPage() {
  const { data: subscribers = [], loading, error, reload } = useAdminCollection(userService.getAll)
  const { getQuery } = useAdminPageSearch()
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)
  const searchQuery = getQuery('/admin/subscriptions').trim().toLowerCase()
  const handleRefreshPage = () => window.location.reload()

  const filteredSubscribers = useMemo(
    () =>
      subscribers.filter((subscriber) => {
        if (!searchQuery) return true
        return [subscriber.name, subscriber.email].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(searchQuery),
        )
      }),
    [subscribers, searchQuery],
  )

  function handleExport() {
    const csv = buildCsv([
      ['Name', 'Email', 'Orders'],
      ...filteredSubscribers.map((subscriber) => [subscriber.name || '', subscriber.email || '', subscriber.orderCount || 0]),
    ])

    downloadFile('admin-subscribers.csv', csv, 'text/csv;charset=utf-8;')
  }

  const columns = [
    { header: 'Customer', accessor: 'name', render: (name) => name || 'Customer' },
    { header: 'Email', accessor: 'email' },
    { header: 'Orders', accessor: 'orderCount', render: (count) => count || 0 },
    { header: 'Status', accessor: 'id', render: () => <Badge variant="success">Active</Badge> },
    { header: 'Last Order', accessor: 'orderCount', render: (count) => (count ? `${count} order(s)` : 'No orders') },
    {
      header: 'Action',
      accessor: 'id',
      render: (_, row) => (
        <Button size="sm" variant="secondary" onClick={() => setSelectedSubscriber(row)}>
          View
        </Button>
      ),
    },
  ]

  if (loading) {
    return <LoadingState label="Loading subscribers..." />
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subscribers</h1>
          <p className="page-sub">Refresh, export, and view actions now work with page-only topbar filtering.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleRefreshPage}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={handleExport}>
            Export List
          </Button>
        </div>
      </div>

      {error ? <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{error}</div> : null}

      {filteredSubscribers.length === 0 ? (
        <EmptyState title="No Subscribers" description="No subscribers match the current page search." />
      ) : (
        <Card title={`Active Subscribers (${filteredSubscribers.length})`} subtitle="Audience list synced from current admin data">
          <Table columns={columns} data={filteredSubscribers} />
        </Card>
      )}

      <Modal
        isOpen={Boolean(selectedSubscriber)}
        onClose={() => setSelectedSubscriber(null)}
        title={selectedSubscriber ? selectedSubscriber.name || 'Subscriber' : 'Subscriber'}
        footer={<Button onClick={() => setSelectedSubscriber(null)}>Close</Button>}
      >
        {selectedSubscriber ? (
          <div className="space-y-4">
            <div className="list-item">
              <span>Email</span>
              <span>{selectedSubscriber.email || 'Not available'}</span>
            </div>
            <div className="list-item">
              <span>Orders</span>
              <span>{selectedSubscriber.orderCount || 0}</span>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}
