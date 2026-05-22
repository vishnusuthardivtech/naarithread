import { useEffect, useState } from 'react'
import SharedCatalogPage from './SharedCatalogPage'

export default function Collection1() {

  const [products, setProducts] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    fetchProducts()

  }, [])

  async function fetchProducts() {

    try {

      const response = await fetch(
        'http://localhost:5000/api/products'
      )

      const data =
        await response.json()

      console.log(data)

      if (data.success) {

        const formattedProducts =
          data.data.map((product) => {

            let images = []

            try {

              const parsedImages =
                JSON.parse(
                  product.media || '[]'
                )

              images =
                parsedImages.map((image) => {

                  return `http://localhost:5000${image}`
                })

            } catch {

              images = []
            }

            return {

              // IDs

              id:
                product.product_id,

              product_id:
                product.product_id,

              // Names

              name:
                product.product_name,

              title:
                product.product_name,

              product_name:
                product.product_name,

              // Category

              category:
                product.category || 'Fashion',

              collection:
                product.collection || 'General',

              // Description

              description:
                product.descripion || '',

              // Details

              fabric:
                product.fabric || '',

              work:
                product.work || '',

              occasion:
                product.occasion || '',

              craftedIn:
                product.crafted_in || '',

              // Price

              price:
                Number(product.price) || 0,

              salePrice:
                Number(product.price) || 0,

              // Stock

              stock:
                Number(product.stock) || 0,

              inStock:
                Number(product.stock) > 0,

              // SKU

              sku:
                product.sku || '',

              // Size

              size:
                product.size || '',

              sizes:
                product.size
                  ? product.size.split(',')
                  : [],

              // IMPORTANT EMPTY FILTER ARRAYS

              colors: [],

              tags: [],

              badges: [],

              variants: [],

              filters: [],

              // Images

              images,

              image:
                images[0] || '',

              thumbnail:
                images[0] || '',

              // Status

              status:
                'ACTIVE',

              isActive:
                true,

              isArchived:
                false,

              featured:
                false,

              isNew:
                false
            }
          })

        console.log(
          formattedProducts
        )

        setProducts(formattedProducts)
      }

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  if (loading) {

    return (

      <div
        style={{
          color: '#fff',
          padding: '40px',
          textAlign: 'center'
        }}
      >
        Loading Products...
      </div>
    )
  }

  return (

    <SharedCatalogPage

      title="All Products"

      subtitle="Explore Our Latest Collection"

      products={products}

      // IMPORTANT
      // New unique key
      // to reset old filters

      listingKey="products"
    />
  )
}