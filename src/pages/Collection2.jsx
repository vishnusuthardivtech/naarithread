import SharedCatalogPage from './SharedCatalogPage'
import { useApp } from '../context/AppContext'

export default function Collection2() {
  const { getProductsForPage } = useApp()

  return (
    <SharedCatalogPage
      title="Sequence Lehenga"
      subtitle="Handpicked styles for modern elegance"
      products={getProductsForPage('collection2')}
      showRating
      listingKey="collection2"
    />
  )
}
