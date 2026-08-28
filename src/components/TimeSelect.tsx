import { useEffect, useRef, useState } from 'react'
import { useClickOutside } from '../hooks/useClickOutside'

type TimeSelectProps = {
  value: string
  onChange: (value: string) => void
  options: string[]
  disabled: boolean
  placeholder: string
}

function TimeSelect({ value, onChange, options, disabled, placeholder }: TimeSelectProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useClickOutside(containerRef, () => setOpen(false), open)

  useEffect(() => {
    if (disabled) setOpen(false)
  }, [disabled])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2 text-left text-cookie-charcoal disabled:cursor-not-allowed disabled:opacity-50 ${
          open ? 'border-cookie-rust' : 'border-cookie-charcoal/20'
        }`}
      >
        <span className={value ? '' : 'text-cookie-charcoal/40'}>{value || placeholder}</span>
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
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && !disabled && (
        <div
          role="listbox"
          className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-cookie-charcoal/20 bg-white p-1 shadow-lg"
        >
          {options.map((slot) => (
            <button
              key={slot}
              type="button"
              role="option"
              aria-selected={slot === value}
              onClick={() => {
                onChange(slot)
                setOpen(false)
              }}
              className={`w-full cursor-pointer rounded-lg px-3 py-1.5 text-left text-sm ${
                slot === value
                  ? 'bg-cookie-rust font-bold text-cookie-cream'
                  : 'text-cookie-charcoal hover:bg-cookie-cream'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimeSelect
