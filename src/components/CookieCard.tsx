import { FramedSection } from './CookieDecor'
import type { Cookie } from '../data/cookies'
import { allergenColors, defaultAllergenColor } from '../data/allergens'
import { useLanguage, type Lang } from '../i18n/LanguageContext'
import { allergenLabels, nutritionLabels, nutritionValues, scaleLabels, t, ui } from '../i18n/translations'

export function CookieCard({ cookie }: { cookie: Cookie }) {
  const { lang } = useLanguage()
  const hasDetails = Boolean(cookie.nutrition || cookie.allergens)

  return (
    <FramedSection id={cookie.slug} className="flex flex-col gap-6 scroll-mt-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-8">
        <div className="flex h-48 w-48 flex-none items-center justify-center rounded-2xl bg-cookie-charcoal/5 text-sm text-cookie-charcoal/50 sm:w-56">
          Image
        </div>
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <h2 className="text-2xl font-black text-cookie-brown uppercase">
            {cookie.slug === 'double-chocolate-peanut-butter' ? (
              <>
                Double chocolate
                <br />
                peanut butter
              </>
            ) : (
              cookie.name
            )}
          </h2>
          <span className="mx-auto w-56 rounded-full border border-cookie-rust bg-cookie-cream px-3 py-1 text-center font-mono text-xs font-bold text-cookie-rust sm:mx-0">
            {cookie.tagline}
          </span>
          {cookie.scales && <ScaleList scales={cookie.scales} lang={lang} className="mt-2" />}
        </div>
      </div>

      {hasDetails && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-full bg-cookie-rust px-4 py-2 text-sm font-bold text-cookie-cream [&::-webkit-details-marker]:hidden">
            {t(ui, 'nutritionAndAllergens', lang)}
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
            {cookie.nutrition && <NutritionTable facts={cookie.nutrition} lang={lang} />}
            {cookie.allergens && <AllergensList allergens={cookie.allergens} lang={lang} />}
          </div>
        </details>
      )}
    </FramedSection>
  )
}

function ScaleList({
  scales,
  lang,
  className,
}: {
  scales: NonNullable<Cookie['scales']>
  lang: Lang
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-2 ${className ?? ''}`}>
      {scales.map((scale) => {
        const filled = Math.round(scale.value)
        return (
          <div key={scale.label} className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-xs font-bold text-cookie-brown uppercase">
              {t(scaleLabels, scale.label, lang)}
            </span>
            <div className="flex h-3.5 w-40 gap-0.5 rounded-full bg-cookie-charcoal/10 p-0.5 sm:w-52">
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

function NutritionTable({
  facts,
  lang,
}: {
  facts: NonNullable<Cookie['nutrition']>
  lang: Lang
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-black text-cookie-brown uppercase">
        {t(ui, 'nutrition', lang)}
        <span className="ml-2 font-mono text-sm font-normal text-cookie-charcoal/60 normal-case">
          {t(ui, 'perCookie', lang)}
        </span>
      </h3>
      <dl className="flex flex-col gap-1 rounded-xl bg-cookie-cream/40 px-4 py-3 font-mono text-sm">
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={`flex items-center justify-between ${
              fact.indent ? 'pl-4 text-cookie-charcoal/70' : 'font-bold text-cookie-brown'
            }`}
          >
            <dt>{t(nutritionLabels, fact.label, lang)}</dt>
            <dd>{t(nutritionValues, fact.value, lang)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-cookie-charcoal/60">
        {t(ui, 'nutritionDisclaimer', lang)}
      </p>
    </div>
  )
}

function AllergensList({
  allergens,
  lang,
}: {
  allergens: NonNullable<Cookie['allergens']>
  lang: Lang
}) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-black text-cookie-brown uppercase">
        {t(ui, 'allergens', lang)}
      </h3>
      <div className="flex flex-wrap gap-2">
        {allergens.contains.map((allergen) => {
          const colors = allergenColors[allergen] ?? defaultAllergenColor
          return (
            <span
              key={allergen}
              className={`rounded-full px-3 py-1 text-sm font-bold ${colors.bg} ${colors.text}`}
            >
              {t(allergenLabels, allergen, lang)}
            </span>
          )
        })}
        {allergens.mayContain?.map((allergen) => {
          const colors = allergenColors[allergen] ?? defaultAllergenColor
          return (
            <span
              key={allergen}
              className={`rounded-full px-3 py-1 text-sm font-bold ${colors.mutedBg} ${colors.text}`}
            >
              {t(ui, 'mayContain', lang)}: {t(allergenLabels, allergen, lang)}
            </span>
          )
        })}
      </div>
    </div>
  )
}
