import { useEffect, useMemo, useRef, useState } from 'react'
import { useCookies } from '../../../data/CookiesContext'
import { useClickOutside } from '../../../hooks/useClickOutside'
import { supabase } from '../../../lib/supabaseClient'
import { formatDen } from '../../../lib/format'
import { packagingCost, type OrderRow } from '../orders'

const HOUR_LABELS = Array.from({ length: 24 }, (_, hour) => hour)
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const TOP_CUSTOMERS_LIMIT = 5
const ALL_MONTHS = 'all'

type CookieCost = { slug: string; name: string; price: number; production_cost: number }

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`
}

function formatMonthLabel(key: string) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function MonthSelect({
  value,
  options,
  onChange,
}: {
  value: string
  options: { key: string; label: string }[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setOpen(false), open)

  const selectedLabel = options.find((option) => option.key === value)?.label ?? ''

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex min-w-[9.5rem] cursor-pointer items-center justify-between gap-2 rounded-full border bg-white px-4 py-1.5 text-left text-xs font-bold text-cookie-charcoal uppercase transition-colors ${
          open ? 'border-cookie-rust' : 'border-cookie-charcoal/20'
        }`}
      >
        <span>{selectedLabel}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5 shrink-0 text-cookie-charcoal/50"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-20 mt-2 max-h-56 w-48 overflow-y-auto rounded-xl border border-cookie-charcoal/20 bg-white p-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="option"
              aria-selected={option.key === value}
              onClick={() => {
                onChange(option.key)
                setOpen(false)
              }}
              className={`w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-xs font-bold uppercase ${
                option.key === value
                  ? 'bg-cookie-rust text-cookie-cream'
                  : 'text-cookie-charcoal hover:bg-cookie-cream'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatsTab({ orders }: { orders: OrderRow[] }) {
  const { cookies } = useCookies()
  const [timeView, setTimeView] = useState<'hour' | 'day'>('hour')
  const [cookieCosts, setCookieCosts] = useState<CookieCost[]>([])
  const currentMonthKey = useMemo(() => monthKey(new Date()), [])
  const [monthFilter, setMonthFilter] = useState(currentMonthKey)

  useEffect(() => {
    supabase
      .from('cookies')
      .select('slug, name, price, production_cost')
      .then(({ data }) => setCookieCosts((data as CookieCost[] | null) ?? []))
  }, [])

  const monthOptions = useMemo(() => {
    const keys = new Set(orders.map((order) => monthKey(new Date(order.created_at))))
    keys.add(currentMonthKey)
    const sortedKeys = [...keys].sort().reverse()
    return [
      { key: ALL_MONTHS, label: 'All time' },
      ...sortedKeys.map((key) => ({ key, label: formatMonthLabel(key) })),
    ]
  }, [orders, currentMonthKey])

  const filteredOrders = useMemo(
    () =>
      monthFilter === ALL_MONTHS
        ? orders
        : orders.filter((order) => monthKey(new Date(order.created_at)) === monthFilter),
    [orders, monthFilter],
  )

  const stats = useMemo(() => {
    let profit = 0
    let revenue = 0
    let totalCookiesSold = 0
    let discountCount = 0
    let discountTotal = 0
    let packagingTotal = 0
    let productionTotal = 0
    let revenueOrderCount = 0
    const unitsBySlug = new Map<string, number>()
    const hourCounts = new Array(24).fill(0)
    const dayCounts = new Array(7).fill(0)
    const customersByEmail = new Map<string, { name: string; email: string; quantity: number }>()

    for (const order of filteredOrders) {
      const placedAt = new Date(order.created_at)
      hourCounts[placedAt.getHours()] += 1
      dayCounts[placedAt.getDay()] += 1

      let quantity = 0
      let orderProfit = 0
      let orderProductionCost = 0
      for (const item of order.order_items) {
        orderProfit += item.quantity * (item.unit_price - item.unit_cost)
        orderProductionCost += item.quantity * item.unit_cost
        totalCookiesSold += item.quantity
        quantity += item.quantity
        unitsBySlug.set(item.cookie_slug, (unitsBySlug.get(item.cookie_slug) ?? 0) + item.quantity)
      }

      const orderPackagingCost = packagingCost(order)
      packagingTotal += orderPackagingCost

      const discountAmount = order.discount_amount
      if (order.status === 'completed') {
        revenue += order.total - discountAmount
        profit += orderProfit - discountAmount - orderPackagingCost
        revenueOrderCount += 1
        productionTotal += orderProductionCost
      }
      if (order.discount) {
        discountCount += 1
        discountTotal += discountAmount
      }

      const customer = customersByEmail.get(order.email)
      if (customer) customer.quantity += quantity
      else customersByEmail.set(order.email, { name: order.full_name, email: order.email, quantity })
    }

    const cookieSales = cookies
      .map((cookie) => ({ slug: cookie.slug, name: cookie.name, quantity: unitsBySlug.get(cookie.slug) ?? 0 }))
      .sort((a, b) => b.quantity - a.quantity)

    const cookieProfitability = cookieCosts
      .map((cookie) => ({
        slug: cookie.slug,
        name: cookie.name,
        margin: cookie.price - cookie.production_cost,
      }))
      .sort((a, b) => b.margin - a.margin)

    const topCustomers = [...customersByEmail.values()]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, TOP_CUSTOMERS_LIMIT)

    const maxUnits = Math.max(1, ...cookieSales.map((c) => c.quantity))
    const maxMargin = Math.max(1, ...cookieProfitability.map((c) => c.margin))
    const maxCustomerUnits = Math.max(1, ...topCustomers.map((c) => c.quantity))
    const maxHourCount = Math.max(1, ...hourCounts)
    const maxDayCount = Math.max(1, ...dayCounts)

    return {
      profit,
      revenue,
      totalCookiesSold,
      discountCount,
      discountTotal,
      packagingTotal,
      productionTotal,
      revenueOrderCount,
      cookieSales,
      cookieProfitability,
      topCustomers,
      maxCustomerUnits,
      hourCounts,
      dayCounts,
      maxUnits,
      maxMargin,
      maxHourCount,
      maxDayCount,
    }
  }, [filteredOrders, cookies, cookieCosts])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Statistics</p>
        <MonthSelect value={monthFilter} options={monthOptions} onChange={setMonthFilter} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Total profit</p>
          <p className="mt-1 font-mono text-3xl font-black text-cookie-brown">
            {stats.profit.toFixed(0)} den
          </p>
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Production costs</p>
          <p className="mt-1 font-mono text-3xl font-black text-cookie-brown">
            {stats.productionTotal.toFixed(0)} den
          </p>
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Packaging costs</p>
          <p className="mt-1 font-mono text-3xl font-black text-cookie-brown">
            {stats.packagingTotal.toFixed(0)} den
          </p>
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Total revenue</p>
          <p className="mt-1 font-mono text-3xl font-black text-cookie-brown">
            {stats.revenue.toFixed(0)} den
          </p>
          <p className="mt-1 text-xs text-cookie-charcoal/50">
            {stats.revenueOrderCount} order{stats.revenueOrderCount === 1 ? '' : 's'}
          </p>
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Total cookies sold</p>
          <p className="mt-1 font-mono text-3xl font-black text-cookie-brown">
            {stats.totalCookiesSold}
          </p>
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Discounts given</p>
          <p className="mt-1 font-mono text-3xl font-black text-cookie-brown">
            {stats.discountTotal.toFixed(0)} den
          </p>
          <p className="mt-1 text-xs text-cookie-charcoal/50">
            {stats.discountCount} order{stats.discountCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="mb-3 text-xs font-bold text-cookie-charcoal/60 uppercase">Cookies sold</p>
          <div className="flex flex-col gap-2">
            {stats.cookieSales.map((cookie) => (
              <div key={cookie.slug} className="flex items-center gap-3">
                <span className="w-24 flex-none truncate text-xs font-bold text-cookie-brown">
                  {cookie.name}
                </span>
                <div className="h-2.5 flex-1 rounded-full bg-cookie-charcoal/10">
                  <div
                    className="h-2.5 rounded-full bg-cookie-rust"
                    style={{ width: `${(cookie.quantity / stats.maxUnits) * 100}%` }}
                  />
                </div>
                <span className="w-6 flex-none text-right font-mono text-xs text-cookie-charcoal/70">
                  {cookie.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="mb-3 text-xs font-bold text-cookie-charcoal/60 uppercase">
            Cookies by profitability
          </p>
          <div className="flex flex-col gap-2">
            {stats.cookieProfitability.length === 0 && (
              <p className="text-sm text-cookie-charcoal/50">No cookies yet.</p>
            )}
            {stats.cookieProfitability.map((cookie) => (
              <div key={cookie.slug} className="flex items-center gap-3">
                <span className="w-40 flex-none truncate text-xs font-bold text-cookie-brown">
                  {cookie.name}
                </span>
                <div className="h-2.5 flex-1 rounded-full bg-cookie-charcoal/10">
                  <div
                    className="h-2.5 rounded-full bg-cookie-rust"
                    style={{ width: `${Math.max(0, (cookie.margin / stats.maxMargin) * 100)}%` }}
                  />
                </div>
                <span className="w-16 flex-none text-right font-mono text-xs text-cookie-charcoal/70">
                  {formatDen(cookie.margin)} den
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">
              Orders by {timeView === 'hour' ? 'hour' : 'day'}
            </p>
            <div className="inline-flex rounded-full bg-cookie-charcoal/10 p-1">
              <button
                type="button"
                onClick={() => setTimeView('hour')}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors ${
                  timeView === 'hour' ? 'bg-cookie-rust text-cookie-cream' : 'text-cookie-charcoal/60'
                }`}
              >
                By hour
              </button>
              <button
                type="button"
                onClick={() => setTimeView('day')}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors ${
                  timeView === 'day' ? 'bg-cookie-rust text-cookie-cream' : 'text-cookie-charcoal/60'
                }`}
              >
                By day
              </button>
            </div>
          </div>

          {timeView === 'hour' ? (
            <div className="flex h-28 items-end gap-1 border-b border-cookie-charcoal/15">
              {HOUR_LABELS.map((hour) => (
                <div key={hour} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t bg-cookie-rust"
                    style={{ height: `${(stats.hourCounts[hour] / stats.maxHourCount) * 100}%` }}
                  />
                  <span className="font-mono text-[10px] text-cookie-charcoal/50">
                    {hour % 3 === 0 ? hour : ''}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-28 items-end gap-2 border-b border-cookie-charcoal/15">
              {DAY_LABELS.map((day, index) => (
                <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t bg-cookie-rust"
                    style={{ height: `${(stats.dayCounts[index] / stats.maxDayCount) * 100}%` }}
                  />
                  <span className="font-mono text-[10px] text-cookie-charcoal/50">{day}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-cookie-charcoal/15 bg-white p-5">
          <p className="mb-3 text-xs font-bold text-cookie-charcoal/60 uppercase">
            Top {TOP_CUSTOMERS_LIMIT} customers
          </p>
          <div className="flex flex-col gap-2">
            {stats.topCustomers.length === 0 && (
              <p className="text-sm text-cookie-charcoal/50">No orders yet.</p>
            )}
            {stats.topCustomers.map((customer) => (
              <div key={customer.email} className="flex items-center gap-3">
                <span className="w-48 flex-none truncate text-sm font-bold text-cookie-brown">
                  {customer.name}
                </span>
                <div className="h-3 flex-1 rounded-full bg-cookie-charcoal/10">
                  <div
                    className="h-3 rounded-full bg-cookie-rust"
                    style={{ width: `${(customer.quantity / stats.maxCustomerUnits) * 100}%` }}
                  />
                </div>
                <span className="w-8 flex-none text-right font-mono text-sm text-cookie-charcoal/70">
                  {customer.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsTab
