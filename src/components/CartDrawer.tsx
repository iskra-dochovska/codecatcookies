import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { useCookies } from '../data/CookiesContext'
import { useMerch } from '../data/MerchContext'
import { MIN_CHECKOUT_ITEMS, useCart } from '../cart/CartContext'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'

type CartLine = { slug: string; name: string; price: number; quantity: number }

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, increment, decrement, remove } = useCart()
  const { cookies } = useCookies()
  const { merch } = useMerch()
  const { lang } = useLanguage()

  const cookieLines: CartLine[] = Object.entries(items).flatMap(([slug, quantity]) => {
    const cookie = cookies.find((c) => c.slug === slug)
    return cookie ? [{ slug, name: cookie.name, price: cookie.price, quantity }] : []
  })
  const merchLines: CartLine[] = Object.entries(items).flatMap(([slug, quantity]) => {
    const merchItem = merch.find((m) => m.slug === slug)
    return merchItem ? [{ slug, name: merchItem.name, price: merchItem.price, quantity }] : []
  })
  const lines = [...cookieLines, ...merchLines]

  const cookieCount = cookieLines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)

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
              {lines.map((line) => (
                <div key={line.slug} className="flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-cookie-brown">{line.name}</span>
                    <span className="font-mono text-xs text-cookie-charcoal/60">
                      {line.price} {t(ui, 'currency', lang)} x {line.quantity}
                    </span>
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    <div className="flex items-center gap-2 rounded-full bg-cookie-rust px-2 py-1 text-cookie-cream">
                      <button
                        type="button"
                        onClick={() => decrement(line.slug)}
                        aria-label={`Decrease ${line.name} quantity`}
                        className="flex h-6 w-6 items-center justify-center text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-bold">{line.quantity}</span>
                      <button
                        type="button"
                        onClick={() => increment(line.slug)}
                        aria-label={`Increase ${line.name} quantity`}
                        className="flex h-6 w-6 items-center justify-center text-lg font-bold"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.slug)}
                      aria-label={`Remove ${line.name} from cart`}
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
                <span className="font-bold text-cookie-brown">{cookieCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cookie-charcoal/70">{t(ui, 'total', lang)}</span>
                <span className="font-bold text-cookie-brown">
                  {total} {t(ui, 'currency', lang)}
                </span>
              </div>
            </div>

            {cookieCount >= MIN_CHECKOUT_ITEMS ? (
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
                  String(MIN_CHECKOUT_ITEMS - cookieCount),
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
