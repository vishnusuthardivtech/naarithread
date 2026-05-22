import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { logoPath } from '../data/site'
import CartBadge from './CartBadge'
import MegaMenu from './MegaMenu'

export default function Navbar({ onSearchOpen, isMobileMenuOpen, setIsMobileMenuOpen, isCollectionMenuOpen, setIsCollectionMenuOpen }) {
  const { user, logout, cartCount, wishlistCount, clearSearch, lastBrowsePath } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)

  const closeAllMenus = () => {
    setIsMegaMenuOpen(false)
    setIsMobileMenuOpen(false)
    setIsCollectionMenuOpen(false)
    document.getElementById('userDropdown')?.classList.remove('show')
  }

  useEffect(() => {
    closeAllMenus()
  }, [location.pathname])

  const goToLoginIfNeeded = () => {
    if (user) {
      document.getElementById('userDropdown')?.classList.toggle('show')
      return
    }

    closeAllMenus()
    navigate('/auth')
  }

  return (
    <header className="navbar" id="navbar">
      <div className="logo">
        <img src={logoPath} alt="Naarithread" />
      </div>

      <nav className={`nav-links${isMobileMenuOpen ? ' show' : ''}`} id="navLinks">
        <NavLink to="/" onClick={closeAllMenus}>Home</NavLink>

        <div
          className="nav-item mega-dropdown"
          onMouseEnter={() => {
            if (window.innerWidth >= 769) {
              setIsMegaMenuOpen(true)
            }
          }}
          onMouseLeave={() => {
            if (window.innerWidth >= 769) {
              setIsMegaMenuOpen(false)
            }
          }}
        >
          <a
            href="#"
            className="nav-link collections-trigger"
            onClick={(event) => {
              if (window.innerWidth < 769) {
                event.preventDefault()
                setIsCollectionMenuOpen(true)
                return
              }

              event.preventDefault()
              setIsMegaMenuOpen((value) => !value)
            }}
          >
            Collections
          </a>
          <MegaMenu onNavigate={closeAllMenus} isOpen={isMegaMenuOpen} />
        </div>

        <NavLink to="/new-arrival" onClick={closeAllMenus}>New Arrival</NavLink>
        <NavLink to="/best-seller" onClick={closeAllMenus}>Best Seller </NavLink>
        <NavLink to="/about" onClick={closeAllMenus}>About</NavLink>
        <NavLink to="/contact" onClick={closeAllMenus}>Contact</NavLink>
        <NavLink to="/shop" onClick={closeAllMenus}>SHOP</NavLink>
      </nav>

      <div className="nav-icons">
        <div
          className="icon-wrapper search-trigger"
          id="searchTrigger"
          onClick={() => {
            if (location.pathname === '/search') {
              clearSearch()
              navigate(lastBrowsePath || '/')
              return
            }

            onSearchOpen()
          }}
        >
          <svg className="icon" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div className="user-menu" id="userMenu">
          <div className="user-trigger" id="userTrigger" onClick={goToLoginIfNeeded}>
            <svg className="icon" viewBox="0 0 24 24">
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
            </svg>
            <span id="userNameDisplay">{user ? user.name : ''}</span>
          </div>

          <div className="user-dropdown" id="userDropdown">
            <Link to="/orders" onClick={closeAllMenus}>My Orders</Link>
            <Link to="/account" onClick={closeAllMenus}>My Account</Link>
            <button id="logoutBtn" onClick={() => { logout(); closeAllMenus() }}>Logout</button>
          </div>
        </div>

        <Link to="/wishlist" className="icon-wrapper cart-link" onClick={closeAllMenus}>
          <div className="icon-wrapper">
            <svg className="icon" viewBox="0 0 24 24">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            <span className="badge pulse wishlist-badge">{wishlistCount}</span>
          </div>
        </Link>

        <Link to="/cart" className="icon-wrapper cart-link" onClick={closeAllMenus}>
          <div className="icon-wrapper">
            <svg className="icon" viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.6 13h11.8l2-8H6" />
            </svg>
            <CartBadge count={cartCount} className="badge pulse cart-badge" />
          </div>
        </Link>

        <div
          className={`hamburger${isMobileMenuOpen ? ' active' : ''}`}
          id="hamburger"
          onClick={() => {
            setIsMegaMenuOpen(false)
            setIsCollectionMenuOpen(false)
            setIsMobileMenuOpen((value) => !value)
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  )
}
