import SharedCatalogPage from './SharedCatalogPage'
import { productsByPage } from '../data/products'

export default function Collection1() {
  return (
    <SharedCatalogPage
      title="Mirror Lehenga"
      subtitle="Handpicked styles for modern elegance"
      products={productsByPage.collection1 || []}
      listingKey="collection1"
    />
  )
}
