import { useState } from 'react'
import { Link } from 'react-router-dom'
import { assetPath, logoPath } from '../data/site'

export default function Footer() {
  const [openSection, setOpenSection] = useState(null)

  const toggleSection = (section) => {
    if (window.innerWidth > 768) {
      return
    }

    setOpenSection((value) => (value === section ? null : section))
  }

  return (
    <div className="luxury-footer">
      <div className="footer-wrapper">
        <div className="footer-brand">
          <img src={logoPath} alt="Naarithread Logo" className="footer-logo" />
          <p className="brand-desc">
            Timeless royal elegance in non-bridal lehengas, crafted for modern women with heritage and grace. <br />
            Mo. No. :- 7990645085 <br />
            Email id:-naarithread@gmail.com
          </p>
          <div className="social-icons">
            <a href="https://www.instagram.com/naarithread.co?igsh=aG11ZWV3ZWtjbnRv" target="_blank" rel="noreferrer"><img src={assetPath('icon/instagram.svg')} /></a>
            <a href="#" target="_blank" rel="noreferrer"><img src={assetPath('icon/facebook-logo.svg')} /></a>
            <a href="https://youtube.com/@naarithread?si=iaUBTbwmyKBUBuQZ" target="_blank" rel="noreferrer"><img src={assetPath('icon/youtube.svg')} /></a>
          </div>
        </div>

        <div className={`footer-links${openSection === 'shop' ? ' active' : ''}`}>
          <h4 onClick={() => toggleSection('shop')}>Shop</h4>
          <Link to="/collection1">Collections</Link>
          <Link to="/new-arrival">New Arrivals</Link>
          <Link to="/best-seller">Best Sellers</Link>
          <Link to="/collection2">Lehengas</Link>
        </div>

        <div className={`footer-links${openSection === 'customer' ? ' active' : ''}`}>
          <h4 onClick={() => toggleSection('customer')}>Customer</h4>
          <Link to="/account">My Account</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/faq">FAQs</Link>
        </div>

        <div className={`footer-links${openSection === 'company' ? ' active' : ''}`}>
          <h4 onClick={() => toggleSection('company')}>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Newsletter Signup</h4>
          <p>Be the first to know about exclusive launches & offers.</p>
          <div className="newsletter-input"><input type="email" placeholder="Your email address" /><button>Subscribe</button></div>
          <div className="payment-icons"><img src={assetPath('icon/visa.svg')} /><img src={assetPath('icon/mastercard.svg')} /><img src={assetPath('icon/google-pay.svg')} /><img src={assetPath('icon/paytm.svg')} /></div>
        </div>
      </div>
      <div className="footer-bottom">&copy; 2026 Naarithread All Right Reserved - Crafted with Royal Elegance</div>
    </div>
  )
}
