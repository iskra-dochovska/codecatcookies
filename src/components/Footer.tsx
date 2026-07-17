function Footer() {
  return (
    <footer className="w-full bg-cookie-brown px-6 py-6 text-sm text-cookie-cream">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4">
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
        <span className="text-cookie-cream/70">
          &copy; {new Date().getFullYear()} codecatcookies. All rights reserved.
        </span>
      </div>
    </footer>
  )
}

export default Footer
