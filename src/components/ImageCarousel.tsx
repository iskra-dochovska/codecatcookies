import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
  const count = images.length
  const track = count > 1 ? [images[count - 1], ...images, images[0]] : images
  const [position, setPosition] = useState(count > 1 ? index + 1 : index)
  const [instant, setInstant] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [imageRect, setImageRect] = useState<{ left: number; right: number } | null>(null)
  const touchStartX = useRef<number | null>(null)
  const activeImageRef = useRef<HTMLImageElement | null>(null)

  function measureImage() {
    const rect = activeImageRef.current?.getBoundingClientRect()
    if (rect) setImageRect({ left: rect.left, right: rect.right })
  }

  useLayoutEffect(() => {
    measureImage()
  }, [])

  useEffect(() => {
    window.addEventListener('resize', measureImage)
    return () => window.removeEventListener('resize', measureImage)
  }, [])

  useEffect(() => {
    if (!instant) return
    const raf = requestAnimationFrame(() => setInstant(false))
    return () => cancelAnimationFrame(raf)
  }, [instant])

  function goToIndex(nextIndex: number) {
    if (nextIndex !== index) setIsTransitioning(true)
    setPosition(count > 1 ? nextIndex + 1 : nextIndex)
    onIndexChange(nextIndex)
  }

  function goPrev() {
    goToIndex((index - 1 + count) % count)
  }

  function goNext() {
    goToIndex((index + 1) % count)
  }

  function handleTransitionEnd() {
    measureImage()
    setIsTransitioning(false)
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
    if (isTransitioning || count < 2) return
    touchStartX.current = event.touches[0].clientX
    setIsDragging(true)
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    setDragOffsetPx(event.touches[0].clientX - touchStartX.current)
  }

  function endDrag() {
    touchStartX.current = null
    setIsDragging(false)
    setDragOffsetPx(0)
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    endDrag()
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
    if (delta < 0) goNext()
    else goPrev()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/80"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={endDrag}
    >
      <div
        className={`flex h-full w-full ${instant || isDragging ? '' : 'transition-transform duration-500 ease-in-out'}`}
        style={{ transform: `translateX(calc(-${position * 100}% + ${dragOffsetPx}px))` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {track.map((image, i) => (
          <div key={i} className="flex h-full w-full flex-shrink-0 items-center justify-center p-6">
            <img
              ref={i === position ? activeImageRef : undefined}
              onLoad={i === position ? measureImage : undefined}
              src={image.src}
              alt={image.alt}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
          </div>
        ))}
      </div>

      {count > 1 && imageRect && !isDragging && !isTransitioning && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              goPrev()
            }}
            aria-label="Previous image"
            style={{ left: imageRect.left - 56 }}
            className="absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-cookie-cream hover:bg-black/60 sm:flex"
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
            style={{ left: imageRect.right + 12 }}
            className="absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-cookie-cream hover:bg-black/60 sm:flex"
          >
            <ChevronIcon direction="right" />
          </button>
        </>
      )}

      {count > 1 && (
        <div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => goToIndex(i)}
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
  const [position, setPosition] = useState(count > 1 ? 1 : 0)
  const [instant, setInstant] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [dragOffsetPx, setDragOffsetPx] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isPageVisible, setIsPageVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )
  const touchStartX = useRef<number | null>(null)

  const activeIndex = count > 1 ? (((position - 1) % count) + count) % count : 0

  useEffect(() => {
    function handleVisibilityChange() {
      setIsPageVisible(document.visibilityState === 'visible')
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    if (count < 2 || lightboxOpen || isDragging || hasInteracted || !isPageVisible) return
    const id = setInterval(() => {
      setIsTransitioning(true)
      setPosition((current) => current + 1)
    }, AUTO_ADVANCE_MS)
    return () => clearInterval(id)
  }, [count, lightboxOpen, isDragging, hasInteracted, isPageVisible])

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
    if (isTransitioning) return
    setHasInteracted(true)
    const nextPosition = count > 1 ? nextIndex + 1 : nextIndex
    if (nextPosition !== position) setIsTransitioning(true)
    setPosition(nextPosition)
  }

  function handleTransitionEnd() {
    setIsTransitioning(false)
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
    if (isTransitioning || count < 2) return
    touchStartX.current = event.touches[0].clientX
    setIsDragging(true)
    setHasInteracted(true)
  }

  function handleTouchMove(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    setDragOffsetPx(event.touches[0].clientX - touchStartX.current)
  }

  function endDrag() {
    touchStartX.current = null
    setIsDragging(false)
    setDragOffsetPx(0)
  }

  function handleTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return
    const delta = event.changedTouches[0].clientX - touchStartX.current
    endDrag()
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return
    setIsTransitioning(true)
    setPosition((current) => (delta < 0 ? current + 1 : current - 1))
  }

  return (
    <>
      <div
        className={`relative overflow-hidden bg-cookie-charcoal/5 ${className ?? ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={endDrag}
      >
        <div
          className={`flex h-full w-full ${instant || isDragging ? '' : 'transition-transform duration-500 ease-in-out'}`}
          style={{ transform: `translateX(calc(-${position * 100}% + ${dragOffsetPx}px))` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {track.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setHasInteracted(true)
                setLightboxOpen(true)
              }}
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
