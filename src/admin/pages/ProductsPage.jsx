import { useMemo, useState } from 'react'
import { formatPrice } from '../../utils/storage'
import ConfirmModal from '../components/ConfirmModal'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { useAdminToast } from '../hooks/useAdminToast'
import { productService } from '../services/productService'

const defaultProductForm = {
  name: '',
  category: '',
  price: '',
  image: '',
  sku: '',
  stock: '',
  status: 'active',
  description: '',
}

const productStatusOptions = ['active', 'draft', 'archived']

export default function ProductsPage() {
  const { data: products, loading, error, reload } = useAdminCollection(productService.getAll)
  const { pushToast } = useAdminToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [form, setForm] = useState(defaultProductForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.sku}`.toLowerCase().includes(search.trim().toLowerCase())
      const matchesStatus = statusFilter === 'all' ? true : product.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [products, search, statusFilter])

  const resetForm = () => {
    setForm(defaultProductForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        await productService.update(editingId, form)
        pushToast({
          title: 'Product updated',
          description: 'The product record was updated and the table refreshed immediately.',
        })
      } else {
        await productService.create(form)
        pushToast({
          title: 'Product created',
          description: 'A new product was added to the dynamic product store.',
        })
      }

      resetForm()
      await reload()
    } catch (saveError) {
      pushToast({
        title: 'Unable to save product',
        description: saveError instanceof Error ? saveError.message : 'Unknown error',
        tone: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      category: product.category || '',
      price: String(product.price ?? ''),
      image: product.image || '',
      sku: product.sku || '',
      stock: String(product.stock ?? ''),
      status: product.status || 'active',
      description: product.description || '',
    })
  }

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return
    }

    try {
      await productService.delete(deleteTarget.id)
      pushToast({
        title: 'Product deleted',
        description: `${deleteTarget.name} was removed from the product store.`,
      })
      if (editingId === deleteTarget.id) {
        resetForm()
      }
      await reload()
    } catch (deleteError) {
      pushToast({
        title: 'Unable to delete product',
        description: deleteError instanceof Error ? deleteError.message : 'Unknown error',
        tone: 'error',
      })
    } finally {
      setDeleteTarget(null)
    }
  }

  if (loading) {
    return <LoadingState label="Loading products..." />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Products"
        description="Full CRUD lives here. Every row is read from the products service, every action persists to localStorage, and the UI refreshes immediately after create, edit, or delete."
        actions={
          <>
            <button type="button" className="admin-button-secondary" onClick={resetForm}>
              Reset form
            </button>
            <button type="button" className="admin-button-primary" onClick={reload}>
              Refresh
            </button>
          </>
        }
      />

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
        <form className="admin-panel space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-950">{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <span className="admin-badge bg-indigo-50 text-indigo-700">{editingId ? 'Update mode' : 'Create mode'}</span>
          </div>

          <div>
            <label className="admin-label">Product Name</label>
            <input className="admin-input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Category</label>
              <input className="admin-input" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} required />
            </div>
            <div>
              <label className="admin-label">SKU</label>
              <input className="admin-input" value={form.sku} onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))} placeholder="NT-0001" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="admin-label">Price</label>
              <input className="admin-input" type="number" min="0" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required />
            </div>
            <div>
              <label className="admin-label">Stock</label>
              <input className="admin-input" type="number" min="0" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} required />
            </div>
          </div>

          <div>
            <label className="admin-label">Image URL</label>
            <input className="admin-input" value={form.image} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="/naarithread/images/featured/1.jpg" required />
          </div>

          <div>
            <label className="admin-label">Status</label>
            <select className="admin-select" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
              {productStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="admin-label">Description</label>
            <textarea className="admin-input min-h-[120px]" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </div>

          <button type="submit" className="admin-button-primary w-full" disabled={saving}>
            {saving ? 'Saving product...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>

        <div className="admin-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Product Inventory</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredProducts.length} matching product(s)</p>
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                className="admin-input md:w-64"
                placeholder="Search by name, category, or SKU"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <select className="admin-select md:w-44" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                {productStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <EmptyState title="No products found" description="Try clearing the search, changing the filter, or creating a new product." />
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="admin-th">Product</th>
                    <th className="admin-th">Price</th>
                    <th className="admin-th">Stock</th>
                    <th className="admin-th">Status</th>
                    <th className="admin-th">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="admin-td">
                        <div className="flex gap-4">
                          <img src={product.image} alt={product.name} className="h-16 w-16 rounded-2xl border border-slate-200 object-cover" />
                          <div>
                            <p className="font-semibold text-slate-950">{product.name}</p>
                            <p className="text-xs text-slate-500">{product.category}</p>
                            <p className="mt-1 text-xs text-slate-400">{product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-td font-semibold text-slate-900">{formatPrice(product.price || 0)}</td>
                      <td className="admin-td">{product.stock ?? 0}</td>
                      <td className="admin-td">
                        <span className="admin-badge bg-slate-100 text-slate-700">{product.status}</span>
                      </td>
                      <td className="admin-td">
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className="admin-button-secondary" onClick={() => startEdit(product)}>
                            Edit
                          </button>
                          <button type="button" className="admin-button-danger" onClick={() => setDeleteTarget(product)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete product?"
        description={`This will permanently remove ${deleteTarget?.name ?? 'this product'} from the admin catalog.`}
        confirmLabel="Delete product"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
