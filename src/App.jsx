import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedAdminRoute from './admin/components/ProtectedAdminRoute'
import { AdminProviders } from './admin/context/AdminProviders'
import AdminLayout from './admin/layout/AdminLayout'
import AdminLoginPage from './admin/pages/AdminLoginPage'
import DashboardPage from './admin/pages/DashboardPage'
import OrdersPage from './admin/pages/OrdersPage'
import ProductsPage from './admin/pages/ProductsPage'
import ReportsPage from './admin/pages/ReportsPage'
import SubscriptionsPage from './admin/pages/SubscriptionsPage'
import UsersPage from './admin/pages/UsersPage'
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
    <AdminProviders>
      <AppProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="subscriptions" element={<SubscriptionsPage />} />
          </Route>

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
    </AdminProviders>
  )
}
