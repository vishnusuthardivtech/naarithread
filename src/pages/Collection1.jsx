import SharedCatalogPage from './SharedCatalogPage'
import { useApp } from '../context/AppContext'

export default function Collection1() {
  const { getProductsForPage } = useApp()

  return (
    <SharedCatalogPage
      title="Mirror Lehenga"
      subtitle="Handpicked styles for modern elegance"
      products={getProductsForPage('collection1')}
      listingKey="collection1"
    />
  )
}
