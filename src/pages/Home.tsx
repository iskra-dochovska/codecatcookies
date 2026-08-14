import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import sushi from '../assets/sushi.png'
import { cookies } from '../data/cookies'
import { shops } from '../data/shops'
import logoMark from '../assets/codecatcookies_logo.svg'
import { useLanguage, type Lang } from '../i18n/LanguageContext'

function pickRandomCookies(count: number) {
  const shuffled = [...cookies].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getFaqs(lang: Lang) {
  if (lang === 'mk') {
    return [
      {
        question: (
          <span>
            Дали <strong>codecatcookies</strong> се само во Скопје?
          </span>
        ),
        answer:
          'Да, за сега продаваме само во Скопје се додека не научиме како да извадеме возачка за мачката.',
      },
      {
        question: 'Како можам да купам колачиња за себе си или за настан што го организирам?',
        answer: (
          <>
            Доколку би сакале да направите поголема нарачка, слободно контактирајте не на{' '}
            <strong>info@codecatcookies.com</strong> со колачињата и количината што би ја
            сакале заедно со вашиот телефонски број и ќе ве контактираме. Ве молиме да ја
            направите вашата нарачка барем 48 часа унапред.
          </>
        ),
      },
    ]
  }

  return [
    {
      question: (
        <span>
          Are <strong>codecatcookies</strong> only in Skopje?
        </span>
      ),
      answer:
        "Yes, for now we only sell in Skopje until we figure out how to get the cat a driver's licence.",
    },
    {
      question: "How can I buy cookies for myself or an event I'm organizing?",
      answer: (
        <>
          If you&apos;d like to place a larger order, feel free to email us at{' '}
          <strong>info@codecatcookies.com</strong> with the cookies you&apos;d like and your
          contact information and we&apos;ll be in touch. Please make sure to place your
          order at least 48 hours in advance.
        </>
      ),
    },
  ]
}

function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const { lang } = useLanguage()
  const faqs = getFaqs(lang)
  const featuredCookies = useMemo(() => pickRandomCookies(3), [])

  return (
    <>
      <section className="bg-cookie-brown px-6 py-16 sm:py-24">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <img src={logoMark} alt="codecatcookies" className="w-28 sm:w-32" />
            <h1 className="text-5xl leading-[0.95] font-black text-balance text-cookie-cream uppercase sm:text-6xl">
              {lang === 'mk' ? (
                <>
                  <span className="text-cookie-honey">Единствените</span> колачиња кои
                  сакате да ги прифатите.
                </>
              ) : (
                <>
                  The <span className="text-cookie-honey">only</span> cookies you want to
                  accept.
                </>
              )}
            </h1>
            <span className="rounded-lg border-2 border-cookie-honey px-4 py-1.5 font-mono text-sm font-bold tracking-widest text-cookie-honey uppercase">
              Coming soon
            </span>
          </div>
          <div className="flex h-64 w-full max-w-sm items-center justify-center rounded-2xl border-2 border-dashed border-cookie-cream/40 text-sm text-cookie-cream/50 sm:h-80">
            Image
          </div>
        </div>
      </section>

      <section className="w-full bg-cookie-cream px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6">
          {featuredCookies.map((cookie, index) => (
            <Link
              key={cookie.slug}
              to={`/cookies#${cookie.slug}`}
              className={`flex w-full flex-col items-center gap-6 rounded-2xl bg-cookie-honey p-6 sm:flex-row sm:items-start ${
                index % 2 === 1 ? 'sm:flex-row-reverse' : ''
              }`}
            >
              <div className="flex h-40 w-full flex-none items-center justify-center rounded-xl border-2 border-dashed border-cookie-charcoal/40 text-sm text-cookie-charcoal/50 sm:w-56">
                Image
              </div>
              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h3 className="text-xl font-black text-cookie-brown uppercase">
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
                <span className="mx-auto w-56 rounded-full border border-cookie-rust bg-cookie-cream px-3 py-1 text-center font-mono text-xs font-bold text-cookie-rust sm:mx-0">
                  {cookie.tagline}
                </span>
              </div>
            </Link>
          ))}
          <Link
            to="/cookies"
            className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-black text-cookie-cream uppercase transition-transform hover:-translate-y-0.5"
          >
            See all cookies
          </Link>
        </div>
      </section>

      <section className="w-full bg-cookie-brown px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-6 sm:flex-row sm:items-start sm:gap-10 sm:p-8">
            <div className="w-48 flex-none sm:w-56">
              <img
                src={sushi}
                alt="Sushi, the Siamese cat behind codecatcookies"
                className="w-full rounded-2xl"
              />
            </div>
            <div className="flex flex-col gap-4 text-center sm:pt-4 sm:text-left">
              <h2 className="text-xl font-black text-cookie-brown uppercase">
                {lang === 'mk' ? 'Како стигнавме тука?' : 'How did we get here?'}
              </h2>
              <p className="text-cookie-charcoal">
                {lang === 'mk' ? (
                  <>
                    <strong>codecatcookies</strong> е резултат на еден програмер што одлучи
                    да си даде отказ од работа и да оди малку надвор на сонце. Малиот гремлин
                    што личи на мачка се вика Суши, таа е доживотен микроменаџер на овој
                    бизнис и гарантира беспрекорен квалитет за секоја тура колачиња што ја
                    печиме.
                  </>
                ) : (
                  <>
                    <strong>codecatcookies</strong> is what happens when a programmer quits their day job and
                    decides it&apos;s time to touch some grass. The little menace of a cat is
                    Sushi, she&apos;s the lifelong micromanager of the business and she
                    guarantees top notch quality with every batch baked.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex w-full min-h-[22rem] items-center bg-cookie-cream px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-brown uppercase sm:text-3xl">
            Where can you buy our cookies?
          </h2>
          <p className="max-w-lg text-cookie-charcoal">
            <strong>codecatcookies</strong> will soon be offered at your favorite cafes
            around town, follow us for more!
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {shops.map((shop) => (
              <span
                key={shop.name}
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-cookie-brown uppercase"
              >
                {shop.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-cookie-rust px-6 py-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 text-center">
          <h2 className="text-2xl font-black text-cookie-cream uppercase sm:text-3xl">
            {lang === 'mk' ? 'Следете нè' : 'Follow along'}
          </h2>
          <p className="max-w-2xl text-cookie-cream/90">
            {lang === 'mk'
              ? 'Ако сте љубопитни околу тоа како функционира цела оваа работа, следете нè на Инстаграм и откријте ги позадинските процеси на еден зависник од шеќер и една темпераментна сијамка.'
              : "If you're curious on how we make this whole thing happen, follow us over on Instagram and see the inner workings of a sugar addict and a snappy siamese!"}
          </p>
          <img src={logoMark} alt="codecatcookies" className="w-36" />
          <a
            href="https://www.instagram.com/codecatcookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-cookie-cream px-6 py-3 text-sm font-black text-cookie-brown uppercase transition-transform hover:-translate-y-0.5"
          >
            Follow @codecatcookies
          </a>
        </div>
      </section>

      <section className="w-full bg-cookie-brown px-6 pt-16 pb-20">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="mb-6 text-center text-2xl font-black text-cookie-cream uppercase sm:text-3xl">
            {lang === 'mk' ? 'ЧПП' : 'FAQ'}
          </h2>
          <div className="flex flex-col gap-6">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div
                  key={index}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setOpenFaq(isOpen ? null : index)
                    }
                  }}
                  className="cursor-pointer rounded-2xl bg-white px-5 py-4"
                >
                  <div className="flex items-center justify-between gap-3 font-bold text-cookie-brown">
                    {faq.question}
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-4 w-4 flex-none transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {isOpen && (
                    <p className="mt-3 border-t-2 border-dashed border-cookie-charcoal/30 pt-3 text-cookie-charcoal">
                      {faq.answer}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}

export default Home
