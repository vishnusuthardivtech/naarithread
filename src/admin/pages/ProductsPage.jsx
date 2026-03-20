import { useState } from 'react'
import { formatPrice } from '../../utils/storage'
import LoadingState from '../components/LoadingState'
import { useAdminCollection } from '../hooks/useAdminCollection'
import { productService } from '../services/productService'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  image: '',
  sku: '',
  stock: '',
  status: 'In Stock',
  description: '',
}

export default function ProductsPage() {
  const { data: products, loading, error, reload } = useAdminCollection(productService.getAll)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [saveError, setSaveError] = useState('')
  const [actionError, setActionError] = useState('')

  if (loading) {
    return <LoadingState label="Loading products..." />
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId('')
    setForm(emptyForm)
    setSaveError('')
  }

  const openCreateForm = () => {
    setEditingId('')
    setForm(emptyForm)
    setSaveError('')
    setIsFormOpen(true)
  }

  const openEditForm = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name || '',
      category: product.category || '',
      price: String(product.price ?? ''),
      image: product.image || '',
      sku: product.sku || '',
      stock: String(product.stock ?? ''),
      status: product.status || 'In Stock',
      description: product.description || '',
    })
    setSaveError('')
    setIsFormOpen(true)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaveError('')
    setActionError('')

    try {
      if (editingId) {
        await productService.update(editingId, form)
      } else {
        await productService.create(form)
      }

      closeForm()
      await reload()
    } catch (submitError) {
      setSaveError(submitError instanceof Error ? submitError.message : 'Unable to save product')
    }
  }

  const handleDelete = async (productId) => {
    setActionError('')

    try {
      await productService.delete(productId)
      await reload()
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'Unable to delete product')
    }
  }

  return (
    <>
      <div className="topbar">
        <h1>Products</h1>
        <button type="button" className="add-btn" onClick={openCreateForm}>
          + Add Product
        </button>
      </div>

      {error || actionError ? <div className="error-banner">{error || actionError}</div> : null}

      {products.length === 0 ? (
        <div className="empty-panel">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image">
                {product.image ? <img src={product.image} alt={product.name} /> : <div className="product-image-fallback">No Image</div>}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>Category: {product.category || 'N/A'}</p>
                <div className="price">{formatPrice(product.price || 0)}</div>
              </div>
              <div className="actions">
                <button type="button" className="edit" onClick={() => openEditForm(product)}>
                  Edit
                </button>
                <button type="button" className="delete" onClick={() => handleDelete(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen ? (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-card" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h1 className="page-title">{editingId ? 'Edit Product' : 'Add New Product'}</h1>
              <button type="button" className="modal-close" onClick={closeForm}>
                Close
              </button>
            </div>

            <form className="pro-form" onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Basic Information</h2>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  required
                />
                <input
                  type="text"
                  placeholder="SKU Code"
                  value={form.sku}
                  onChange={(event) => setForm((current) => ({ ...current, sku: event.target.value }))}
                />
                <textarea
                  placeholder="Short Description"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                />
              </div>

              <div className="form-section">
                <h2>Pricing</h2>
                <input
                  type="number"
                  placeholder="Final Price (₹)"
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  required
                />
                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={form.stock}
                  onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))}
                  required
                />
              </div>

              <div className="form-section">
                <h2>Category &amp; Placement</h2>
                <input
                  type="text"
                  placeholder="Category"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  required
                />
                <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="form-section">
                <h2>Product Images</h2>
                <label>Main Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={form.image}
                  onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))}
                  required
                />
              </div>

              {saveError ? <div className="error-banner">{saveError}</div> : null}

              <button type="submit" className="submit-btn">
                {editingId ? 'Update Product' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  )
}
