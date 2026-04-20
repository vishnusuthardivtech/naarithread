import SharedCatalogPage from './SharedCatalogPage'
import { useApp } from '../context/AppContext'

export default function BestSeller() {
  const { getProductsForPage } = useApp()

  return (
    <SharedCatalogPage
      title="Our Best Sellers"
      subtitle="Where elegance meets demand"
      products={getProductsForPage('bestSeller')}
      listingKey="bestSeller"
    />
  )
}
