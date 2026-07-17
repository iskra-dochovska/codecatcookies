import logoText from './assets/brand/codecatcookies_logo_and_text.svg'
import logoTextLight from './assets/brand/codecatcookies_logo_and_text_light.svg'
import cookie from './assets/brand/cookie 5.png'

function App() {
  return (
    <div className="min-h-svh bg-cookie-cream text-cookie-charcoal transition-colors dark:bg-cookie-charcoal dark:text-cookie-cream">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <img src={logoText} alt="CodeCat Cookies" className="h-10 dark:hidden" />
        <img src={logoTextLight} alt="CodeCat Cookies" className="hidden h-10 dark:block" />
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#about" className="hover:underline">About</a>
          <a href="#flavors" className="hover:underline">Flavors</a>
          <a href="#contact" className="hover:underline">Contact</a>
        </nav>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center">
        <img src={cookie} alt="Chocolate chip cookie" className="h-32 w-32 object-contain" />
        <h1 className="font-heading text-4xl font-bold sm:text-5xl">CodeCat Cookies</h1>
        <p className="max-w-xl text-lg text-cookie-brown dark:text-cookie-gold">
          Freshly baked cookies, coded with love. Coming soon.
        </p>
        <a
          href="#contact"
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown"
        >
          Get notified
        </a>
      </main>
    </div>
  )
}

export default App
