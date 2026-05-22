import { useEffect, useState } from 'react'

export default function ProductsPage() {

  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  // ============================
  // FORM STATE
  // ============================

  const [form, setForm] = useState({

    product_name: '',
    category: '',
    collection: '',
    descripion: '',
    fabric: '',
    work: '',
    occasion: '',
    crafted_in: '',
    price: '',
    stock: '',
    sku: '',
    size: ''
  })

  // ============================
  // IMAGE STATE
  // ============================

  const [images, setImages] =
    useState([])

  const [previewImages, setPreviewImages] =
    useState([])

  // ============================
  // FETCH PRODUCTS
  // ============================

  async function fetchProducts() {

    try {

      const response = await fetch(
        'http://localhost:5000/api/products'
      )

      const data =
        await response.json()

      if (data.success) {

        setProducts(data.data)
      }

    } catch (error) {

      console.log(error)
    }
  }

  useEffect(() => {

    fetchProducts()

  }, [])

  // ============================
  // HANDLE INPUT CHANGE
  // ============================

  function handleChange(event) {

    setForm({

      ...form,

      [event.target.name]:
        event.target.value
    })
  }

  // ============================
  // HANDLE IMAGE CHANGE
  // ============================

  function handleImageChange(event) {

    const files = Array.from(
      event.target.files
    )

    setImages(files)

    const previews = files.map((file) => ({

      file,

      url: URL.createObjectURL(file)
    }))

    setPreviewImages(previews)
  }

  // ============================
  // CREATE PRODUCT
  // ============================

  async function handleSubmit(event) {

    event.preventDefault()

    setLoading(true)

    setMessage('')

    try {

      const formData = new FormData()

      // TEXT FIELDS

      Object.keys(form).forEach((key) => {

        formData.append(
          key,
          form[key]
        )
      })

      // MULTIPLE IMAGES

      images.forEach((image) => {

        formData.append(
          'media',
          image
        )
      })

      const response = await fetch(

        'http://localhost:5000/api/products',

        {
          method: 'POST',
          body: formData
        }
      )

      const data =
        await response.json()

      console.log(data)

      if (!response.ok) {

        throw new Error(
          data.message ||
          'Unable to create product'
        )
      }

      setMessage(
        'Product Created Successfully'
      )

      // RESET FORM

      setForm({

        product_name: '',
        category: '',
        collection: '',
        descripion: '',
        fabric: '',
        work: '',
        occasion: '',
        crafted_in: '',
        price: '',
        stock: '',
        sku: '',
        size: ''
      })

      setImages([])

      setPreviewImages([])

      fetchProducts()

    } catch (error) {

      console.log(error)

      setMessage(error.message)
    }

    setLoading(false)
  }

  // ============================
  // DELETE PRODUCT
  // ============================

  async function deleteProduct(id) {

    try {

      const response = await fetch(

        `http://localhost:5000/api/products/${id}`,

        {
          method: 'DELETE'
        }
      )

      const data =
        await response.json()

      console.log(data)

      fetchProducts()

    } catch (error) {

      console.log(error)
    }
  }

  return (

    <div
      style={{
        padding: '30px',
        background: '#0f0f0f',
        minHeight: '100vh'
      }}
    >

      {/* ===================== */}
      {/* CREATE PRODUCT FORM */}
      {/* ===================== */}

      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: '#171717',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '50px'
        }}
      >

        <h1
          style={{
            color: '#fff',
            marginBottom: '25px',
            fontSize: '34px'
          }}
        >
          Create Product
        </h1>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="product_name"
            placeholder="Product Name"
            value={form.product_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="collection"
            placeholder="Collection"
            value={form.collection}
            onChange={handleChange}
            style={inputStyle}
          />

          <textarea
            name="descripion"
            placeholder="Description"
            value={form.descripion}
            onChange={handleChange}
            style={textareaStyle}
          />

          <input
            type="text"
            name="fabric"
            placeholder="Fabric"
            value={form.fabric}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="work"
            placeholder="Work"
            value={form.work}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="occasion"
            placeholder="Occasion"
            value={form.occasion}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="crafted_in"
            placeholder="Crafted In"
            value={form.crafted_in}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="size"
            placeholder="Size Example: S,M,L,XL"
            value={form.size}
            onChange={handleChange}
            style={inputStyle}
          />

          {/* ===================== */}
          {/* IMAGE INPUT */}
          {/* ===================== */}

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <label
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '10px',
                fontWeight: '600'
              }}
            >
              Upload Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{
                color: '#fff'
              }}
            />

          </div>

          {/* ===================== */}
          {/* IMAGE PREVIEW */}
          {/* ===================== */}

          {
            previewImages.length > 0 && (

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fill,minmax(180px,1fr))',
                  gap: '20px',
                  marginBottom: '30px'
                }}
              >

                {
                  previewImages.map(
                    (image, index) => (

                      <div
                        key={index}
                        style={{
                          background: '#222',
                          padding: '10px',
                          borderRadius: '14px'
                        }}
                      >

                        <img
                          src={image.url}
                          alt="Preview"
                          style={{
                            width: '100%',
                            height: '180px',
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />

                        <p
                          style={{
                            color: '#fff',
                            fontSize: '12px',
                            marginTop: '10px',
                            wordBreak: 'break-word'
                          }}
                        >
                          {image.file.name}
                        </p>

                      </div>
                    )
                  )
                }

              </div>
            )
          }

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >

            {
              loading
                ? 'Creating Product...'
                : 'Create Product'
            }

          </button>

        </form>

        {
          message && (

            <p
              style={{
                color: '#fff',
                marginTop: '20px'
              }}
            >
              {message}
            </p>
          )
        }

      </div>

      {/* ===================== */}
      {/* PRODUCT LIST */}
      {/* ===================== */}

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >

        <h2
          style={{
            color: '#fff',
            marginBottom: '25px'
          }}
        >
          All Products
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill,minmax(280px,1fr))',
            gap: '25px'
          }}
        >

          {
            products.map((product) => {

              let images = []

              try {

                images = JSON.parse(
                  product.media || '[]'
                )

              } catch {

                images = []
              }

              return (

                <div
                  key={product.product_id}
                  style={{
                    background: '#171717',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    border: '1px solid #2c2c2c'
                  }}
                >

                  {
                    images.length > 0 ? (

                      <img
                        src={`http://localhost:5000${images[0]}`}
                        alt={product.product_name}
                        style={{
                          width: '100%',
                          height: '260px',
                          objectFit: 'cover'
                        }}
                      />

                    ) : (

                      <div
                        style={{
                          height: '260px',
                          background: '#222'
                        }}
                      />
                    )
                  }

                  <div
                    style={{
                      padding: '20px'
                    }}
                  >

                    <h3
                      style={{
                        color: '#fff',
                        marginBottom: '10px'
                      }}
                    >
                      {product.product_name}
                    </h3>

                    <p
                      style={{
                        color: '#aaa',
                        marginBottom: '8px'
                      }}
                    >
                      {product.category}
                    </p>

                    <p
                      style={{
                        color: '#d4af37',
                        fontWeight: '700',
                        marginBottom: '15px'
                      }}
                    >
                      ₹ {product.price}
                    </p>

                    <button
                      onClick={() =>
                        deleteProduct(
                          product.product_id
                        )
                      }
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: 'none',
                        borderRadius: '10px',
                        background: '#ff4d4d',
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Delete Product
                    </button>

                  </div>

                </div>
              )
            })
          }

        </div>

      </div>

    </div>
  )
}

const inputStyle = {

  width: '100%',

  padding: '14px',

  marginBottom: '16px',

  borderRadius: '12px',

  border: '1px solid #333',

  background: '#1b1b1b',

  color: '#fff',

  outline: 'none',

  fontSize: '14px'
}

const textareaStyle = {

  ...inputStyle,

  minHeight: '120px'
}

const buttonStyle = {

  width: '100%',

  padding: '15px',

  border: 'none',

  borderRadius: '14px',

  background: '#d4af37',

  color: '#000',

  fontWeight: '700',

  cursor: 'pointer',

  fontSize: '16px'
}