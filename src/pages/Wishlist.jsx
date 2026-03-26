import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { allProducts } from '../data/products'
import { assetPath } from '../data/site'
import { useWishlist } from '../hooks/useWishlist'
import { formatPrice } from '../utils/storage'

const FALLBACK_IMAGE = '/vite.svg'

const resolveProductImage = (item = {}) => {
  const directImage = item?.image || item?.img
  if (directImage) {
    if (/^(https?:)?\/\//.test(directImage) || directImage.startsWith('data:')) {
      return directImage
    }

    return assetPath(directImage)
  }

  const matchedProduct = allProducts.find((product) => product.id === item?.id)
  return matchedProduct?.image || FALLBACK_IMAGE
}

export default function Wishlist() {
  const { user, addToCart } = useApp()
  const { items: wishlistItems, removeItem } = useWishlist(user)
  const navigate = useNavigate()
  const rawWishlist = typeof window !== 'undefined' ? JSON.parse(window.localStorage.getItem('ntWishlist') || '[]') : []

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [navigate, user])

  useEffect(() => {
    console.log('Wishlist:', wishlistItems)
    console.log('ntWishlist:', rawWishlist)
  }, [wishlistItems, rawWishlist])

  if (!user) return null

  const handleRemove = (item) => {
    removeItem(item.id)
  }

  const handleMoveToCart = (item) => {
    const added = addToCart({
      id: item.id,
      name: item?.name,
      price: item?.price || Number(String(item?.priceLabel).replace(/[^0-9]/g, '')),
      image: resolveProductImage(item),
      quantity: 1,
    })

    if (added) {
      removeItem(item.id)
    }
  }

  return (
    <>
      <style>{`
        .wishlist-page{padding:100px 6%;background:radial-gradient(circle at top,#2b0000,#000);color:#fff;min-height:100vh;}
        .wishlist-title{text-align:center;font-size:42px;color:#d4af37;margin-bottom:60px;font-family:'Playfair Display',serif;}
        .wishlist-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:30px;}
        .wishlist-card{background:#000;border-radius:22px;border:1px solid rgba(212,175,55,0.5);overflow:hidden;transition:all 0.4s ease;display:flex;flex-direction:column;}
        .wishlist-card:hover{transform:translateY(-8px);box-shadow:0 25px 60px rgba(212,175,55,0.25);}
        .wishlist-image{position:relative;}
        .wishlist-image img{width:100%;height:380px;object-fit:cover;display:block;}
        .remove-btn{position:absolute;top:14px;right:14px;width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#d4af37,#b8962e);border:none;font-size:16px;font-weight:bold;color:#000;cursor:pointer;box-shadow:0 8px 20px rgba(212,175,55,0.4);transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;}
        .remove-btn:hover{transform:scale(1.1);box-shadow:0 12px 28px rgba(212,175,55,0.6);color:#000;}
        .wishlist-info{padding:22px 18px 26px;text-align:center;background:#000;}
        .wishlist-info h3{color:#fff;font-weight:600;margin-bottom:6px;}
        .price{color:#d4af37;font-weight:600;}
        .move-btn{background:linear-gradient(135deg,#d4af37,#b8962e);border:none;padding:12px 28px;border-radius:40px;font-weight:600;font-size:14px;cursor:pointer;transition:all 0.3s ease;margin-top:12px;color:#000;}
        .move-btn:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(212,175,55,0.4);}
        .move-btn:active{transform:scale(0.95);}
        .wishlist-empty{min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;margin-top:0;}
        .wishlist-empty h2{margin-bottom:12px;}
        @media (max-width:768px){.wishlist-grid{grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:22px;}.wishlist-image img{height:320px;}}
        @media (max-width:480px){.wishlist-page{padding:80px 5% 60px;}.wishlist-title{font-size:32px;margin-bottom:36px;}.wishlist-grid{grid-template-columns:1fr;}.wishlist-image img{height:340px;}}
      `}</style>
      <section className="wishlist-page">
        <h1 className="wishlist-title">Your Wishlist (<span id="wishlistCount">{wishlistItems.length}</span>)</h1>

        {wishlistItems.length > 0 ? (
          <div className="wishlist-grid" id="wishlistGrid">
            {wishlistItems.map((item) => (
              <div className="wishlist-card active" key={item.id}>
                <div className="wishlist-image">
                  <img src={resolveProductImage(item)} alt={item?.name || 'Wishlist product'} />
                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item)}
                    aria-label={`Remove ${item?.name || 'item'} from wishlist`}
                  >
                    &times;
                  </button>
                </div>

                <div className="wishlist-info">
                  <h3>{item?.name || 'Unnamed Product'}</h3>
                  <p className="price">{formatPrice(item?.price || Number(String(item?.priceLabel).replace(/[^0-9]/g, '')) || 0)}</p>
                  <button className="move-btn" onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="wishlist-empty" id="wishlistEmpty">
            <h2>Your wishlist is empty</h2>
            <p>Save your favorite lehengas here.</p>
            <br />
            <Link to="/" className="hero-btn">Explore Collections</Link>
          </div>
        )}
      </section>
    </>
  )
}
