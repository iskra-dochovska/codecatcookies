import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logoMark from '../assets/codecatcookies_logo.svg'
import sushi from '../assets/sushi.png'
import NotifyModal from '../components/NotifyModal'
import { FramedSection } from '../components/CookieDecor'
import { cookies } from '../data/cookies'
import { shops } from '../data/shops'

const STEP_INTERVAL_MS = 3000
const RESUME_DELAY_MS = 2000
const CARD_TILTS = [-2, 2, -1.5, 2.5, -1]

const heroClipPath =
  'polygon(0 0, 100% 0, 100% 94%, 95% 100%, 90% 94%, 85% 100%, 80% 94%, 75% 100%, 70% 94%, 65% 100%, 60% 94%, 55% 100%, 50% 94%, 45% 100%, 40% 94%, 35% 100%, 30% 94%, 25% 100%, 20% 94%, 15% 100%, 10% 94%, 5% 100%, 0 94%)'

const faqs = [
  {
    question: 'Do you take custom orders?',
    answer:
      "Yes! Message us on Instagram and we'll figure out flavors, quantities and pickup timing together.",
  },
  {
    question: 'Are your cookies always freshly baked?',
    answer:
      "Always. We bake in small batches and don't keep stock sitting around waiting for orders.",
  },
  {
    question: 'Can I get same-day pickup?',
    answer:
      "Depends on how loud Sushi lets us work that day, message us and we'll let you know.",
  },
  {
    question: 'Do you cater to allergies?',
    answer:
      "Every cookie's page lists its allergens, but we're not a nut-free or gluten-free kitchen, so cross-contact is possible.",
  },
]

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
      <section
        className="relative overflow-hidden bg-cookie-brown px-6 pt-16 pb-20 text-center"
        style={{ clipPath: heroClipPath }}
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <img
            src={logoMark}
            alt="codecatcookies"
            className="w-28 -rotate-[8deg] drop-shadow-[4px_5px_0_rgba(0,0,0,0.35)] sm:w-32"
          />
          <h1 className="text-5xl leading-[0.95] font-black text-balance text-cookie-cream uppercase sm:text-6xl">
            The only cookies you want to{' '}
            <span className="text-cookie-zest">accept.</span>
          </h1>
          <span className="-rotate-[4deg] rounded-lg border-2 border-cookie-zest px-4 py-1.5 font-mono text-sm font-bold tracking-widest text-cookie-zest uppercase">
            Coming soon
          </span>
          <button
            type="button"
            onClick={() => setNotifyOpen(true)}
            className="rounded-full border-2 border-cookie-ink bg-cookie-zest px-8 py-3 text-sm font-black text-cookie-ink uppercase shadow-[5px_5px_0_var(--color-cookie-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--color-cookie-ink)]"
          >
            Get notified
          </button>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-16">
        <h2 className="mb-8 text-center text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
          Five flavors, zero regrets
        </h2>
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
            className="flex w-[912px] max-w-full gap-6 overflow-x-auto px-2 py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[...cookies, ...cookies].map((cookie, index) => (
              <Link
                key={`${cookie.slug}-${index}`}
                to={`/cookies#${cookie.slug}`}
                style={{ '--tilt': `${CARD_TILTS[index % CARD_TILTS.length]}deg` } as React.CSSProperties}
                className="sticker-card flex w-72 shrink-0 flex-col items-center gap-3 rounded-2xl border-[3px] border-cookie-ink bg-white p-5 text-center shadow-[6px_6px_0_var(--color-cookie-ink)]"
              >
                <img
                  src={cookie.image}
                  alt={cookie.name}
                  className="h-32 w-32 rounded-full border-[3px] border-cookie-ink object-cover"
                />
                <h3 className="text-lg font-black text-cookie-brown uppercase">
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
                <span className="rounded-full border border-dashed border-cookie-rust bg-cookie-rust/10 px-3 py-1 font-mono text-xs text-cookie-rust">
                  {cookie.tagline}
                </span>
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

      <section className="mx-auto w-full max-w-3xl px-6 pb-16">
        <FramedSection
          style={{ '--tilt': '-1deg' } as React.CSSProperties}
          className="sticker-card flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10"
        >
          <div className="w-48 flex-none sm:w-56">
            <img
              src={sushi}
              alt="Sushi, the Siamese cat behind codecatcookies"
              className="w-full rounded-2xl border-[3px] border-cookie-ink"
            />
          </div>
          <div className="flex flex-col gap-4 text-center sm:pt-4 sm:text-left">
            <h2 className="text-xl font-black text-cookie-brown uppercase">
              A very small kitchen, a very loud cat
            </h2>
            <p className="text-cookie-charcoal">
              codecatcookies started with one programmer&apos;s love for glucose and a cat
              who insists on supervising every batch. Every cookie is baked, boxed and
              (mostly) approved by Sushi before it goes out the door.
            </p>
            <Link
              to="/about"
              className="mx-auto rounded-full border-2 border-cookie-ink bg-cookie-rust px-5 py-2 text-sm font-black text-cookie-cream uppercase shadow-[3px_3px_0_var(--color-cookie-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-cookie-ink)] sm:mx-0"
            >
              Meet the team
            </Link>
          </div>
        </FramedSection>
      </section>

      <section className="w-full bg-cookie-honey/25 px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
            Find us around town
          </h2>
          <p className="max-w-lg text-cookie-charcoal">
            codecatcookies is popping up in a few local spots around Skopje. Exact
            addresses and hours are coming soon.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {shops.map((shop) => (
              <span
                key={shop.name}
                className="rounded-full border-2 border-cookie-ink bg-white px-4 py-2 text-sm font-bold text-cookie-brown shadow-[2px_2px_0_var(--color-cookie-ink)]"
              >
                {shop.name}
              </span>
            ))}
          </div>
          <Link
            to="/where-to-buy"
            className="rounded-full border-2 border-cookie-ink bg-cookie-rust px-6 py-3 text-sm font-black text-cookie-cream uppercase shadow-[4px_4px_0_var(--color-cookie-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-cookie-ink)]"
          >
            See all locations
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <h2 className="mb-6 text-center text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
          Good to know
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border-[3px] border-cookie-ink bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-bold text-cookie-brown [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 flex-none transition-transform group-open:rotate-180"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </summary>
              <p className="mt-3 border-t-2 border-dashed border-cookie-ink/30 pt-3 text-cookie-charcoal">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="w-full bg-cookie-rust px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-cream uppercase sm:text-3xl">
            Follow along
          </h2>
          <p className="max-w-lg text-cookie-cream/90">
            New flavors, behind-the-scenes baking and Sushi&apos;s opinions on all of it.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-5">
            {cookies.map((cookie, index) => (
              <img
                key={cookie.slug}
                src={cookie.image}
                alt={cookie.name}
                style={{ '--tilt': `${CARD_TILTS[index % CARD_TILTS.length]}deg` } as React.CSSProperties}
                className="sticker-card h-20 w-20 rounded-xl border-[3px] border-cookie-cream object-cover shadow-[3px_3px_0_var(--color-cookie-ink)] sm:h-24 sm:w-24"
              />
            ))}
          </div>
          <a
            href="https://www.instagram.com/codecatcookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-cookie-ink bg-cookie-cream px-6 py-3 text-sm font-black text-cookie-brown uppercase shadow-[4px_4px_0_var(--color-cookie-ink)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-cookie-ink)]"
          >
            Follow @codecatcookies
          </a>
        </div>
      </section>

      <NotifyModal open={notifyOpen} onClose={() => setNotifyOpen(false)} />
    </>
  )
}

export default Home
