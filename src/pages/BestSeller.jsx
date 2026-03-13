import SharedCatalogPage from './SharedCatalogPage'
import { productsByPage } from '../data/products'

export default function BestSeller() {
  return (
    <SharedCatalogPage
      title="Our Best Sellers"
      subtitle="Where elegance meets demand"
      products={productsByPage.bestSeller || []}
      listingKey="bestSeller"
    />
  )
}
