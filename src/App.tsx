import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cookies from './pages/Cookies'
import Checkout from './pages/Checkout'
import Admin from './pages/admin/Admin'
import { LanguageProvider } from './i18n/LanguageContext'
import { CartProvider } from './cart/CartContext'
import { CookiesProvider } from './data/CookiesContext'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <LanguageProvider>
      <CookiesProvider>
        <CartProvider>
          <div className="flex min-h-svh flex-col bg-cookie-cream text-cookie-charcoal">
            <ScrollToTop />
            {!isAdminRoute && <Header />}

            <main className="flex flex-1 flex-col">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>

            {!isAdminRoute && <Footer />}
          </div>
        </CartProvider>
      </CookiesProvider>
    </LanguageProvider>
  )
}

export default App
