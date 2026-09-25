import { ImageCarousel } from './ImageCarousel'
import hero1 from '../assets/hero/hero-1.jpg'
import hero2 from '../assets/hero/hero-2.jpg'
import hero3 from '../assets/hero/hero-3.jpg'
import hero4 from '../assets/hero/hero-4.jpg'
import hero5 from '../assets/hero/hero-5.jpg'
import hero6 from '../assets/hero/hero-6.jpg'
import hero7 from '../assets/hero/hero-7.jpg'

const IMAGES = [hero1, hero2, hero3, hero4, hero5, hero6, hero7].map((src) => ({ src, alt: '' }))

function HeroCarousel() {
  return <ImageCarousel images={IMAGES} eagerFirst className="h-full w-full rounded-2xl" />
}

export default HeroCarousel
