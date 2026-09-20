import { useEffect, useState } from 'react'
import textLogo from '../../assets/codecatcookies_text_light.svg'
import logoMark from '../../assets/codecatcookies_logo.svg'
import { supabase } from '../../lib/supabaseClient'
import { useOrders } from './orders'
import OrdersTab from './tabs/OrdersTab'
import StatsTab from './tabs/StatsTab'
import DataTab from './tabs/DataTab'
import PromoCodesTab from './tabs/PromoCodesTab'

const TABS = ['orders', 'statistics', 'costs', 'promos'] as const
type Tab = (typeof TABS)[number]

function LogoutIcon() {
  return (
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => supabase.auth.signOut()}
      aria-label="Log out"
      title="Log out"
      className="text-cookie-cream transition-colors hover:text-cookie-honey"
    >
      <LogoutIcon />
    </button>
  )
}

function AdminDashboard() {
  const { orders, setOrders, loading } = useOrders()
  const [tab, setTab] = useState<Tab>('orders')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function selectTab(option: Tab) {
    setTab(option)
    setMenuOpen(false)
  }

  return (
    <div className="flex min-h-svh flex-1 flex-col bg-cookie-cream">
      <header
        className={`sticky top-0 z-40 w-full bg-cookie-brown transition-colors duration-300 ${
          scrolled ? 'sm:bg-cookie-brown/80 sm:backdrop-blur-md' : ''
        }`}
      >
        <div className="flex items-center justify-between px-10 py-4 sm:px-32">
          <img src={logoMark} alt="codecatcookies" className="h-9 sm:hidden" />
          <img src={textLogo} alt="codecatcookies" className="hidden h-5 sm:block" />

          <nav className="hidden items-center gap-3 sm:flex">
            {TABS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectTab(option)}
                className={`rounded-full px-4 py-1.5 text-sm font-extrabold uppercase transition-colors ${
                  tab === option
                    ? 'bg-cookie-cream text-cookie-charcoal'
                    : 'text-cookie-cream hover:bg-cookie-cream/20'
                }`}
              >
                {option}
              </button>
            ))}
            <LogoutButton />
          </nav>

          <div className="flex items-center gap-4 sm:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="text-cookie-cream"
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
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`fixed inset-0 z-50 sm:hidden ${menuOpen ? '' : 'pointer-events-none'}`}>
          <div
            onClick={() => setMenuOpen(false)}
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              menuOpen ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            className={`absolute top-0 right-0 flex h-full w-64 max-w-[80%] flex-col gap-8 bg-cookie-brown px-8 py-8 shadow-xl transition-transform duration-300 ${
              menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="self-end text-cookie-cream"
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

            <nav className="flex flex-col gap-3">
              {TABS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => selectTab(option)}
                  className={`rounded-full px-6 py-3 text-center text-lg font-semibold uppercase transition-colors ${
                    tab === option
                      ? 'bg-cookie-cream text-cookie-charcoal'
                      : 'bg-cookie-cream/10 text-cookie-cream hover:bg-cookie-cream/20'
                  }`}
                >
                  {option}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              aria-label="Log out"
              title="Log out"
              className="mt-auto flex items-center justify-center text-cookie-cream transition-colors hover:text-cookie-honey"
            >
              <LogoutIcon />
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-6 sm:px-10 sm:py-10">
        {loading ? (
          <p className="font-bold text-cookie-charcoal/60 uppercase">Loading...</p>
        ) : (
          <>
            {tab === 'orders' && <OrdersTab orders={orders} setOrders={setOrders} />}
            {tab === 'statistics' && <StatsTab orders={orders} />}
            {tab === 'costs' && <DataTab />}
            {tab === 'promos' && <PromoCodesTab />}
          </>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
