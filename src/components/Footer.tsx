import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'

function Footer() {
  const { lang } = useLanguage()

  return (
    <footer className="w-full border-t-4 border-cookie-honey bg-cookie-brown px-6 py-6 text-sm text-cookie-cream">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <a
            href="https://www.instagram.com/codecatcookies/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:underline"
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
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            codecatcookies
          </a>
          <a href="mailto:info@codecatcookies.com" className="flex items-center gap-2 hover:underline">
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
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            info@codecatcookies.com
          </a>
        </div>
        <span className="flex items-center gap-2 text-cookie-cream/70">
          &copy; {new Date().getFullYear()} codecatcookies. {t(ui, 'allRightsReserved', lang)}
          <a
            href="https://www.instagram.com/poison_grl/"
            target="_blank"
            rel="noopener noreferrer"
            title="Photos by @poison_grl"
            className="flex items-center gap-1 hover:text-cookie-cream hover:underline"
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
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            by @poison_grl
          </a>
        </span>
      </div>
    </footer>
  )
}

export default Footer
