import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../../lib/supabaseClient'
import ConfirmModal from '../ConfirmModal'

type CookieOption = { slug: string; name: string }

type CookieImageRow = {
  id: string
  cookie_slug: string
  path: string
  position: number
  focal_y: number
}

const BUCKET = 'cookie-images'
const MAX_DIMENSION = 1200
const JPEG_QUALITY = 0.8

async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')
  ctx.drawImage(bitmap, 0, 0, width, height)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Compression failed'))),
      'image/jpeg',
      JPEG_QUALITY,
    )
  })
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  )
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

function ImageCard({
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
      className="flex w-48 cursor-grab flex-col gap-2 rounded-lg border border-cookie-charcoal/15 bg-white p-3 active:cursor-grabbing sm:w-56"
    >
      <div className="h-48 w-full flex-none overflow-hidden rounded-2xl bg-cookie-charcoal/5">
        <img
          src={image.path}
          alt=""
          className="h-full w-full object-cover"
          style={{ objectPosition: `center ${image.focal_y}%` }}
        />
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(image)}
          className="flex-1 rounded-full border border-cookie-charcoal/20 py-1 text-xs font-bold text-cookie-charcoal/60 uppercase hover:text-cookie-brown"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(image)}
          aria-label="Delete image"
          title="Delete"
          className="flex items-center justify-center rounded-full border border-cookie-charcoal/20 px-2.5 text-cookie-charcoal/60 hover:text-cookie-rust"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function ImagesTab() {
  const [cookies, setCookies] = useState<CookieOption[]>([])
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
      supabase.from('cookies').select('slug, name').order('name'),
      supabase
        .from('cookie_images')
        .select('id, cookie_slug, path, position, focal_y')
        .order('cookie_slug')
        .order('position'),
    ]).then(([cookiesResult, imagesResult]) => {
      setCookies((cookiesResult.data as CookieOption[] | null) ?? [])
      const grouped: Record<string, CookieImageRow[]> = {}
      for (const image of (imagesResult.data as CookieImageRow[] | null) ?? []) {
        grouped[image.cookie_slug] = [...(grouped[image.cookie_slug] ?? []), image]
      }
      setImagesByCookie(grouped)
      setLoading(false)
    })
  }, [])

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
    <div className="flex flex-col gap-8">
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
        cookies.map((cookie) => {
          const images = imagesByCookie[cookie.slug] ?? []
          return (
            <div key={cookie.slug} className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-cookie-brown uppercase">{cookie.name}</p>
                <button
                  type="button"
                  onClick={() => startUpload(cookie.slug)}
                  disabled={uploadingSlug === cookie.slug}
                  className="rounded-full bg-cookie-rust px-3 py-1 text-xs font-bold text-cookie-cream uppercase disabled:opacity-50"
                >
                  {uploadingSlug === cookie.slug ? 'Uploading...' : '+ Add image'}
                </button>
              </div>

              <div className="flex flex-wrap gap-3">
                {images.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    onEdit={setEditingImage}
                    onDelete={setConfirmDelete}
                    onDragStart={makeDragStart(cookie.slug)}
                    onDragOver={handleDragOver}
                    onDrop={makeDrop(cookie.slug)}
                  />
                ))}
                {images.length === 0 && (
                  <p className="text-sm text-cookie-charcoal/50">No images yet.</p>
                )}
              </div>
            </div>
          )
        })
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

export default ImagesTab
