import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logoMark from '../assets/codecatcookies_logo_and_text_light.svg'
import cookiesHero from '../assets/cookies_hero.jpg'
import NotifyModal from '../components/NotifyModal'
import { cookies } from '../data/cookies'

const STEP_INTERVAL_MS = 3000
const RESUME_DELAY_MS = 2000

function Home() {
  const [notifyOpen, setNotifyOpen] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const wrap = () => {
      const half = track.scrollWidth / 2
      if (track.scrollLeft >= half) track.scrollLeft -= half
      else if (track.scrollLeft <= 0) track.scrollLeft += half
    }

    const step = () => {
      if (pausedRef.current) return
      const firstCard = track.children[0] as HTMLElement | undefined
      if (!firstCard) return
      const gap = parseFloat(getComputedStyle(track).columnGap || '0')
      track.scrollBy({ left: firstCard.offsetWidth + gap, behavior: 'smooth' })
    }

    const intervalId = setInterval(step, STEP_INTERVAL_MS)
    track.addEventListener('scroll', wrap)
    return () => {
      clearInterval(intervalId)
      track.removeEventListener('scroll', wrap)
    }
  }, [])

  const pause = () => {
    pausedRef.current = true
    clearTimeout(resumeTimeoutRef.current)
  }

  const scheduleResume = () => {
    clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false
    }, RESUME_DELAY_MS)
  }

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const firstCard = track.children[0] as HTMLElement | undefined
    if (!firstCard) return
    const gap = parseFloat(getComputedStyle(track).columnGap || '0')
    pause()
    track.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: 'smooth' })
    scheduleResume()
  }

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

      <section className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous cookie"
            onClick={() => scrollByCard(-1)}
            className="hidden shrink-0 p-2 text-cookie-brown hover:text-cookie-rust sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            ref={trackRef}
            onPointerDown={pause}
            onPointerUp={scheduleResume}
            onPointerLeave={scheduleResume}
            onWheel={() => {
              pause()
              scheduleResume()
            }}
            onTouchStart={pause}
            onTouchEnd={scheduleResume}
            className="flex w-[912px] max-w-full gap-6 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[...cookies, ...cookies].map((cookie, index) => (
              <Link
                key={`${cookie.slug}-${index}`}
                to={`/cookies#${cookie.slug}`}
                className="flex w-72 shrink-0 flex-col items-center gap-3 rounded-2xl border-2 border-cookie-honey bg-cookie-rust p-6 text-center shadow-md transition-shadow hover:shadow-lg"
              >
                <img
                  src={cookie.image}
                  alt={cookie.name}
                  className="h-24 w-24 object-contain"
                />
                <h3 className="text-xl font-bold text-cookie-cream">
                  {cookie.slug === 'double-chocolate-peanut-butter' ? (
                    <>
                      Double chocolate
                      <br />
                      peanut butter
                    </>
                  ) : (
                    cookie.name
                  )}
                </h3>
                <p className="text-base text-cookie-cream/90">{cookie.tagline}</p>
              </Link>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next cookie"
            onClick={() => scrollByCard(1)}
            className="hidden shrink-0 p-2 text-cookie-brown hover:text-cookie-rust sm:flex"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </section>

      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} />
    </>
  )
}

export default Home
