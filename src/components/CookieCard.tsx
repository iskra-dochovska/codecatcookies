import { FramedSection } from './CookieDecor'
import type { Cookie } from '../data/cookies'

export function CookieCard({ cookie }: { cookie: Cookie }) {
  const hasDetails = Boolean(cookie.nutrition || cookie.allergens)

  return (
    <FramedSection id={cookie.slug} className="flex flex-col gap-6 scroll-mt-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="w-48 flex-none overflow-hidden rounded-2xl border-[3px] border-cookie-charcoal sm:w-56">
          <img src={cookie.image} alt={cookie.name} className="w-full object-cover" />
        </div>
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <h2 className="text-2xl font-black text-cookie-brown uppercase">{cookie.name}</h2>
          <span className="mx-auto rounded-full border border-dashed border-cookie-rust bg-cookie-rust/10 px-3 py-1 font-mono text-xs text-cookie-rust sm:mx-0">
            {cookie.tagline}
          </span>
          {cookie.scales && <ScaleList scales={cookie.scales} className="mt-2" />}
        </div>
      </div>

      {hasDetails && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full border-2 border-cookie-charcoal bg-cookie-rust px-4 py-2 text-sm font-bold text-cookie-cream shadow-[3px_3px_0_var(--color-cookie-charcoal)] [&::-webkit-details-marker]:hidden">
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

function ScaleList({
  scales,
  className,
}: {
  scales: NonNullable<Cookie['scales']>
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {scales.map((scale) => {
        const filled = Math.round(scale.value)
        return (
          <div key={scale.label} className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-xs font-bold text-cookie-brown uppercase">{scale.label}</span>
            <div className="flex h-3.5 w-40 gap-0.5 rounded-full border-2 border-cookie-charcoal p-0.5 sm:w-52">
              {[1, 2, 3, 4, 5].map((segment) => (
                <span
                  key={segment}
                  className={`flex-1 rounded-full ${
                    segment <= filled ? 'bg-cookie-rust' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function NutritionTable({ facts }: { facts: NonNullable<Cookie['nutrition']> }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-black text-cookie-brown uppercase">
        Nutrition
        <span className="ml-2 font-mono text-sm font-normal text-cookie-charcoal/60 normal-case">
          per cookie
        </span>
      </h3>
      <dl className="flex flex-col gap-1 rounded-xl border-2 border-dashed border-cookie-charcoal/40 bg-cookie-cream/40 px-4 py-3 font-mono text-sm">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={`flex items-center justify-between ${
              fact.indent ? 'pl-4 text-cookie-charcoal/70' : 'font-bold text-cookie-brown'
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
      <h3 className="mb-3 text-lg font-black text-cookie-brown uppercase">Allergens</h3>
      <div className="flex flex-wrap gap-2">
        {allergens.contains.map((allergen) => (
          <span
            key={allergen}
            className="rounded-full border-2 border-cookie-charcoal bg-cookie-rust px-3 py-1 text-sm font-bold text-cookie-cream"
          >
            {allergen}
          </span>
        ))}
        {allergens.mayContain?.map((allergen) => (
          <span
            key={allergen}
            className="rounded-full border-2 border-dashed border-cookie-rust px-3 py-1 text-sm font-bold text-cookie-rust"
          >
            May contain: {allergen}
          </span>
        ))}
      </div>
    </div>
  )
}
