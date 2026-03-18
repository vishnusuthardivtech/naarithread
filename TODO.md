# Image Loading Bug Fix - Production Hotfix

## Status: In Progress ✅

**Plan Approved**: Replace `assetPath(product.image)` → `product.image` in key files to bypass malformed paths.

## Steps:

### 1. ✅ Update ProductCard.jsx
- Remove `import { assetPath } from '../data/site'`
- Replace `<img src={assetPath(product.image)} alt={product.category} />` → `<img src={product.image} alt={product.category} />`
- Replace `image: assetPath(product.image),` → `image: product.image,`

### 2. ✅ Update Home.jsx
- Replace `<img src={assetPath(item.image)} alt={item.title} />` → `<img src={item.image} alt={item.title} />` (signatureProducts)

### 3. ✅ Verify Complete
- Fixed `ProductCard.jsx`: All product images now use direct `product.image` paths.
- Fixed `Home.jsx`: Signature products use direct `item.image`.
- **Root cause**: `assetPath` prepended `/assets/` to already-absolute paths (e.g., "/assets/foo" → "/assets//assets/foo"), causing 404s.
- **Result**: Images load from correct URLs like `http://localhost:5175/assets/featured-lehengas/1.jpg`. Cart stores correct paths.
- Dev server HMR applied changes instantly. Console 404s eliminated.

## ✅ BUG FIX COMPLETE
