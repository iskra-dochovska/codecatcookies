import { useCart } from '../cart/CartContext'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'

export function QuantityControls({ slug, className }: { slug: string; className?: string }) {
  const { lang } = useLanguage()
  const { items, increment, decrement } = useCart()
  const quantity = items[slug] ?? 0

  return (
    <div
      className={`items-center justify-center gap-3 rounded-full bg-cookie-rust px-3 py-1.5 text-cookie-cream ${className ?? 'flex'}`}
    >
      {quantity === 0 ? (
        <button
          type="button"
          onClick={() => increment(slug)}
          className="flex items-center gap-2 px-1 text-xs font-bold uppercase"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 flex-none"
            aria-hidden="true"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
          {t(ui, 'addToCart', lang)}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => decrement(slug)}
            aria-label="Decrease quantity"
            className="flex h-5 w-5 items-center justify-center text-lg font-bold"
          >
            −
          </button>
          <span className="w-4 text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            onClick={() => increment(slug)}
            aria-label="Increase quantity"
            className="flex h-5 w-5 items-center justify-center text-lg font-bold"
          >
            +
          </button>
        </div>
      )}
    </div>
  )
}
