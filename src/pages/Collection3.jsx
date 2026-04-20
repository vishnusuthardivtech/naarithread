import SharedCatalogPage from './SharedCatalogPage'
import { useApp } from '../context/AppContext'

export default function Collection3() {
  const { getProductsForPage } = useApp()

  return (
    <SharedCatalogPage
      title="Party Lehenga"
      subtitle="Handpicked styles for modern elegance"
      products={getProductsForPage('collection3')}
      listingKey="collection3"
    />
  )
}
