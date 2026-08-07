import { useState } from 'react'
import { Link } from 'react-router-dom'
import sushi from '../assets/sushi.png'
import { cookies } from '../data/cookies'
import { shops } from '../data/shops'
import logoMark from '../assets/codecatcookies_logo.svg'
import { useLanguage } from '../i18n/LanguageContext'
import { ui, faqs } from '../i18n/translations'

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { lang } = useLanguage()
  const t = ui[lang]

  return (
    <>
      <section className="bg-cookie-brown px-6 py-16 sm:py-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <img src={logoMark} alt="codecatcookies" className="w-28 sm:w-32" />
            <h1 className="text-5xl leading-[0.95] font-black text-balance text-cookie-cream uppercase sm:text-6xl">
              {t.hero.before}
              <span className="text-cookie-honey">{t.hero.highlight}</span>
              {t.hero.after}
            </h1>
            <span className="rounded-lg border-2 border-cookie-honey px-4 py-1.5 font-mono text-sm font-bold tracking-widest text-cookie-honey uppercase">
              {t.hero.badge}
            </span>
          </div>
          <div className="flex h-64 w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-cookie-cream/40 text-sm text-cookie-cream/50 sm:h-80">
            {t.hero.imagePlaceholder}
          </div>
        </div>
      </section>

      <section className="w-full bg-cookie-cream px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
          {cookies.slice(0, 3).map((cookie, index) => (
            <Link
              key={cookie.slug}
              to={`/cookies#${cookie.slug}`}
              className={`flex w-full flex-col items-center gap-6 rounded-2xl bg-cookie-honey p-6 sm:flex-row sm:items-start ${
                index % 2 === 1 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              <div className="flex h-40 w-full flex-none items-center justify-center rounded-xl border-2 border-dashed border-cookie-charcoal/40 text-sm text-cookie-charcoal/50 sm:w-56">
                {t.cookiesPreview.imagePlaceholder}
              </div>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h3 className="text-xl font-black text-cookie-brown uppercase">
                  {lang === 'en' && cookie.slug === 'double-chocolate-peanut-butter' ? (
                    <>
                      Double chocolate
                      <br />
                      peanut butter
                    </>
                  ) : (
                    cookie.name[lang]
                  )}
                </h3>
                <span className="mx-auto w-56 rounded-full border border-cookie-rust bg-cookie-cream px-3 py-1 text-center font-mono text-xs font-bold text-cookie-rust sm:mx-0">
                  {cookie.tagline[lang]}
                </span>
              </div>
            </Link>
          ))}
          <Link
            to="/cookies"
            className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-black text-cookie-cream uppercase transition-transform hover:-translate-y-0.5"
          >
            {t.cookiesPreview.seeAll}
          </Link>
        </div>
      </section>

      <section className="w-full bg-cookie-brown px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-6 sm:flex-row sm:items-start sm:gap-10 sm:p-8">
            <div className="w-48 flex-none sm:w-56">
              <img
                src={sushi}
                alt="Sushi, the Siamese cat behind codecatcookies"
                className="w-full rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-4 text-center sm:pt-4 sm:text-left">
              <h2 className="text-xl font-black text-cookie-brown uppercase">
                {t.catStory.heading}
              </h2>
              <p className="text-cookie-charcoal">{t.catStory.paragraph}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full min-h-[22rem] items-center bg-cookie-cream px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
            {t.locations.heading}
          </h2>
          <p className="max-w-lg text-cookie-charcoal">{t.locations.paragraph}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {shops.map((shop) => (
              <span
                key={shop.name}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-cookie-brown uppercase"
              >
                {shop.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-cookie-rust px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-cream uppercase sm:text-3xl">
            {t.follow.heading}
          </h2>
          <p className="max-w-2xl text-cookie-cream/90">{t.follow.paragraph}</p>
          <img src={logoMark} alt="codecatcookies" className="w-36" />
          <a
            href="https://www.instagram.com/codecatcookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-cookie-cream px-6 py-3 text-sm font-black text-cookie-brown uppercase transition-transform hover:-translate-y-0.5"
          >
            {t.follow.button}
          </a>
        </div>
      </section>

      <section className="w-full bg-cookie-brown px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-black text-cookie-cream uppercase sm:text-3xl">
            {t.faqSection.heading}
          </h2>
          <div className="flex flex-col gap-6">
            {faqs[lang].map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setOpenFaq(isOpen ? null : index)
                    }
                  }}
                  className="cursor-pointer rounded-2xl bg-white px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-3 font-bold text-cookie-brown">
                    {faq.question}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 flex-none transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {isOpen && (
                    <p className="mt-3 border-t-2 border-dashed border-cookie-charcoal/30 pt-3 text-cookie-charcoal">
                      {faq.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
