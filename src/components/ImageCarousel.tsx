import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type CarouselImage = { src: string; alt: string; focalY?: number }

const AUTO_ADVANCE_MS = 4000
const SWIPE_THRESHOLD_PX = 40

function Lightbox({ image, onClose }: { image: CarouselImage; onClose: () => void }) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="max-h-full max-w-full rounded-2xl object-contain"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-cookie-cream"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-7 w-7"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>,
    document.body,
  )
}

export function ImageCarousel({
  images,
  className,
  eagerFirst = false,
}: {
  images: CarouselImage[]
  className?: string
  eagerFirst?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    if (images.length < 2) return
    const id = setInterval(() => setIndex((current) => (current + 1) % images.length), AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [images.length])

  if (images.length === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-cookie-charcoal/5 text-sm text-cookie-charcoal/50 ${className ?? ''}`}
      >
        Image
      </div>
    )
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
    setIndex((current) =>
      delta < 0 ? (current + 1) % images.length : (current - 1 + images.length) % images.length,
    )
  }

  return (
    <>
      <div
        className={`relative overflow-hidden bg-cookie-charcoal/5 ${className ?? ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View full image"
              className="h-full w-full flex-shrink-0"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={eagerFirst && i === 0 ? 'eager' : 'lazy'}
                fetchPriority={eagerFirst && i === 0 ? 'high' : 'low'}
                decoding="async"
                style={{ objectPosition: `center ${image.focalY ?? 50}%` }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? 'bg-cookie-cream' : 'bg-cookie-cream/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && <Lightbox image={images[index]} onClose={() => setLightboxOpen(false)} />}
    </>
  )
}
