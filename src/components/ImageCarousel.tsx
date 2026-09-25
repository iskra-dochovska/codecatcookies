import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type CarouselImage = { src: string; alt: string; focalY?: number }

const AUTO_ADVANCE_MS = 4000
const SWIPE_THRESHOLD_PX = 40

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      {direction === 'left' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  )
}

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: CarouselImage[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}) {
  const touchStartX = useRef<number | null>(null)

  function goPrev() {
    onIndexChange((index - 1 + images.length) % images.length)
  }

  function goNext() {
    onIndexChange((index + 1) % images.length)
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
    if (delta < 0) goNext()
    else goPrev()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative">
        <img
          src={images[index].src}
          alt={images[index].alt}
          className="max-h-[calc(100vh-3rem)] max-w-[calc(100vw-3rem)] rounded-2xl object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                goPrev()
              }}
              aria-label="Previous image"
              className="absolute top-1/2 left-0 hidden h-11 w-11 -translate-x-[calc(100%+12px)] -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-cookie-cream hover:bg-black/60 sm:flex"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                goNext()
              }}
              aria-label="Next image"
              className="absolute top-1/2 right-0 hidden h-11 w-11 translate-x-[calc(100%+12px)] -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-cookie-cream hover:bg-black/60 sm:flex"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => onIndexChange(i)}
              aria-label={`Show image ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? 'bg-cookie-cream' : 'bg-cookie-cream/40'
              }`}
            />
          ))}
        </div>
      )}

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
  const count = images.length
  // Slide track is [lastClone, ...images, firstClone] when there's more than one
  // image, so wrapping past either end can animate forward/backward instead of
  // snapping back across the whole strip.
  const track = count > 1 ? [images[count - 1], ...images, images[0]] : images
  const [position, setPosition] = useState(1)
  const [instant, setInstant] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const touchStartX = useRef<number | null>(null)

  const activeIndex = count > 1 ? (((position - 1) % count) + count) % count : 0

  useEffect(() => {
    if (count < 2 || lightboxOpen) return
    const id = setInterval(() => setPosition((current) => current + 1), AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [count, lightboxOpen])

  useEffect(() => {
    if (!instant) return
    const raf = requestAnimationFrame(() => setInstant(false))
    return () => cancelAnimationFrame(raf)
  }, [instant])

  if (count === 0) {
    return (
      <div
        className={`flex items-center justify-center bg-cookie-charcoal/5 text-sm text-cookie-charcoal/50 ${className ?? ''}`}
      >
        Image
      </div>
    )
  }

  function goToIndex(nextIndex: number) {
    setPosition(nextIndex + 1)
  }

  function handleTransitionEnd() {
    if (count < 2) return
    if (position === 0) {
      setInstant(true)
      setPosition(count)
    } else if (position === count + 1) {
      setInstant(true)
      setPosition(1)
    }
  }

  function handleTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
    setPosition((current) => (delta < 0 ? current + 1 : current - 1))
  }

  return (
    <>
      <div
        className={`relative overflow-hidden bg-cookie-charcoal/5 ${className ?? ''}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className={`flex h-full w-full ${instant ? '' : 'transition-transform duration-500 ease-in-out'}`}
          style={{ transform: `translateX(-${position * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {track.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setLightboxOpen(true)}
              aria-label="View full image"
              className="h-full w-full flex-shrink-0"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={eagerFirst && i === 1 ? 'eager' : 'lazy'}
                fetchPriority={eagerFirst && i === 1 ? 'high' : 'low'}
                decoding="async"
                style={{ objectPosition: `center ${image.focalY ?? 50}%` }}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        {count > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((image, i) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goToIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-cookie-cream' : 'bg-cookie-cream/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          index={activeIndex}
          onIndexChange={goToIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}
