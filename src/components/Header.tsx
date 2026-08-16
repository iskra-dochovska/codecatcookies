import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import textLogo from '../assets/codecatcookies_text_light.svg'
import logoMark from '../assets/codecatcookies_logo.svg'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'
import { useCart } from '../cart/CartContext'
import { CartDrawer } from './CartDrawer'

function CartButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open cart"
      className="relative text-cookie-cream"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-cookie-rust text-[10px] font-bold text-cookie-cream">
          {count}
        </span>
      )}
    </button>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { lang, toggleLang } = useLanguage()
  const { totalCount } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-cookie-brown transition-colors duration-300 ${
        scrolled ? 'sm:bg-cookie-brown/80 sm:backdrop-blur-md' : ''
      }`}
    >
      <div className="flex items-center justify-between px-10 py-4 sm:px-32">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src={logoMark} alt="codecatcookies" className="h-9 sm:hidden" />
          <img src={textLogo} alt="codecatcookies" className="hidden h-5 sm:block" />
        </Link>

        <nav className="hidden items-center gap-3 sm:flex">
          <Link
            to="/cookies"
            className="rounded-full bg-cookie-cream px-4 py-1.5 text-sm font-extrabold text-cookie-charcoal uppercase transition-transform hover:-translate-y-0.5"
          >
            {t(ui, 'navCookies', lang)}
          </Link>
          <CartButton count={totalCount} onClick={() => setCartOpen(true)} />
          <button
            type="button"
            onClick={toggleLang}
            className="rounded-full border border-cookie-cream px-4 py-1.5 text-sm font-extrabold text-cookie-cream uppercase transition-colors hover:bg-cookie-cream hover:text-cookie-charcoal"
          >
            {lang === 'en' ? 'MK' : 'ENG'}
          </button>
        </nav>

        <div className="flex items-center gap-4 sm:hidden">
          <CartButton count={totalCount} onClick={() => setCartOpen(true)} />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="text-cookie-cream"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 sm:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          className={`absolute top-0 right-0 flex h-full w-64 max-w-[80%] flex-col gap-8 bg-cookie-brown px-8 py-8 shadow-xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="self-end text-cookie-cream"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <nav className="flex flex-col gap-3">
            <NavLink
              to="/"
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-6 py-3 text-center text-lg font-semibold uppercase transition-colors ${
                  isActive
                    ? 'bg-cookie-cream text-cookie-charcoal'
                    : 'bg-cookie-cream/10 text-cookie-cream hover:bg-cookie-cream/20'
                }`
              }
            >
              {t(ui, 'navHome', lang)}
            </NavLink>
            <NavLink
              to="/cookies"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-full px-6 py-3 text-center text-lg font-semibold uppercase transition-colors ${
                  isActive
                    ? 'bg-cookie-cream text-cookie-charcoal'
                    : 'bg-cookie-cream/10 text-cookie-cream hover:bg-cookie-cream/20'
                }`
              }
            >
              {t(ui, 'navCookies', lang)}
            </NavLink>
          </nav>

          <button
            type="button"
            onClick={toggleLang}
            className="mt-auto rounded-full border border-cookie-cream px-6 py-3 text-center text-lg font-semibold text-cookie-cream uppercase transition-colors hover:bg-cookie-cream hover:text-cookie-charcoal"
          >
            {lang === 'en' ? 'MK' : 'ENG'}
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}

export default Header
