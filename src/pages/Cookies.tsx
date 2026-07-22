import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { FramedSection } from '../components/CookieDecor'
import { cookies } from '../data/cookies'

function Cookies() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const card = document.getElementById(hash.slice(1))
    if (!card) return
    card.scrollIntoView({ behavior: 'smooth', block: 'start' })
    const details = card.querySelector('details')
    if (details) details.open = true
  }, [hash])

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-cookie-brown sm:text-4xl">
          Our cookies
        </h1>
        <p className="mt-3 text-lg text-cookie-brown/80">
          Nutrition, allergens and pairings for every flavor we bake
        </p>
      </div>

      {cookies.map((cookie) => (
        <FramedSection
          key={cookie.slug}
          id={cookie.slug}
          className="flex flex-col gap-6 scroll-mt-6"
        >
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
            <div className="w-48 flex-none overflow-hidden rounded-2xl sm:w-56">
              <img
                src={cookie.image}
                alt={cookie.name}
                className="w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-cookie-brown">{cookie.name}</h2>
              <p className="text-sm font-semibold uppercase tracking-wide text-cookie-rust">
                {cookie.tagline}
              </p>
              {cookie.description && (
                <p className="text-cookie-charcoal">{cookie.description}</p>
              )}
            </div>
          </div>

          {cookie.nutrition && cookie.allergens && cookie.pairings && (
            <details className="group">
              <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full bg-cookie-rust px-4 py-2 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown [&::-webkit-details-marker]:hidden">
                Nutrition, allergens & pairings
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>

              <div className="flex flex-col gap-8 pt-6">
                <div>
                  <h3 className="mb-3 text-lg font-bold text-cookie-brown">
                    Nutrition
                    <span className="ml-2 text-sm font-normal text-cookie-charcoal/60">per cookie</span>
                  </h3>
                  <dl className="divide-y divide-cookie-honey/40 rounded-xl border border-cookie-honey/40">
                    {cookie.nutrition.map((fact) => (
                      <div
                        key={fact.label}
                        className={`flex items-center justify-between px-4 py-2 ${
                          fact.indent
                            ? 'bg-white pl-8 text-sm text-cookie-charcoal/80'
                            : 'bg-cookie-honey/15 font-semibold text-cookie-brown'
                        }`}
                      >
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold text-cookie-brown">Allergens</h3>
                  <div className="flex flex-wrap gap-2">
                    {cookie.allergens.contains.map((allergen) => (
                      <span
                        key={allergen}
                        className="rounded-full bg-cookie-rust px-3 py-1 text-sm font-semibold text-cookie-cream"
                      >
                        {allergen}
                      </span>
                    ))}
                    {cookie.allergens.mayContain?.map((allergen) => (
                      <span
                        key={allergen}
                        className="rounded-full border border-cookie-rust/50 px-3 py-1 text-sm font-semibold text-cookie-rust"
                      >
                        May contain: {allergen}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-bold text-cookie-brown">Pairs well with</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {cookie.pairings.map((pairing) => (
                      <div
                        key={pairing.name}
                        className="rounded-xl bg-cookie-cream p-4"
                      >
                        <span className="text-xs font-bold tracking-wide text-cookie-rust uppercase">
                          {pairing.type}
                        </span>
                        <p className="font-semibold text-cookie-brown">{pairing.name}</p>
                        <p className="text-sm text-cookie-charcoal">{pairing.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </details>
          )}
        </FramedSection>
      ))}
    </section>
  )
}

export default Cookies
