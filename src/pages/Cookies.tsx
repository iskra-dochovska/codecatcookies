import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieCard } from '../components/CookieCard'
import { cookies } from '../data/cookies'
import { allergenColors } from '../data/allergens'
import { useLanguage } from '../i18n/LanguageContext'
import { allergenLabels, cookieTaglines, t, ui } from '../i18n/translations'
import { SITE_URL } from '../seo'

function Cookies() {
  const { hash } = useLocation()
  const { lang } = useLanguage()

  const productsJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: cookies.map((cookie, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: cookie.name,
        description: t(cookieTaglines, cookie.slug, 'en'),
        url: `${SITE_URL}/cookies#${cookie.slug}`,
        ...(cookie.image ? { image: `${SITE_URL}${cookie.image}` } : {}),
        offers: {
          '@type': 'Offer',
          price: cookie.price,
          priceCurrency: 'MKD',
          availability: 'https://schema.org/InStock',
        },
      })),
    }),
    [],
  )

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
      <title>Our cookies — codecatcookies</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
      <div className="text-center">
        <h1 className="text-3xl font-black text-cookie-brown uppercase sm:text-4xl">
          {t(ui, 'findYourFavorite', lang)}
        </h1>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {Object.entries(allergenColors).map(([allergen, colors]) => (
            <span
              key={allergen}
              className={`rounded-full px-3 py-1 text-xs font-bold ${colors.bg} ${colors.text}`}
            >
              {t(allergenLabels, allergen, lang)}
            </span>
          ))}
        </div>
      </div>

      {cookies.map((cookie) => (
        <CookieCard key={cookie.slug} cookie={cookie} />
      ))}
    </section>
  )
}

export default Cookies
