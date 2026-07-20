import { useState } from 'react'
import { Link } from 'react-router-dom'
import logoMark from '../assets/codecatcookies_logo.svg'
import cookiesHero from '../assets/cookies_hero.jpg'
import NotifyModal from '../components/NotifyModal'
import { cookies } from '../data/cookies'

function Home() {
  const [notifyOpen, setNotifyOpen] = useState(false)

  return (
    <>
      <section className="relative min-h-[60vh] w-full overflow-hidden">
        <img
          src={cookiesHero}
          alt="codecatcookies assortment"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/40 px-6 text-center">
          <img src={logoMark} alt="codecatcookies" className="h-40 sm:h-64" />
          <span className="rounded-full bg-cookie-rust px-4 py-1.5 text-sm font-semibold tracking-widest text-cookie-cream uppercase">
            Coming soon
          </span>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-24 text-center sm:py-32">
        <p className="max-w-xl text-lg font-bold uppercase text-cookie-brown">
          The only cookies you want to accept.
        </p>
        <button
          type="button"
          onClick={() => setNotifyOpen(true)}
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-semibold text-cookie-cream hover:bg-cookie-brown"
        >
          Get notified
        </button>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-16">
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {cookies.map((cookie) => (
            <Link
              key={cookie.slug}
              to={`/cookies#${cookie.slug}`}
              className="flex flex-col items-center gap-3 rounded-2xl border-2 border-cookie-honey bg-cookie-rust p-6 text-center shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="rounded-full bg-cookie-cream p-2">
                <img
                  src={cookie.image}
                  alt={cookie.name}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-cookie-cream">{cookie.name}</h3>
              <p className="text-base text-cookie-cream/90">{cookie.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} />
    </>
  )
}

export default Home
