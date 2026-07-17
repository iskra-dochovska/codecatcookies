import { Link } from 'react-router-dom'
import textLogo from '../assets/codecatcookies_text.svg'

function Header() {
  return (
    <header className="flex w-full items-center justify-between bg-cookie-brown px-8 py-4 sm:px-20">
      <Link to="/">
        <img src={textLogo} alt="codecatcookies" className="h-5" />
      </Link>
      <nav>
        <Link
          to="/about"
          className="text-sm font-semibold text-cookie-cream hover:underline"
        >
          About us
        </Link>
      </nav>
    </header>
  )
}

export default Header
