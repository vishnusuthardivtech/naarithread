import SharedCatalogPage from './SharedCatalogPage'
import { useApp } from '../context/AppContext'

export default function NewArrival() {
  const { getProductsForPage } = useApp()

  return (
    <SharedCatalogPage
      title="New Arrivals"
      subtitle="Fresh styles for modern celebrations"
      products={getProductsForPage('newArrival')}
      cardClassName="product-card new-product-card"
      listingKey="newArrival"
      showNewBadge
    />
  )
}
