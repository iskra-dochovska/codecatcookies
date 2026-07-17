import textLogo from './assets/brand/codecatcookies_text.svg'
import textLogoLight from './assets/brand/codecatcookies_text_light.svg'
import cookie from './assets/brand/cookie 5.png'

function App() {
  return (
    <div className="flex min-h-svh flex-col bg-cookie-cream text-cookie-charcoal transition-colors dark:bg-cookie-charcoal dark:text-cookie-cream">
      <header className="mx-auto w-full max-w-5xl px-6 py-6">
        <img src={textLogo} alt="CodeCat Cookies" className="h-8 dark:hidden" />
        <img src={textLogoLight} alt="CodeCat Cookies" className="hidden h-8 dark:block" />
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-6 px-6 py-20 text-center">
        <img src={cookie} alt="Chocolate chip cookie" className="h-32 w-32 object-contain" />
        <h1 className="font-heading text-4xl font-bold sm:text-5xl">CodeCat Cookies</h1>
        <p className="max-w-xl text-lg text-cookie-brown dark:text-cookie-gold">
          The only cookies you want to accept.
        </p>
        <a
          href="#contact"
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown"
        >
          Get notified
        </a>
      </main>

      <footer className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 text-sm">
        <a
          href="https://www.instagram.com/codecatcookies/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          @codecatcookies
        </a>
        <span>Coming soon</span>
      </footer>
    </div>
  )
}

export default App
