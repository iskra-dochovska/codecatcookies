import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cookies from './pages/Cookies'
import Checkout from './pages/Checkout'
import { LanguageProvider } from './i18n/LanguageContext'
import { CartProvider } from './cart/CartContext'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <div className="flex min-h-svh flex-col bg-cookie-cream text-cookie-charcoal">
          <ScrollToTop />
          <Header />

          <main className="flex flex-1 flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </LanguageProvider>
  )
}

export default App
