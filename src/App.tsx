import { useState } from 'react'
import textLogoLight from './assets/brand/codecatcookies_text_light.svg'
import logoMark from './assets/brand/codecatcookies_logo.svg'
import cookiesHero from './assets/brand/cookies_hero.jpg'
import NotifyModal from './components/NotifyModal'

function App() {
  const [notifyOpen, setNotifyOpen] = useState(false)

  return (
    <div className="flex min-h-svh flex-col bg-cookie-cream text-cookie-charcoal">
      <header className="w-full bg-cookie-brown px-4 py-6">
        <img src={textLogoLight} alt="codecatcookies" className="h-8" />
      </header>

      <section className="relative min-h-[60vh] w-full overflow-hidden">
        <img
          src={cookiesHero}
          alt="codecatcookies assortment"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 px-6 text-center">
          <img src={logoMark} alt="codecatcookies" className="h-40 sm:h-64" />
          <span className="rounded-full bg-cookie-rust px-4 py-1.5 text-sm font-semibold tracking-widest text-cookie-cream uppercase">
            Coming soon
          </span>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
        <p className="max-w-xl text-lg font-bold uppercase text-cookie-brown">
          The only cookies you want to accept.
        </p>
        <button
          type="button"
          onClick={() => setNotifyOpen(true)}
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown"
        >
          Get notified
        </button>
      </section>

      <footer className="w-full bg-cookie-brown px-6 py-6 text-sm text-cookie-cream">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4">
          <a
            href="https://www.instagram.com/codecatcookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            codecatcookies
          </a>
          <span className="text-cookie-cream/70">
            &copy; {new Date().getFullYear()} codecatcookies. All rights reserved.
          </span>
        </div>
      </footer>

      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} />
    </div>
  )
}

export default App
