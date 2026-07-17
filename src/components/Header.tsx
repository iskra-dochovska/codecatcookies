import { useState } from 'react'
import { Link } from 'react-router-dom'
import textLogo from '../assets/codecatcookies_text.svg'
import logoMark from '../assets/codecatcookies_logo.svg'

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-cookie-brown">
      <div className="flex items-center justify-between px-8 py-4 sm:px-20">
        <Link to="/" onClick={() => setOpen(false)}>
          <img src={logoMark} alt="codecatcookies" className="h-9 sm:hidden" />
          <img src={textLogo} alt="codecatcookies" className="hidden h-5 sm:block" />
        </Link>

        <nav className="hidden sm:block">
          <Link
            to="/about"
            className="rounded-full bg-cookie-cream px-4 py-1.5 text-sm font-semibold text-cookie-brown hover:bg-cookie-cream/80"
          >
            About us
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="text-cookie-cream sm:hidden"
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

          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="text-lg font-semibold text-cookie-cream/60"
          >
            About us
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
