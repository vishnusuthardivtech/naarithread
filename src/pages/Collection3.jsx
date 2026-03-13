import SharedCatalogPage from './SharedCatalogPage'
import { productsByPage } from '../data/products'

export default function Collection3() {
  return (
    <SharedCatalogPage
      title="Party Lehenga"
      subtitle="Handpicked styles for modern elegance"
      products={productsByPage.collection3 || []}
      listingKey="collection3"
    />
  )
}
