import textLogoLight from './assets/brand/codecatcookies_text_light.svg'
import cookiesHero from './assets/brand/cookies_hero.jpg'

function App() {
  return (
    <div className="flex min-h-svh flex-col bg-cookie-cream text-cookie-charcoal transition-colors dark:bg-cookie-charcoal dark:text-cookie-cream">
      <main className="relative min-h-[70vh] flex-1 overflow-hidden">
        <img
          src={cookiesHero}
          alt="Assortment of CodeCat cookies"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 px-6 text-center">
          <img src={textLogoLight} alt="CodeCat Cookies" className="h-10 sm:h-14" />
          <span className="text-sm font-semibold tracking-widest text-cookie-cream uppercase">
            Coming soon
          </span>
        </div>
      </main>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-16 text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">CodeCat Cookies</h1>
        <p className="max-w-xl text-lg text-cookie-brown dark:text-cookie-gold">
          The only cookies you want to accept.
        </p>
        <a
          href="#contact"
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown"
        >
          Get notified
        </a>
      </section>

      <footer className="mx-auto flex w-full max-w-5xl items-center justify-center px-6 py-6 text-sm">
        <a
          href="https://www.instagram.com/codecatcookies/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          @codecatcookies
        </a>
      </footer>
    </div>
  )
}

export default App
