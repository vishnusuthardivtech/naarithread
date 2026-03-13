import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Collection1 from './pages/Collection1'
import Collection2 from './pages/Collection2'
import Collection3 from './pages/Collection3'
import NewArrival from './pages/NewArrival'
import BestSeller from './pages/BestSeller'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Account from './pages/Account'
import Orders from './pages/Orders'
import AuthChoice from './pages/AuthChoice'
import Login from './pages/Login'
import Register from './pages/Register'
import SearchPage from './pages/SearchPage'
import About from './pages/About'
import Contact from './pages/Contact'
import Faq from './pages/Faq'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'

export default function App() {
  return (
    <AppProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection1" element={<Collection1 />} />
          <Route path="/collection2" element={<Collection2 />} />
          <Route path="/collection3" element={<Collection3 />} />
          <Route path="/new-arrival" element={<NewArrival />} />
          <Route path="/best-seller" element={<BestSeller />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/search" element={<SearchPage />} />
        </Route>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/account" element={<Account />} />
        <Route path="/auth" element={<AuthChoice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  )
}

