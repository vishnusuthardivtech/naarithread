import SharedCatalogPage from './SharedCatalogPage'
import { productsByPage } from '../data/products'

export default function NewArrival() {
  return (
    <SharedCatalogPage
      title="New Arrivals"
      subtitle="Fresh styles for modern celebrations"
      products={productsByPage.newArrival || []}
      cardClassName="product-card new-product-card"
      listingKey="newArrival"
      showNewBadge
    />
  )
}
