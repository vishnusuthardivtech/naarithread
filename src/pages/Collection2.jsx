import SharedCatalogPage from './SharedCatalogPage'
import { productsByPage } from '../data/products'

export default function Collection2() {
  return (
    <SharedCatalogPage
      title="Sequence Lehenga"
      subtitle="Handpicked styles for modern elegance"
      products={productsByPage.collection2 || []}
      showRating
      listingKey="collection2"
    />
  )
}
