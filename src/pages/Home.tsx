import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import logoMark from '../assets/codecatcookies_logo.svg'
import sushi from '../assets/sushi.png'
import { FramedSection } from '../components/CookieDecor'
import { cookies } from '../data/cookies'
import { shops } from '../data/shops'

const STEP_INTERVAL_MS = 3000
const RESUME_DELAY_MS = 2000

const wavePath =
  'M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,53.3C672,43,768,21,864,21.3C960,21,1056,43,1152,48C1248,53,1344,43,1392,37.3L1440,32L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z'

function WaveDivider({ colorClassName }: { colorClassName: string }) {
  return (
    <svg
      className={`absolute -bottom-px left-0 h-10 w-full sm:h-14 ${colorClassName}`}
      viewBox="0 0 1440 74"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path fill="currentColor" d={wavePath} />
    </svg>
  )
}

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
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const step = () => {
      if (pausedRef.current) return
      const firstCard = track.children[0] as HTMLElement | undefined
      if (!firstCard) return
      const gap = parseFloat(getComputedStyle(track).columnGap || '0')
      const half = track.scrollWidth / 2
      if (track.scrollLeft >= half - 1) track.scrollLeft -= half
      track.scrollBy({ left: firstCard.offsetWidth + gap, behavior: 'smooth' })
    }

    const intervalId = setInterval(step, STEP_INTERVAL_MS)
    return () => clearInterval(intervalId)
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
    const half = track.scrollWidth / 2
    pause()
    if (direction === 1 && track.scrollLeft >= half - 1) track.scrollLeft -= half
    else if (direction === -1 && track.scrollLeft <= 1) track.scrollLeft += half
    track.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: 'smooth' })
    scheduleResume()
  }

  return (
    <>
      <section className="relative bg-cookie-brown px-6 pt-16 pb-20 text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
          <img
            src={logoMark}
            alt="codecatcookies"
            className="w-28 -rotate-[8deg] drop-shadow-[4px_5px_0_rgba(0,0,0,0.35)] sm:w-32"
          />
          <h1 className="text-5xl leading-[0.95] font-black text-balance text-cookie-cream uppercase sm:text-6xl">
            The <span className="text-cookie-honey">only</span> cookies you want to
            accept.
          </h1>
          <span className="-rotate-[4deg] rounded-lg border-2 border-cookie-honey px-4 py-1.5 font-mono text-sm font-bold tracking-widest text-cookie-honey uppercase">
            Coming soon
          </span>
        </div>
        <WaveDivider colorClassName="text-cookie-cream" />
      </section>

      <section className="relative w-full bg-cookie-cream px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-6xl">
          <h2 className="mb-8 text-center text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
            Get to know our cookies
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
                  className="flex w-72 shrink-0 flex-col items-center gap-3 rounded-2xl border-[3px] border-cookie-charcoal bg-white p-5 text-center shadow-[6px_6px_0_var(--color-cookie-charcoal)]"
                >
                  <img
                    src={cookie.image}
                    alt={cookie.name}
                    className="h-32 w-32 rounded-full border-[3px] border-cookie-charcoal object-cover"
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
        </div>
        <WaveDivider colorClassName="text-cookie-gold" />
      </section>

      <section className="relative w-full bg-cookie-gold px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-3xl">
          <FramedSection
            style={{ '--tilt': '-1deg' } as React.CSSProperties}
            className="sticker-card flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10"
          >
            <div className="w-48 flex-none sm:w-56">
              <img
                src={sushi}
                alt="Sushi, the Siamese cat behind codecatcookies"
                className="w-full rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-4 text-center sm:pt-4 sm:text-left">
              <h2 className="text-xl font-black text-cookie-brown uppercase">
                A very small kitchen, a very loud cat
              </h2>
              <p className="text-cookie-charcoal">
                <strong>codecatcookies</strong> started with one programmer&apos;s love for
                sugary sweets and a curious gremlin who loves micromanaging. Every cookie is
                baked, boxed and (mostly) approved by Sushi before it goes out the door.
              </p>
              <Link
                to="/about"
                className="mx-auto rounded-full border-2 border-cookie-charcoal bg-cookie-rust px-5 py-2 text-sm font-black text-cookie-cream uppercase shadow-[3px_3px_0_var(--color-cookie-charcoal)] transition-transform hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-cookie-charcoal)] sm:mx-0"
              >
                Meet the team
              </Link>
            </div>
          </FramedSection>
        </div>
        <WaveDivider colorClassName="text-cookie-honey" />
      </section>

      <section className="relative w-full bg-cookie-honey px-6 pt-16 pb-20">
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
                className="rounded-full border-2 border-cookie-charcoal bg-white px-4 py-2 text-sm font-bold text-cookie-brown uppercase shadow-[2px_2px_0_var(--color-cookie-charcoal)]"
              >
                {shop.name}
              </span>
            ))}
          </div>
          <Link
            to="/where-to-buy"
            className="rounded-full border-2 border-cookie-charcoal bg-cookie-rust px-6 py-3 text-sm font-black text-cookie-cream uppercase shadow-[4px_4px_0_var(--color-cookie-charcoal)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-cookie-charcoal)]"
          >
            See all locations
          </Link>
        </div>
        <WaveDivider colorClassName="text-cookie-cream" />
      </section>

      <section className="relative w-full bg-cookie-cream px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
            Good to know
          </h2>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border-[3px] border-cookie-charcoal bg-white px-5 py-4"
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
                <p className="mt-3 border-t-2 border-dashed border-cookie-charcoal/30 pt-3 text-cookie-charcoal">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
        <WaveDivider colorClassName="text-cookie-rust" />
      </section>

      <section className="w-full bg-cookie-rust px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-cream uppercase sm:text-3xl">
            Follow along
          </h2>
          <p className="max-w-lg text-cookie-cream/90">
            New flavors, behind-the-scenes baking and Sushi&apos;s opinions on all of it.
          </p>
          <div
            style={{ '--tilt': '-2deg' } as React.CSSProperties}
            className="sticker-card flex h-24 w-24 items-center justify-center rounded-xl border-[3px] border-cookie-cream bg-cookie-brown font-black text-4xl text-cookie-cream shadow-[3px_3px_0_var(--color-cookie-charcoal)]"
          >
            ?
          </div>
          <a
            href="https://www.instagram.com/codecatcookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-cookie-charcoal bg-cookie-cream px-6 py-3 text-sm font-black text-cookie-brown uppercase shadow-[4px_4px_0_var(--color-cookie-charcoal)] transition-transform hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--color-cookie-charcoal)]"
          >
            Follow @codecatcookies
          </a>
        </div>
      </section>
    </>
  )
}

export default Home
