import { useEffect, useState } from 'react'
import hero1 from '../assets/hero/hero-1.jpg'
import hero2 from '../assets/hero/hero-2.jpg'
import hero3 from '../assets/hero/hero-3.jpg'
import hero4 from '../assets/hero/hero-4.jpg'
import hero5 from '../assets/hero/hero-5.jpg'
import hero6 from '../assets/hero/hero-6.jpg'
import hero7 from '../assets/hero/hero-7.jpg'

const IMAGES = [hero1, hero2, hero3, hero4, hero5, hero6, hero7]
const INTERVAL_MS = 4000

function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((index) => (index + 1) % IMAGES.length)
    }, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      {IMAGES.map((src, index) => (
        <img
          key={src}
          src={src}
          alt=""
          loading={index === 0 ? 'eager' : 'lazy'}
          fetchPriority={index === 0 ? 'high' : 'low'}
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}

export default HeroCarousel
