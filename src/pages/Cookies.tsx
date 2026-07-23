import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { CookieCard } from '../components/CookieCard'
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
          Get to Know Our Flavors
        </p>
      </div>

      {cookies.map((cookie) => (
        <CookieCard key={cookie.slug} cookie={cookie} />
      ))}
    </section>
  )
}

export default Cookies
