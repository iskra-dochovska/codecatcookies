import { useMemo } from 'react'
import { MerchCard } from '../components/MerchCard'
import { useMerch } from '../data/MerchContext'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'
import { SITE_URL } from '../seo'

function Merch() {
  const { lang } = useLanguage()
  const { merch, loading } = useMerch()

  const productsJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: merch.map((item, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: item.name,
        description: item.description,
        url: `${SITE_URL}/merch`,
        ...(item.images[0] ? { image: item.images[0].src } : {}),
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'MKD',
          availability: 'https://schema.org/InStock',
        },
      })),
    }),
    [merch],
  )

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-16">
      <title>Merch - codecatcookies</title>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }}
      />
      <h1 className="text-center text-3xl font-black text-cookie-brown uppercase sm:text-4xl">
        {t(ui, 'merchPageTitle', lang)}
      </h1>

      {loading ? (
        <p className="text-center font-bold text-cookie-charcoal/60 uppercase">
          {t(ui, 'loading', lang)}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {merch.map((item) => (
            <MerchCard key={item.slug} merch={item} />
          ))}
        </div>
      )}
    </section>
  )
}

export default Merch
