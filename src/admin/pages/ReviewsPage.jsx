import { useMemo, useState } from 'react'
import Badge from '../components/Badge'
import Button from '../components/Button'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Table from '../components/Table'
import { useAdminPageSearch } from '../context/AdminPageSearchContext'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { reviewService } from '../services/reviewService'

const FILTERS = ['all', 'pending', 'approved', 'rejected']

function formatReviewDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getStatusVariant(status) {
  if (status === 'approved') return 'success'
  if (status === 'rejected') return 'danger'
  return 'processing'
}

export default function ReviewsPage() {
  const { data: reviews = [], loading, error, reload } = useAdminCollection(reviewService.getAdminReviews)
  const { getQuery } = useAdminPageSearch()
  const [statusFilter, setStatusFilter] = useState('pending')
  const [actionError, setActionError] = useState('')
  const [updatingId, setUpdatingId] = useState('')
  const searchQuery = getQuery('/admin/reviews').trim().toLowerCase()

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        const matchesFilter = statusFilter === 'all' ? true : review.status === statusFilter
        const matchesSearch = !searchQuery
          || [review.productName, review.userName, review.comment, review.status].some((value) =>
            String(value || '')
              .toLowerCase()
              .includes(searchQuery),
          )

        return matchesFilter && matchesSearch
      }),
    [reviews, searchQuery, statusFilter],
  )

  async function handleStatusUpdate(reviewId, nextStatus) {
    setActionError('')
    setUpdatingId(reviewId)

    try {
      await reviewService.updateReviewStatus(reviewId, nextStatus)
      await reload()
    } catch (updateError) {
      setActionError(updateError instanceof Error ? updateError.message : 'Unable to update review')
    } finally {
      setUpdatingId('')
    }
  }

  if (loading) {
    return <LoadingState label="Loading reviews..." />
  }

  const columns = [
    { header: 'Product', accessor: 'productName' },
    { header: 'User', accessor: 'userName' },
    { header: 'Rating', accessor: 'rating', render: (rating) => `${rating} / 5` },
    {
      header: 'Comment',
      accessor: 'comment',
      render: (comment, row) => (
        <div>
          <div>{comment}</div>
          {row.isVerifiedPurchase ? <div className="admin-review-meta">Verified buyer</div> : null}
        </div>
      ),
    },
    { header: 'Date', accessor: 'createdAt', render: (value) => formatReviewDate(value) },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => <Badge variant={getStatusVariant(status)}>{status}</Badge>,
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (_, row) => (
        <div className="admin-review-actions" onClick={(event) => event.stopPropagation()}>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleStatusUpdate(row.id, 'approved')}
            disabled={updatingId === row.id || row.status === 'approved'}
          >
            Approve
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleStatusUpdate(row.id, 'rejected')}
            disabled={updatingId === row.id || row.status === 'rejected'}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reviews Management</h1>
          <p className="page-sub">Approve genuine reviews, reject abuse or spam, and keep public ratings trustworthy.</p>
        </div>
        <div className="admin-review-filter-row">
          {FILTERS.map((filter) => (
            <Button
              key={filter}
              size="sm"
              variant={statusFilter === filter ? 'primary' : 'secondary'}
              onClick={() => setStatusFilter(filter)}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {error || actionError ? (
        <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{error || actionError}</div>
      ) : null}

      {filteredReviews.length === 0 ? (
        <EmptyState title="No Reviews" description="No reviews match the current moderation filter." />
      ) : (
        <Table columns={columns} data={filteredReviews} />
      )}
    </div>
  )
}
