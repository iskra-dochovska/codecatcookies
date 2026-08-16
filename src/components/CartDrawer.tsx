import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { cookies } from '../data/cookies'
import { MIN_CHECKOUT_ITEMS, useCart } from '../cart/CartContext'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, increment, decrement, remove, totalCount } = useCart()
  const { lang } = useLanguage()

  const lines = Object.entries(items).flatMap(([slug, quantity]) => {
    const cookie = cookies.find((c) => c.slug === slug)
    return cookie ? [{ cookie, quantity }] : []
  })

  const total = lines.reduce((sum, line) => sum + line.cookie.price * line.quantity, 0)

  return createPortal(
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute top-0 right-0 flex h-full w-80 max-w-[85%] flex-col gap-6 bg-cookie-cream px-6 py-8 shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-cookie-brown uppercase">
            {t(ui, 'yourCart', lang)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="text-cookie-charcoal"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="text-sm text-cookie-charcoal/60">
            {t(ui, 'emptyCartMessage', lang)}
          </p>
        ) : (
          <>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
              {lines.map(({ cookie, quantity }) => (
                <div key={cookie.slug} className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-cookie-brown">{cookie.name}</span>
                    <span className="font-mono text-xs text-cookie-charcoal/60">
                      {cookie.price} {t(ui, 'currency', lang)} x {quantity}
                    </span>
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-cookie-rust px-2 py-1 text-cookie-cream">
                      <button
                        type="button"
                        onClick={() => decrement(cookie.slug)}
                        aria-label={`Decrease ${cookie.name} quantity`}
                        className="flex h-6 w-6 items-center justify-center text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-bold">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => increment(cookie.slug)}
                        aria-label={`Increase ${cookie.name} quantity`}
                        className="flex h-6 w-6 items-center justify-center text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(cookie.slug)}
                      aria-label={`Remove ${cookie.name} from cart`}
                      className="text-cookie-charcoal/50"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1 border-t-2 border-dashed border-cookie-charcoal/30 pt-4 font-mono text-sm">
              <div className="flex items-center justify-between">
                <span className="text-cookie-charcoal/70">{t(ui, 'cookiesCountLabel', lang)}</span>
                <span className="font-bold text-cookie-brown">{totalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cookie-charcoal/70">{t(ui, 'total', lang)}</span>
                <span className="font-bold text-cookie-brown">
                  {total} {t(ui, 'currency', lang)}
                </span>
              </div>
            </div>

            {totalCount >= MIN_CHECKOUT_ITEMS ? (
              <Link
                to="/checkout"
                onClick={onClose}
                className="rounded-full bg-cookie-rust px-4 py-2 text-center text-sm font-bold text-cookie-cream uppercase"
              >
                {t(ui, 'checkout', lang)}
              </Link>
            ) : (
              <p className="text-center text-xs font-bold text-cookie-charcoal/60 uppercase">
                {t(ui, 'checkoutMinNotice', lang).replace(
                  '{n}',
                  String(MIN_CHECKOUT_ITEMS - totalCount),
                )}
              </p>
            )}
          </>
        )}
      </div>
    </div>,
    document.body,
  )
}
