import { ImageCarousel, type CarouselImage } from './ImageCarousel'
import { QuantityControls } from './QuantityControls'
import type { Merch } from '../data/MerchContext'
import { useLanguage } from '../i18n/LanguageContext'
import { t, ui } from '../i18n/translations'

export function MerchCard({ merch }: { merch: Merch }) {
  const { lang } = useLanguage()
  const images: CarouselImage[] = merch.images.map((image) => ({ src: image.src, alt: merch.name }))

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white">
      <div className="relative aspect-square w-full flex-none">
        <ImageCarousel images={images} className="h-full w-full" />
        <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-cookie-rust px-2.5 py-1 font-mono text-sm font-bold text-cookie-cream">
          {merch.price} {t(ui, 'currency', lang)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-lg font-black text-cookie-brown uppercase">{merch.name}</h2>
        {(merch.height || merch.width) && (
          <p className="text-xs font-bold text-cookie-charcoal/60 italic">
            {merch.height && `H: ${merch.height} cm`}
            {merch.height && merch.width && '  '}
            {merch.width && `W: ${merch.width} cm`}
          </p>
        )}
        <p className="flex-1 text-sm text-cookie-charcoal/70">{merch.description}</p>
        <QuantityControls slug={merch.slug} className="self-start" />
      </div>
    </div>
  )
}
