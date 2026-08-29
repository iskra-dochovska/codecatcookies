import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FramedSection } from '../components/CookieDecor'
import DatePicker from '../components/DatePicker'
import TimeSelect from '../components/TimeSelect'
import { cookies } from '../data/cookies'
import { MIN_CHECKOUT_ITEMS, useCart } from '../cart/CartContext'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'

const PICKUP_ADDRESS = 'Prashka 9, 1000 Skopje'

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const TIME_SLOTS = (() => {
  const slots: string[] = []
  for (let minutes = 8 * 60; minutes <= 20 * 60; minutes += 30) {
    slots.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`)
  }
  return slots
})()

const CONFIRMATION_REDIRECT_MS = 4000

function CheckoutHead() {
  return (
    <>
      <title>Checkout — codecatcookies</title>
      <meta name="robots" content="noindex, nofollow" />
    </>
  )
}

function Checkout() {
  const { lang } = useLanguage()
  const { items, clear } = useCart()
  const navigate = useNavigate()

  const lines = Object.entries(items).flatMap(([slug, quantity]) => {
    const cookie = cookies.find((c) => c.slug === slug)
    return cookie ? [{ cookie, quantity }] : []
  })
  const totalCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.cookie.price * line.quantity, 0)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const minDate = useMemo(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return toISODate(tomorrow)
  }, [])

  const earliestPickup = useMemo(() => new Date(Date.now() + 24 * 60 * 60 * 1000), [])

  const availableTimes = useMemo(() => {
    if (!date) return TIME_SLOTS
    const [year, month, day] = date.split('-').map(Number)
    return TIME_SLOTS.filter((slot) => {
      const [hour, minute] = slot.split(':').map(Number)
      const slotDate = new Date(year, month - 1, day, hour, minute)
      return slotDate.getTime() >= earliestPickup.getTime()
    })
  }, [date, earliestPickup])

  useEffect(() => {
    if (!submitted) return
    const timeout = setTimeout(() => navigate('/'), CONFIRMATION_REDIRECT_MS)
    return () => clearTimeout(timeout)
  }, [submitted, navigate])

  const handleDateChange = (value: string) => {
    setDate(value)
    setTime('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!date || !time || submitting) return

    setSubmitting(true)
    setSubmitError(false)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          date,
          time,
          notes,
          lines: lines.map((line) => ({
            name: line.cookie.name,
            quantity: line.quantity,
            price: line.cookie.price,
          })),
          total,
        }),
      })
      if (!response.ok) throw new Error('checkout request failed')

      clear()
      setSubmitted(true)
    } catch {
      setSubmitError(true)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16 text-center">
        <CheckoutHead />
        <h1 className="text-3xl font-black text-cookie-brown uppercase">
          {t(ui, 'orderConfirmedTitle', lang)}
        </h1>
        <p className="text-cookie-charcoal/80">{t(ui, 'orderConfirmedBody', lang)}</p>
      </section>
    )
  }

  if (totalCount < MIN_CHECKOUT_ITEMS) {
    return (
      <section className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-16 text-center">
        <CheckoutHead />
        <h1 className="text-3xl font-black text-cookie-brown uppercase">
          {t(ui, 'checkout', lang)}
        </h1>
        <p className="font-bold text-cookie-charcoal/80 uppercase">
          {t(ui, 'checkoutMinNotice', lang).replace('{n}', String(MIN_CHECKOUT_ITEMS - totalCount))}
        </p>
        <Link
          to="/cookies"
          className="mx-auto rounded-full bg-cookie-rust px-6 py-2 text-sm font-bold text-cookie-cream uppercase"
        >
          {t(ui, 'backToCookies', lang)}
        </Link>
      </section>
    )
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 py-16">
      <CheckoutHead />
      <h1 className="text-center text-3xl font-black text-cookie-brown uppercase">
        {t(ui, 'checkoutTitle', lang)}
      </h1>

      <FramedSection className="flex flex-col gap-2">
        <h2 className="text-lg font-black text-cookie-brown uppercase">
          {t(ui, 'orderSummary', lang)}
        </h2>
        {lines.map(({ cookie, quantity }) => (
          <div key={cookie.slug} className="flex items-center justify-between font-mono text-sm">
            <span className="text-cookie-charcoal/80">
              {cookie.name} x {quantity}
            </span>
            <span className="font-bold text-cookie-brown">
              {cookie.price * quantity} {t(ui, 'currency', lang)}
            </span>
          </div>
        ))}
        <div className="mt-2 flex items-center justify-between border-t-2 border-dashed border-cookie-charcoal/30 pt-2 font-mono text-sm">
          <span className="text-cookie-charcoal/70">{t(ui, 'total', lang)}</span>
          <span className="font-bold text-cookie-brown">
            {total} {t(ui, 'currency', lang)}
          </span>
        </div>
      </FramedSection>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-cookie-brown uppercase">
            {t(ui, 'fullName', lang)}
          </span>
          <input
            type="text"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="rounded-xl border border-cookie-charcoal/20 bg-white px-4 py-2 text-cookie-charcoal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-cookie-brown uppercase">
            {t(ui, 'email', lang)}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={() => setEmailTouched(true)}
            aria-invalid={emailTouched && email !== '' && !EMAIL_PATTERN.test(email)}
            className={`rounded-xl border bg-white px-4 py-2 text-cookie-charcoal ${
              emailTouched && email !== '' && !EMAIL_PATTERN.test(email)
                ? 'border-cookie-rust'
                : 'border-cookie-charcoal/20'
            }`}
          />
          {emailTouched && email !== '' && !EMAIL_PATTERN.test(email) && (
            <p className="text-xs font-bold text-cookie-rust">{t(ui, 'invalidEmail', lang)}</p>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-cookie-brown uppercase">
            {t(ui, 'phone', lang)}
          </span>
          <div className="flex items-center gap-2 rounded-xl border border-cookie-charcoal/20 bg-white px-4 py-2">
            <span className="font-mono text-cookie-charcoal/60">+389</span>
            <input
              type="tel"
              inputMode="numeric"
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 8))}
              className="flex-1 text-cookie-charcoal outline-none"
            />
          </div>
        </label>

        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-bold text-cookie-brown uppercase">
              {t(ui, 'pickupDate', lang)}
            </span>
            <DatePicker
              value={date}
              onChange={handleDateChange}
              min={minDate}
              lang={lang}
              placeholder={t(ui, 'selectDate', lang)}
            />
          </label>

          <label className="flex flex-1 flex-col gap-1">
            <span className="text-sm font-bold text-cookie-brown uppercase">
              {t(ui, 'pickupTime', lang)}
            </span>
            <TimeSelect
              value={time}
              onChange={setTime}
              options={availableTimes}
              disabled={!date || availableTimes.length === 0}
              placeholder={t(ui, 'selectTime', lang)}
            />
          </label>
        </div>

        {date && availableTimes.length === 0 && (
          <p className="text-sm font-bold text-cookie-rust">{t(ui, 'noTimesAvailable', lang)}</p>
        )}

        <label className="flex flex-col gap-1">
          <span className="text-sm font-bold text-cookie-brown uppercase">
            {t(ui, 'orderNotes', lang)}
          </span>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            placeholder={t(ui, 'orderNotesPlaceholder', lang)}
            className="rounded-xl border border-cookie-charcoal/20 bg-white px-4 py-2 text-cookie-charcoal placeholder:text-cookie-charcoal/40"
          />
        </label>

        <div className="flex flex-col items-center gap-1 rounded-xl border-2 border-cookie-rust bg-cookie-cream/60 px-4 py-3 text-center text-sm">
          <span className="font-bold text-cookie-brown uppercase">
            {t(ui, 'pickupAddressLabel', lang)}: {PICKUP_ADDRESS}
          </span>
          <span className="font-bold text-cookie-brown uppercase">
            {t(ui, 'cashPaymentNotice', lang)}
          </span>
        </div>

        {submitError && (
          <p className="text-sm font-bold text-cookie-rust">{t(ui, 'orderSubmitError', lang)}</p>
        )}

        <button
          type="submit"
          disabled={!date || !time || submitting}
          className="rounded-full bg-cookie-rust px-6 py-3 text-sm font-bold text-cookie-cream uppercase disabled:opacity-50"
        >
          {submitting ? t(ui, 'placingOrder', lang) : t(ui, 'placeOrder', lang)}
        </button>
      </form>
    </section>
  )
}

export default Checkout
