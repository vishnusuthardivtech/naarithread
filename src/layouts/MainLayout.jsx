import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import AuthModal from '../components/AuthModal'
import Footer from '../components/Footer'
import MobileMenu from '../components/MobileMenu'
import Navbar from '../components/Navbar'
import SearchPanel from '../components/SearchPanel'
import { useApp } from '../context/AppContext'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'

export default function MainLayout() {
  const location = useLocation()
  const { clearSearch, setLastBrowsePath, filterVersion } = useApp()
  const [searchOpen, setSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCollectionMenuOpen, setIsCollectionMenuOpen] = useState(false)

  const closeAllMenus = () => {
    setSearchOpen(false)
    setIsMobileMenuOpen(false)
    setIsCollectionMenuOpen(false)
    document.getElementById('userDropdown')?.classList.remove('show')
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
        setIsCollectionMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    closeAllMenus()
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    if (location.pathname !== '/search') {
      setLastBrowsePath(`${location.pathname}${location.search}`)
      clearSearch()
    }
  }, [location.pathname, location.search, clearSearch, setLastBrowsePath])

  useEffect(() => {
    const handleClick = (event) => {
      if (!event.target.closest('#navSearchPanel') && !event.target.closest('#searchTrigger')) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useRevealOnScroll([location.search, filterVersion])

  return (
    <div className="page-load">
      <Navbar
        onSearchOpen={() => setSearchOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isCollectionMenuOpen={isCollectionMenuOpen}
        setIsCollectionMenuOpen={setIsCollectionMenuOpen}
      />
      <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
      <Outlet />
      <Footer key={location.pathname} />
      <MobileMenu open={isCollectionMenuOpen} onClose={() => setIsCollectionMenuOpen(false)} />
      <AuthModal />
      <div id="cartToast" className="cart-toast">Item added to cart</div>
    </div>
  )
}
