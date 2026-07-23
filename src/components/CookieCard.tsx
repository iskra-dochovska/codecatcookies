import { FramedSection } from './CookieDecor'
import type { Cookie } from '../data/cookies'

export function CookieCard({ cookie }: { cookie: Cookie }) {
  const hasDetails = Boolean(cookie.nutrition || cookie.allergens)

  return (
    <FramedSection id={cookie.slug} className="flex flex-col gap-6 scroll-mt-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="w-48 flex-none overflow-hidden rounded-2xl sm:w-56">
          <img src={cookie.image} alt={cookie.name} className="w-full object-cover" />
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

      {hasDetails && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full bg-cookie-rust px-4 py-2 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown [&::-webkit-details-marker]:hidden">
            Nutrition & allergens
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
            {cookie.nutrition && <NutritionTable facts={cookie.nutrition} />}
            {cookie.allergens && <AllergensList allergens={cookie.allergens} />}
          </div>
        </details>
      )}
    </FramedSection>
  )
}

function NutritionTable({ facts }: { facts: NonNullable<Cookie['nutrition']> }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold text-cookie-brown">
        Nutrition
        <span className="ml-2 text-sm font-normal text-cookie-charcoal/60">per cookie</span>
      </h3>
      <dl className="divide-y divide-cookie-honey/40 rounded-xl border border-cookie-honey/40">
        {facts.map((fact) => (
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
      <p className="mt-2 text-xs text-cookie-charcoal/60">
        Values are rough estimates, not exact calculations.
      </p>
    </div>
  )
}

function AllergensList({ allergens }: { allergens: NonNullable<Cookie['allergens']> }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-bold text-cookie-brown">Allergens</h3>
      <div className="flex flex-wrap gap-2">
        {allergens.contains.map((allergen) => (
          <span
            key={allergen}
            className="rounded-full bg-cookie-rust px-3 py-1 text-sm font-semibold text-cookie-cream"
          >
            {allergen}
          </span>
        ))}
        {allergens.mayContain?.map((allergen) => (
          <span
            key={allergen}
            className="rounded-full border border-cookie-rust/50 px-3 py-1 text-sm font-semibold text-cookie-rust"
          >
            May contain: {allergen}
          </span>
        ))}
      </div>
    </div>
  )
}
