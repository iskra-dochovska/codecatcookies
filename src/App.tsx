import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Cookies from './pages/Cookies'

function App() {
  return (
    <div className="flex min-h-svh flex-col bg-cookie-cream text-cookie-charcoal">
      <Header />

      <main className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App
