import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../../lib/supabaseClient'
import { compressImage } from '../../../lib/imageCompression'
import { FramedSection } from '../../../components/CookieDecor'
import { ImageCarousel, type CarouselImage } from '../../../components/ImageCarousel'
import ConfirmModal from '../ConfirmModal'

type ScaleLabel = 'Sweetness' | 'Chewiness' | 'Thickness'

const SCALE_LABELS: ScaleLabel[] = ['Sweetness', 'Chewiness', 'Thickness']

type Scale = { label: string; value: number }

type CookieRow = {
  slug: string
  name: string
  price: number
  tagline_en: string
  tagline_mk: string
  purchasable: boolean
  scales: Scale[]
}

type CookiePatch = Partial<Pick<CookieRow, 'name' | 'price' | 'tagline_en' | 'tagline_mk' | 'purchasable' | 'scales'>>

type CookieImageRow = {
  id: string
  cookie_slug: string
  path: string
  position: number
  focal_y: number
}

const BUCKET = 'cookie-images'

function scalesToValues(scales: Scale[]): Record<ScaleLabel, number> {
  const byLabel = new Map(scales.map((scale) => [scale.label, scale.value]))
  return {
    Sweetness: byLabel.get('Sweetness') ?? 0,
    Chewiness: byLabel.get('Chewiness') ?? 0,
    Thickness: byLabel.get('Thickness') ?? 0,
  }
}

function withScale(cookie: CookieRow, label: ScaleLabel, value: number): Scale[] {
  const values = scalesToValues(cookie.scales)
  values[label] = value
  return SCALE_LABELS.map((l) => ({ label: l, value: values[l] }))
}

function FocalPointEditor({
  image,
  onSave,
  onClose,
}: {
  image: CookieImageRow
  onSave: (focalY: number) => void
  onClose: () => void
}) {
  const [focalY, setFocalY] = useState(image.focal_y)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const lastClientY = useRef(0)

  function handlePointerDown(event: React.PointerEvent) {
    dragging.current = true
    lastClientY.current = event.clientY
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: React.PointerEvent) {
    if (!dragging.current || !containerRef.current) return
    const deltaY = event.clientY - lastClientY.current
    lastClientY.current = event.clientY
    const containerHeight = containerRef.current.clientHeight
    const percentDelta = (deltaY / containerHeight) * 100
    setFocalY((current) => Math.min(100, Math.max(0, current - percentDelta)))
  }

  function handlePointerUp() {
    dragging.current = false
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={onClose}>
      <div
        className="flex flex-col items-center gap-3 rounded-lg bg-white p-4"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="h-64 w-64 touch-none overflow-hidden rounded-2xl bg-cookie-charcoal/5 sm:h-80 sm:w-80"
        >
          <img
            src={image.path}
            alt=""
            draggable={false}
            className="h-full w-full cursor-ns-resize select-none object-cover"
            style={{ objectPosition: `center ${focalY}%` }}
          />
        </div>
        <p className="text-xs text-cookie-charcoal/50">Drag up or down to reposition</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-cookie-charcoal/30 px-4 py-1.5 text-xs font-bold text-cookie-charcoal/70 uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(Math.round(focalY))}
            className="rounded-full bg-cookie-rust px-4 py-1.5 text-xs font-bold text-cookie-cream uppercase"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function ImageThumb({
  image,
  index,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  image: CookieImageRow
  index: number
  onEdit: (image: CookieImageRow) => void
  onDelete: (image: CookieImageRow) => void
  onDragStart: (event: React.DragEvent, index: number) => void
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent, index: number) => void
}) {
  return (
    <div
      draggable
      onDragStart={(event) => onDragStart(event, index)}
      onDragOver={onDragOver}
      onDrop={(event) => onDrop(event, index)}
      className="relative h-16 w-16 flex-none cursor-grab overflow-hidden rounded-lg border border-cookie-charcoal/15 bg-white active:cursor-grabbing"
    >
      <button
        type="button"
        onClick={() => onEdit(image)}
        aria-label="Reposition image"
        title="Reposition"
        className="block h-full w-full"
      >
        <img
          src={image.path}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: `center ${image.focal_y}%` }}
        />
      </button>
      <button
        type="button"
        onClick={() => onDelete(image)}
        aria-label="Delete image"
        title="Delete"
        className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/60 text-white"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-2.5 w-2.5"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}

function ScaleEditor({
  values,
  onSetValue,
}: {
  values: Record<ScaleLabel, number>
  onSetValue: (label: ScaleLabel, value: number) => void
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      {SCALE_LABELS.map((label) => {
        const filled = values[label]
        return (
          <div key={label} className="flex flex-col items-center gap-1 sm:items-start">
            <span className="text-xs font-bold text-cookie-brown uppercase">{label}</span>
            <div className="flex h-3.5 w-full gap-0.5 rounded-full bg-cookie-charcoal/10 p-0.5 sm:w-52">
              {[1, 2, 3, 4, 5].map((segment) => (
                <button
                  key={segment}
                  type="button"
                  onClick={() => onSetValue(label, segment === filled ? segment - 1 : segment)}
                  aria-label={`Set ${label} to ${segment}`}
                  className={`flex-1 rounded-full ${
                    segment <= filled ? 'bg-cookie-rust' : 'bg-transparent hover:bg-cookie-charcoal/20'
                  }`}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CookieCard({
  cookie,
  images,
  uploading,
  onUpdate,
  onStartUpload,
  onEditImage,
  onDeleteImage,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  cookie: CookieRow
  images: CookieImageRow[]
  uploading: boolean
  onUpdate: (patch: CookiePatch) => void
  onStartUpload: () => void
  onEditImage: (image: CookieImageRow) => void
  onDeleteImage: (image: CookieImageRow) => void
  onDragStart: (event: React.DragEvent, index: number) => void
  onDragOver: (event: React.DragEvent) => void
  onDrop: (event: React.DragEvent, index: number) => void
}) {
  const [name, setName] = useState(cookie.name)
  const [price, setPrice] = useState(String(cookie.price))
  const [taglineEn, setTaglineEn] = useState(cookie.tagline_en)
  const [taglineMk, setTaglineMk] = useState(cookie.tagline_mk)

  const carouselImages: CarouselImage[] = images.map((image) => ({
    src: image.path,
    alt: cookie.name,
    focalY: image.focal_y,
  }))
  const scaleValues = scalesToValues(cookie.scales)

  function commitName() {
    const trimmed = name.trim()
    if (!trimmed) {
      setName(cookie.name)
      return
    }
    if (trimmed !== cookie.name) onUpdate({ name: trimmed })
  }

  function commitPrice() {
    const parsed = Number(price)
    if (!Number.isFinite(parsed)) {
      setPrice(String(cookie.price))
      return
    }
    if (parsed !== cookie.price) onUpdate({ price: parsed })
  }

  function commitTaglineEn() {
    const trimmed = taglineEn.trim()
    if (trimmed !== cookie.tagline_en) onUpdate({ tagline_en: trimmed })
  }

  function commitTaglineMk() {
    const trimmed = taglineMk.trim()
    if (trimmed !== cookie.tagline_mk) onUpdate({ tagline_mk: trimmed })
  }

  return (
    <FramedSection className={`flex flex-col gap-6 ${cookie.purchasable ? '' : 'opacity-50'}`}>
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-[14rem_1fr] sm:gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="relative h-48 w-48 flex-none rounded-2xl sm:w-56">
            <ImageCarousel images={carouselImages} className="h-full w-full rounded-2xl" />
            <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-cookie-rust px-2 py-1 font-mono text-xs font-bold text-cookie-cream">
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                onBlur={commitPrice}
                className="w-9 bg-transparent text-right outline-none"
              />
              den
            </div>
          </div>
          <label className="flex items-center gap-1.5 text-xs font-bold text-cookie-charcoal/50 uppercase">
            <input
              type="checkbox"
              checked={cookie.purchasable}
              onChange={(event) => onUpdate({ purchasable: event.target.checked })}
            />
            Visible on site
          </label>
        </div>

        <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onBlur={commitName}
            placeholder="Name"
            className="w-full bg-transparent text-center text-2xl font-black text-cookie-brown uppercase outline-none sm:text-left"
          />
          <div className="flex w-56 flex-col items-center gap-3 sm:w-auto sm:items-start">
            <div className="flex w-full items-center gap-2">
              <span className="text-[10px] font-bold text-cookie-charcoal/40 uppercase">En</span>
              <input
                type="text"
                value={taglineEn}
                onChange={(event) => setTaglineEn(event.target.value)}
                onBlur={commitTaglineEn}
                placeholder="Description (English)"
                className="flex-1 rounded-full border border-cookie-rust bg-cookie-cream px-3 py-1 text-center font-mono text-xs font-bold text-cookie-rust outline-none sm:text-left"
              />
            </div>
            <div className="flex w-full items-center gap-2">
              <span className="text-[10px] font-bold text-cookie-charcoal/40 uppercase">Mk</span>
              <input
                type="text"
                value={taglineMk}
                onChange={(event) => setTaglineMk(event.target.value)}
                onBlur={commitTaglineMk}
                placeholder="Description (Macedonian)"
                className="flex-1 rounded-full border border-cookie-rust bg-cookie-cream px-3 py-1 text-center font-mono text-xs font-bold text-cookie-rust outline-none sm:text-left"
              />
            </div>
            <ScaleEditor values={scaleValues} onSetValue={(label, value) => onUpdate({ scales: withScale(cookie, label, value) })} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {images.map((image, index) => (
          <ImageThumb
            key={image.id}
            image={image}
            index={index}
            onEdit={onEditImage}
            onDelete={onDeleteImage}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
        <button
          type="button"
          onClick={onStartUpload}
          disabled={uploading}
          className="flex h-16 w-16 flex-none items-center justify-center rounded-lg border border-dashed border-cookie-charcoal/30 text-[11px] font-bold text-cookie-charcoal/50 uppercase disabled:opacity-50"
        >
          {uploading ? '...' : '+ Add'}
        </button>
      </div>
    </FramedSection>
  )
}

function CookieCardsTab() {
  const [cookies, setCookies] = useState<CookieRow[]>([])
  const [imagesByCookie, setImagesByCookie] = useState<Record<string, CookieImageRow[]>>({})
  const [loading, setLoading] = useState(true)
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<CookieImageRow | null>(null)
  const [editingImage, setEditingImage] = useState<CookieImageRow | null>(null)
  const uploadTargetSlug = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('cookies').select('slug, name, price, tagline_en, tagline_mk, purchasable, scales').order('name'),
      supabase
        .from('cookie_images')
        .select('id, cookie_slug, path, position, focal_y')
        .order('cookie_slug')
        .order('position'),
    ]).then(([cookiesResult, imagesResult]) => {
      setCookies((cookiesResult.data as CookieRow[] | null) ?? [])
      const grouped: Record<string, CookieImageRow[]> = {}
      for (const image of (imagesResult.data as CookieImageRow[] | null) ?? []) {
        grouped[image.cookie_slug] = [...(grouped[image.cookie_slug] ?? []), image]
      }
      setImagesByCookie(grouped)
      setLoading(false)
    })
  }, [])

  async function updateCookie(slug: string, patch: CookiePatch) {
    const { error: updateError } = await supabase.from('cookies').update(patch).eq('slug', slug)
    if (!updateError) {
      setCookies((prev) => prev.map((cookie) => (cookie.slug === slug ? { ...cookie, ...patch } : cookie)))
    } else {
      setError('Could not save cookie card.')
    }
  }

  function startUpload(slug: string) {
    uploadTargetSlug.current = slug
    fileInputRef.current?.click()
  }

  async function handleFileSelected(file: File) {
    const slug = uploadTargetSlug.current
    if (!slug) return
    setError('')
    setUploadingSlug(slug)
    try {
      const blob = await compressImage(file)
      const objectPath = `${slug}/${crypto.randomUUID()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, blob, { contentType: 'image/jpeg' })
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
      const existing = imagesByCookie[slug] ?? []
      const nextPosition = existing.length === 0 ? 0 : Math.max(...existing.map((image) => image.position)) + 1

      const { data, error: insertError } = await supabase
        .from('cookie_images')
        .insert({
          cookie_slug: slug,
          path: publicUrlData.publicUrl,
          position: nextPosition,
          focal_y: 50,
        })
        .select()
        .single()
      if (insertError) throw insertError

      setImagesByCookie((prev) => ({ ...prev, [slug]: [...(prev[slug] ?? []), data as CookieImageRow] }))
    } catch {
      setError('Could not upload image.')
    } finally {
      setUploadingSlug(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSaveFocalY(image: CookieImageRow, focalY: number) {
    setEditingImage(null)
    const { error: updateError } = await supabase
      .from('cookie_images')
      .update({ focal_y: focalY })
      .eq('id', image.id)
    if (!updateError) {
      setImagesByCookie((prev) => ({
        ...prev,
        [image.cookie_slug]: (prev[image.cookie_slug] ?? []).map((row) =>
          row.id === image.id ? { ...row, focal_y: focalY } : row,
        ),
      }))
    }
  }

  async function reorder(slug: string, sourceIndex: number, targetIndex: number) {
    const current = imagesByCookie[slug] ?? []
    if (sourceIndex === targetIndex) return
    const next = [...current]
    const [moved] = next.splice(sourceIndex, 1)
    next.splice(targetIndex, 0, moved)
    const withPositions = next.map((image, index) => ({ ...image, position: index }))

    setImagesByCookie((prev) => ({ ...prev, [slug]: withPositions }))

    await Promise.all(
      withPositions.map((image) =>
        supabase.from('cookie_images').update({ position: image.position }).eq('id', image.id),
      ),
    )
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault()
  }

  function makeDragStart(slug: string) {
    return (event: React.DragEvent, index: number) => {
      event.dataTransfer.setData('text/plain', JSON.stringify({ slug, index }))
      event.dataTransfer.effectAllowed = 'move'
    }
  }

  function makeDrop(slug: string) {
    return (event: React.DragEvent, targetIndex: number) => {
      event.preventDefault()
      const raw = event.dataTransfer.getData('text/plain')
      if (!raw) return
      const parsed = JSON.parse(raw) as { slug: string; index: number }
      if (parsed.slug !== slug) return
      reorder(slug, parsed.index, targetIndex)
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    const { error: deleteError } = await supabase
      .from('cookie_images')
      .delete()
      .eq('id', confirmDelete.id)
    if (!deleteError) {
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl('')
      if (confirmDelete.path.startsWith(publicUrlData.publicUrl)) {
        const objectPath = confirmDelete.path.slice(publicUrlData.publicUrl.length)
        await supabase.storage.from(BUCKET).remove([objectPath])
      }
      setImagesByCookie((prev) => ({
        ...prev,
        [confirmDelete.cookie_slug]: (prev[confirmDelete.cookie_slug] ?? []).filter(
          (image) => image.id !== confirmDelete.id,
        ),
      }))
    }
    setConfirmDelete(null)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-12">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) handleFileSelected(file)
        }}
      />

      {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

      {loading ? (
        <p className="font-bold text-cookie-charcoal/60 uppercase">Loading...</p>
      ) : (
        cookies.map((cookie) => (
          <CookieCard
            key={cookie.slug}
            cookie={cookie}
            images={imagesByCookie[cookie.slug] ?? []}
            uploading={uploadingSlug === cookie.slug}
            onUpdate={(patch) => updateCookie(cookie.slug, patch)}
            onStartUpload={() => startUpload(cookie.slug)}
            onEditImage={setEditingImage}
            onDeleteImage={setConfirmDelete}
            onDragStart={makeDragStart(cookie.slug)}
            onDragOver={handleDragOver}
            onDrop={makeDrop(cookie.slug)}
          />
        ))
      )}

      {confirmDelete && (
        <ConfirmModal
          message="Delete this image? This can't be undone."
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {editingImage && (
        <FocalPointEditor
          image={editingImage}
          onSave={(focalY) => handleSaveFocalY(editingImage, focalY)}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  )
}

export default CookieCardsTab
