import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieCard } from '../components/CookieCard'
import { useCookies } from '../data/CookiesContext'
import { allergenColors } from '../data/allergens'
import { useLanguage } from '../i18n/LanguageContext'
import { allergenLabels, t, ui } from '../i18n/translations'
import { SITE_URL } from '../seo'

function Cookies() {
  const { hash } = useLocation()
  const { lang } = useLanguage()
  const { cookies, loading } = useCookies()

  const bestSellerSlug = useMemo(() => {
    const topSeller = [...cookies].sort((a, b) => b.unitsSold - a.unitsSold)[0]
    return topSeller && topSeller.unitsSold > 0 ? topSeller.slug : null
  }, [cookies])

  const productsJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: cookies.map((cookie, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: cookie.name,
        description: cookie.tagline.en,
        url: `${SITE_URL}/cookies#${cookie.slug}`,
        ...(cookie.images[0] ? { image: `${SITE_URL}${cookie.images[0].src}` } : {}),
        offers: {
          '@type': 'Offer',
          price: cookie.price,
          priceCurrency: 'MKD',
          availability: 'https://schema.org/InStock',
        },
      })),
    }),
    [cookies],
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

      {loading ? (
        <p className="text-center font-bold text-cookie-charcoal/60 uppercase">
          {t(ui, 'loading', lang)}
        </p>
      ) : (
        cookies.map((cookie) => (
          <CookieCard key={cookie.slug} cookie={cookie} isBestSeller={cookie.slug === bestSellerSlug} />
        ))
      )}
    </section>
  )
}

export default Cookies
