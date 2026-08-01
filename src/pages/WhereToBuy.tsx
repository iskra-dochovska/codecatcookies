import { FramedSection } from '../components/CookieDecor'
import { shops } from '../data/shops'

function WhereToBuy() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-black text-cookie-brown uppercase sm:text-4xl">
          Where to buy
        </h1>
        <p className="mt-3 text-lg text-cookie-brown/80">
          Find codecatcookies at these local spots around Skopje
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border-[3px] border-cookie-ink bg-white px-5 py-4 text-cookie-brown">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 flex-none"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        <p className="text-sm font-bold">
          Exact addresses and opening hours are coming soon, check back shortly!
        </p>
      </div>

      <FramedSection className="flex flex-col gap-4">
        {shops.map((shop) => (
          <div
            key={shop.name}
            className="flex items-center justify-between gap-4 rounded-xl border-2 border-cookie-ink bg-cookie-cream px-5 py-4"
          >
            <div>
              <p className="font-black text-cookie-brown uppercase">{shop.name}</p>
              <p className="font-mono text-sm text-cookie-charcoal">{shop.area}</p>
            </div>
            <span className="rounded-full border-2 border-cookie-ink bg-cookie-rust px-3 py-1 font-mono text-xs font-bold tracking-wide text-cookie-cream uppercase">
              {shop.tag}
            </span>
          </div>
        ))}
      </FramedSection>

      <FramedSection className="flex flex-col gap-3 text-center">
        <h2 className="text-xl font-black text-cookie-brown uppercase">
          Want to stock codecatcookies?
        </h2>
        <p className="text-cookie-charcoal">
          If you run a coffee shop or store and want to carry our cookies, reach out to
          us on Instagram, we&apos;d love to hear from you!
        </p>
        <a
          href="https://www.instagram.com/codecatcookies/"
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto rounded-full border-2 border-cookie-ink bg-cookie-rust px-6 py-3 text-sm font-black text-cookie-cream uppercase shadow-[4px_4px_0_var(--color-cookie-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-cookie-ink)]"
        >
          Get in touch
        </a>
      </FramedSection>
    </section>
  )
}

export default WhereToBuy
