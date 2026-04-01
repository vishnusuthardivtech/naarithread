import { useMemo, useState } from 'react'
import { formatPrice } from '../../utils/storage'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingState from '../components/LoadingState'
import Modal from '../components/Modal'
import Table from '../components/Table'
import { useAdminPageSearch } from '../context/AdminPageSearchContext'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { productService } from '../services/productService'

const CATEGORY_OPTIONS = ['Mirror Lehenga', 'Sequence Lehenga', 'Party Lehenga']
const COLLECTION_OPTIONS = ['Collection 1', 'Collection 2', 'Collection 3']

const adminProductSelectStyle = {
  padding: '12px 44px 12px 16px',
  borderRadius: '14px',
  border: '1px solid rgba(212, 175, 55, 0.4)',
  background: 'linear-gradient(180deg, rgba(31, 31, 31, 0.98), rgba(17, 17, 17, 0.98))',
  color: '#fff',
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
  backgroundImage:
    `linear-gradient(180deg, rgba(31, 31, 31, 0.98), rgba(17, 17, 17, 0.98)),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 20 20'%3E%3Cpath fill='%23f3ddac' d='M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.12l3.71-3.89a.75.75 0 1 1 1.08 1.04l-4.25 4.46a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundPosition: '0 0, right 14px center',
  backgroundSize: '100% 100%, 16px 16px',
}

const adminProductOptionStyle = {
  background: '#111',
  color: '#fff',
}

const adminCheckboxGroupStyle = {
  display: 'grid',
  gap: '12px',
}

const adminCheckboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  color: '#f6ead2',
  fontSize: '14px',
  fontWeight: 500,
}

const adminCheckboxStyle = {
  width: '16px',
  height: '16px',
  accentColor: '#d4af37',
}

const emptyForm = {
  name: '',
  category: '',
  collection: '',
  price: '',
  image: '',
  sku: '',
  stock: '',
  status: 'In Stock',
  showInNewArrival: false,
  showInBestSeller: false,
  description: '',
}

function getInitialForm(product) {
  if (!product) {
    return emptyForm
  }

  return {
    name: product.name || '',
    category: product.category || '',
    collection: product.collection || '',
    price: String(product.price ?? ''),
    image: product.image || '',
    sku: product.sku || '',
    stock: String(product.stock ?? ''),
    status: product.status || 'In Stock',
    showInNewArrival: Boolean(product.showInNewArrival),
    showInBestSeller: Boolean(product.showInBestSeller),
    description: product.description || '',
  }
}

function validateForm(form) {
  if (!form.name.trim()) return 'Product name is required'
  if (!form.price || Number(form.price) <= 0) return 'Price must be greater than zero'
  if (!form.image.trim()) return 'Image URL is required'
  if (!form.category.trim()) return 'Category is required'
  if (!form.description.trim()) return 'Description is required'
  return ''
}

export default function ProductsPage() {
  const { data: products = [], loading, error, reload } = useAdminCollection(productService.getAll)
  const { getQuery } = useAdminPageSearch()
  const [viewMode, setViewMode] = useState('table')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saveError, setSaveError] = useState('')
  const [actionError, setActionError] = useState('')
  const searchQuery = getQuery('/admin/products').trim().toLowerCase()
  const handleRefreshPage = () => window.location.reload()

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        if (!searchQuery) return true
        return [product.name, product.category, product.sku, product.status].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(searchQuery),
        )
      }),
    [products, searchQuery],
  )

  if (loading) {
    return <LoadingState label="Loading products..." />
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingProduct(null)
    setForm(emptyForm)
    setSaveError('')
  }

  function openCreateForm() {
    setEditingProduct(null)
    setForm(emptyForm)
    setSaveError('')
    setIsFormOpen(true)
  }

  function openEditForm(product) {
    setEditingProduct(product)
    setForm(getInitialForm(product))
    setSaveError('')
    setIsFormOpen(true)
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateCheckboxField(key) {
    setForm((current) => ({ ...current, [key]: !current[key] }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaveError('')
    setActionError('')

    const validationError = validateForm(form)
    if (validationError) {
      setSaveError(validationError)
      return
    }

    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, form)
      } else {
        await productService.create(form)
      }

      closeForm()
      await reload()
    } catch (submitError) {
      setSaveError(submitError instanceof Error ? submitError.message : 'Unable to save product')
    }
  }

  async function handleDelete(productId) {
    setActionError('')
    try {
      await productService.delete(productId)
      await reload()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Unable to delete product')
    }
  }

  const columns = [
    { header: 'Product', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price', render: (price) => formatPrice(price || 0) },
    { header: 'Stock', accessor: 'stock', render: (stock) => stock || 0 },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => <Badge variant={status === 'In Stock' ? 'success' : status === 'Out of Stock' ? 'danger' : 'processing'}>{status}</Badge>,
    },
    { header: 'SKU', accessor: 'sku', render: (sku) => sku || 'Not set' },
  ]

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">Manage the admin catalog with validated inputs, cleaner spacing, and stable editing.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleRefreshPage}>
            Refresh
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}>
            {viewMode === 'table' ? 'Grid View' : 'Table View'}
          </Button>
          <Button variant="primary" onClick={openCreateForm}>
            Add Product
          </Button>
        </div>
      </div>

      {error || actionError ? (
        <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{error || actionError}</div>
      ) : null}

      {filteredProducts.length === 0 ? (
        <EmptyState title="No Products" description="No products match the current page search." />
      ) : viewMode === 'table' ? (
        <Table columns={columns} data={filteredProducts} onRowClick={openEditForm} />
      ) : (
        <div className="grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <div className="relative overflow-hidden rounded-xl mb-4">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center admin-surface">
                    <span className="text-text-secondary">No Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-text-secondary">{product.category || 'Uncategorized'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gold">{formatPrice(product.price || 0)}</div>
                  <Badge variant={product.status === 'In Stock' ? 'success' : product.status === 'Out of Stock' ? 'danger' : 'processing'}>
                    {product.stock || 0} in stock
                  </Badge>
                </div>
                <div className="admin-action-row">
                  <Button size="sm" variant="secondary" onClick={() => openEditForm(product)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={closeForm}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        footer={
          <>
            <Button variant="secondary" onClick={closeForm}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="admin-product-form">
              {editingProduct ? 'Update Product' : 'Publish Product'}
            </Button>
          </>
        }
      >
        {saveError ? <div className="p-4 bg-danger/10 border-danger rounded-xl text-danger">{saveError}</div> : null}

        <form id="admin-product-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="admin-product-form-grid">
            <section className="admin-form-section">
              <h3 className="admin-form-section-title">Product Details</h3>
              <div className="admin-form-grid-two">
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-name">
                    Product Name
                  </label>
                  <input
                    id="product-name"
                    className="admin-input"
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-category">
                    Category
                  </label>
                  <select
                    id="product-category"
                    className="admin-select"
                    style={adminProductSelectStyle}
                    value={form.category}
                    onChange={(event) => updateField('category', event.target.value)}
                    required
                  >
                    <option value="" style={adminProductOptionStyle}>Select category</option>
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category} style={adminProductOptionStyle}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-collection">
                    Collection
                  </label>
                  <select
                    id="product-collection"
                    className="admin-select"
                    style={adminProductSelectStyle}
                    value={form.collection}
                    onChange={(event) => updateField('collection', event.target.value)}
                  >
                    <option value="" style={adminProductOptionStyle}>Select collection</option>
                    {COLLECTION_OPTIONS.map((collection) => (
                      <option key={collection} value={collection} style={adminProductOptionStyle}>
                        {collection}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="admin-form-field admin-form-field-full">
                  <label className="admin-label" htmlFor="product-description">
                    Description
                  </label>
                  <textarea
                    id="product-description"
                    className="admin-textarea"
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    required
                  />
                </div>
              </div>
            </section>

            <section className="admin-form-section">
              <h3 className="admin-form-section-title">Pricing & Inventory</h3>
              <div className="admin-form-grid-two">
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-price">
                    Price
                  </label>
                  <input
                    id="product-price"
                    className="admin-input"
                    type="number"
                    min="1"
                    step="1"
                    value={form.price}
                    onChange={(event) => updateField('price', event.target.value)}
                    required
                  />
                </div>
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-stock">
                    Stock
                  </label>
                  <input
                    id="product-stock"
                    className="admin-input"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) => updateField('stock', event.target.value)}
                  />
                </div>
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-sku">
                    SKU
                  </label>
                  <input
                    id="product-sku"
                    className="admin-input"
                    value={form.sku}
                    onChange={(event) => updateField('sku', event.target.value)}
                  />
                </div>
                <div className="admin-form-field">
                  <label className="admin-label" htmlFor="product-status">
                    Status
                  </label>
                  <select
                    id="product-status"
                    className="admin-select"
                    style={adminProductSelectStyle}
                    value={form.status}
                    onChange={(event) => updateField('status', event.target.value)}
                  >
                    <option value="In Stock" style={adminProductOptionStyle}>In Stock</option>
                    <option value="Low Stock" style={adminProductOptionStyle}>Low Stock</option>
                    <option value="Out of Stock" style={adminProductOptionStyle}>Out of Stock</option>
                  </select>
                </div>
                <div className="admin-form-field admin-form-field-full">
                  <span className="admin-label">Display Sections</span>
                  <div style={adminCheckboxGroupStyle}>
                    <label htmlFor="product-show-new-arrival" style={adminCheckboxLabelStyle}>
                      <input
                        id="product-show-new-arrival"
                        type="checkbox"
                        checked={form.showInNewArrival}
                        onChange={() => updateCheckboxField('showInNewArrival')}
                        style={adminCheckboxStyle}
                      />
                      <span>Show in New Arrival</span>
                    </label>
                    <label htmlFor="product-show-best-seller" style={adminCheckboxLabelStyle}>
                      <input
                        id="product-show-best-seller"
                        type="checkbox"
                        checked={form.showInBestSeller}
                        onChange={() => updateCheckboxField('showInBestSeller')}
                        style={adminCheckboxStyle}
                      />
                      <span>Show in Best Seller</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="admin-form-section">
            <h3 className="admin-form-section-title">Media</h3>
            <div className="admin-form-field">
              <label className="admin-label" htmlFor="product-image">
                Image URL
              </label>
              <input
                id="product-image"
                className="admin-input"
                type="url"
                value={form.image}
                onChange={(event) => updateField('image', event.target.value)}
                required
              />
            </div>

            {form.image ? (
              <div className="admin-image-preview mt-6">
                <img src={form.image} alt="Product preview" className="admin-image-preview-img" />
              </div>
            ) : null}
          </section>
        </form>
      </Modal>
    </div>
  )
}
