import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieCard } from '../components/CookieCard'
import { cookies } from '../data/cookies'
import { allergenColors } from '../data/allergens'
import { useLanguage } from '../i18n/LanguageContext'
import { allergenLabels, t } from '../i18n/translations'

function Cookies() {
  const { hash } = useLocation()
  const { lang } = useLanguage()

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
        <h1 className="text-3xl font-black text-cookie-brown uppercase sm:text-4xl">
          Find your favorite
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
