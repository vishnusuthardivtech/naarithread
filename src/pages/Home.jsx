import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { heroSlides, signatureProducts, assetPath } from '../data/site'
import { productsByPage } from '../data/products'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((value) => (value + 1) % heroSlides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [])

  const bestSellerSlider = [...productsByPage.homeBestSellers, ...productsByPage.homeBestSellers]
  const mobileBestSellerProducts = productsByPage.homeBestSellers || []
  const mobileBestSellerSlider = [...mobileBestSellerProducts, ...mobileBestSellerProducts]

  return (
    <>
      <style>{`
        .best-seller-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .best-seller-desktop {
            display: none;
          }

          .best-seller-mobile {
            display: block;
          }

          .best-seller-mobile .slider-wrapper {
            overflow: hidden !important;
            padding: 18px 0 22px !important;
          }

          .best-seller-mobile .slider-track {
            display: flex !important;
            align-items: stretch !important;
            gap: 20px !important;
            width: max-content;
            animation: infiniteScroll 20s linear infinite !important;
            will-change: transform;
          }

          .best-seller-mobile .slide-item {
            flex: 0 0 280px;
            width: 280px;
            min-width: 280px;
            max-width: 280px;
          }

          .best-seller-mobile .slide-item .product-card {
            width: 100% !important;
            min-width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            transform: none !important;
          }

          .best-seller-mobile .slide-item .product-image {
            height: 320px !important;
          }

          .best-seller-mobile .slide-item .product-info {
            min-height: 86px !important;
            padding: 12px 14px 14px !important;
          }
        }
      `}</style>

      <section className="hero-slider">
        <div className="container">
          {heroSlides.map((slide, index) => (
            <div key={slide.image} className={`slide${index === currentSlide ? ' active' : ''}`} style={{ backgroundImage: `url('${assetPath(slide.image)}')` }}>
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
                <Link to={slide.link} className="hero-btn">{slide.cta}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="signature-section">
        <div className="section-header">
          <h2>Signature Lehengas</h2>
          <p>Curated non-bridal styles for every occasion</p>
        </div>
        <div className="lehenga-grid">
          {signatureProducts.map((item) => (
            <div className="product-card reveal" key={item.title}>
              <div className="product-image"><img src={assetPath(item.image)} alt={item.title} /></div>
              <div className="product-info"><h3>{item.title}</h3><span>{item.subtitle}</span></div>

            </div>
          ))}
        </div>
      </section>

      <section className="featured-lehengas">
        <div className="container">
          <div className="featured-container">
            <h2 className="section-title">Featured Lehengas</h2>
            <p className="section-subtitle">Handpicked styles for modern elegance</p>
            <div className="lehenga-grid products-grid">{productsByPage.homeFeatured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          </div>
        </div>
      </section>

      <section className="best-seller-section">
        <div className="container">
          <h2 className="section-title">Best Sellers</h2>
          <div className="best-seller-desktop">
            <div className="slider-wrapper">
              <div className="slider-track" id="bestSellerTrack">
                {bestSellerSlider.map((product, index) => <ProductCard key={`${product.id}-${index}`} product={product} />)}
              </div>
            </div>
          </div>
          <div className="best-seller-mobile">
            <div className="slider-wrapper">
              <div className="slider-track">
                {mobileBestSellerSlider.map((product, index) => (
                  <div className="slide-item" key={`mobile-${product.id}-${index}`}>
                    <ProductCard product={product} className="product-card no-reveal" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="craftsmanship">
        <div className="container">
          <div className="craftsmanship-container">
            <h2 className="craftsmanship-title">Our Craftsmanship Promise</h2>
            <p className="craftsmanship-subtitle">Where tradition meets modern elegance</p>
            <div className="promise-grid">
              <div className="promise-card"><div className="promise-icon">A</div><h3>Handcrafted Excellence</h3><p>Every lehenga is carefully handcrafted by skilled artisans with attention to the smallest details.</p></div>
              <div className="promise-card"><div className="promise-icon">F</div><h3>Premium Fabrics</h3><p>We use only high-quality fabrics that feel luxurious, breathable, and comfortable for all occasions.</p></div>
              <div className="promise-card"><div className="promise-icon">M</div><h3>Modern Non-Bridal Designs</h3><p>Designed for today�s women who love elegance without heavy bridal looks.</p></div>
              <div className="promise-card"><div className="promise-icon">IN</div><h3>Proudly Made in India</h3><p>Designed and crafted in Surat, celebrating Indian heritage with a modern touch.</p></div>
            </div>
          </div>
          <br />
          <section className="craft-promise">
            <div className="craft-container">
              <div className="craft-item"><div className="craft-icon">S</div><h4>Free Shipping</h4><p>Free shipping on all orders in India</p></div>
              <div className="craft-item"><div className="craft-icon">E</div><h4>Easy Exchange</h4><p>2 days easy exchange available</p></div>
              <div className="craft-item"><div className="craft-icon">C</div><h4>Customer Support</h4><p>Mon-Sat | 11 AM - 6 PM</p></div>
              <div className="craft-item"><div className="craft-icon">P</div><h4>Secure Payment</h4><p>128-bit SSL secure checkout</p></div>
            </div>
          </section>
        </div>
      </section>

      <section className="why-naarithread">
        <div className="container">
          <div className="why-container">
            <h2 className="section-title">Why Naarithread?</h2>
            <p className="section-subtitle">Crafted for modern celebrations with timeless elegance</p>
            <div className="why-grid">
              <div className="why-card"><span className="why-icon">F</span><h3>Premium Fabrics</h3><p>Carefully sourced fabrics for unmatched comfort & elegance.</p></div>
              <div className="why-card"><span className="why-icon">H</span><h3>Handcrafted Designs</h3><p>Every lehenga is detailed by skilled artisans.</p></div>
              <div className="why-card"><span className="why-icon">P</span><h3>Perfect Fit</h3><p>Designed to flatter modern silhouettes beautifully.</p></div>
              <div className="why-card"><span className="why-icon">Q</span><h3>Quality Checked</h3><p>Each piece is inspected to meet luxury standards.</p></div>
              <div className="why-card"><span className="why-icon">S</span><h3>Made in Surat</h3><p>Authentic craftsmanship from India�s textile capital.</p></div>
              <div className="why-card"><span className="why-icon">U</span><h3>Personal Support</h3><p>Dedicated assistance before and after purchase.</p></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
