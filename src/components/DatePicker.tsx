import { useEffect, useMemo, useRef, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  min: string
  lang: 'en' | 'mk'
  placeholder: string
}

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

function toISODate(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseISODate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function DatePicker({ value, onChange, min, lang, placeholder }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const minDate = useMemo(() => parseISODate(min), [min])
  const [viewDate, setViewDate] = useState(() => (value ? parseISODate(value) : minDate))
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setOpen(false), open)

  useEffect(() => {
    if (value) setViewDate(parseISODate(value))
  }, [value])

  const locale = lang === 'mk' ? 'mk-MK' : 'en-GB'
  const todayISO = useMemo(() => toISODate(new Date()), [])

  const headerLabel = useMemo(() => {
    const label = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(viewDate)
    return label.charAt(0).toUpperCase() + label.slice(1)
  }, [viewDate, locale])

  const weekdayLabels = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        new Intl.DateTimeFormat(locale, { weekday: 'narrow' }).format(new Date(1970, 0, 5 + index)),
      ),
    [locale],
  )

  const weeks = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells: (Date | null)[] = [
      ...Array(firstWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
    ]
    while (cells.length % 7 !== 0) cells.push(null)
    const rows: (Date | null)[][] = []
    for (let index = 0; index < cells.length; index += 7) rows.push(cells.slice(index, index + 7))
    return rows
  }, [viewDate])

  const canGoPrev =
    viewDate.getFullYear() > minDate.getFullYear() ||
    (viewDate.getFullYear() === minDate.getFullYear() && viewDate.getMonth() > minDate.getMonth())

  const changeMonth = (delta: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1))
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2 text-left text-cookie-charcoal ${
          open ? 'border-cookie-rust' : 'border-cookie-charcoal/20'
        }`}
      >
        <span className={value ? '' : 'text-cookie-charcoal/40'}>
          {value
            ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
                parseISODate(value),
              )
            : placeholder}
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 shrink-0 text-cookie-charcoal/50"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={placeholder}
          className="absolute z-20 mt-2 w-72 rounded-xl border border-cookie-charcoal/20 bg-white p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => changeMonth(-1)}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className="cursor-pointer rounded-full p-1 text-cookie-brown hover:bg-cookie-cream disabled:cursor-not-allowed disabled:opacity-30"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="text-sm font-bold text-cookie-brown uppercase">{headerLabel}</span>
            <button
              type="button"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="cursor-pointer rounded-full p-1 text-cookie-brown hover:bg-cookie-cream"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-cookie-charcoal/40">
            {weekdayLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>

          <div className="mt-1 flex flex-col gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => {
                  if (!day) return <span key={dayIndex} />
                  const iso = toISODate(day)
                  const disabled = iso < min
                  const selected = iso === value
                  const isToday = iso === todayISO
                  return (
                    <button
                      key={dayIndex}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onChange(iso)
                        setOpen(false)
                      }}
                      className={`rounded-lg py-1.5 text-sm ${
                        selected
                          ? 'bg-cookie-rust font-bold text-cookie-cream'
                          : isToday
                            ? 'font-bold text-cookie-rust'
                            : 'text-cookie-charcoal'
                      } ${disabled ? 'cursor-not-allowed opacity-30' : 'cursor-pointer hover:bg-cookie-cream'}`}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
