import { useEffect, useRef, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { compressImage } from '../../../lib/imageCompression'
import { formatDen } from '../../../lib/format'
import ConfirmModal from '../ConfirmModal'

type MerchRow = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  height: string | null
  width: string | null
  position: number
  active: boolean
}

type MerchImageRow = {
  id: string
  merch_slug: string
  path: string
  position: number
}

const BUCKET = 'merch-images'

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
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

function EditIcon() {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
  )
}

type Draft = { name: string; description: string; price: string; height: string; width: string }

function MerchForm({
  draft,
  onChange,
  onSave,
  onCancel,
  imageFile,
  onImageChange,
  saving,
}: {
  draft: Draft
  onChange: (draft: Draft) => void
  onSave: () => void
  onCancel: () => void
  imageFile?: File | null
  onImageChange?: (file: File | null) => void
  saving?: boolean
}) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-cookie-charcoal/15 bg-cookie-honey/20 p-3">
      <input
        type="text"
        autoFocus
        placeholder="Name"
        value={draft.name}
        onChange={(event) => onChange({ ...draft, name: event.target.value })}
        className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
      />
      <textarea
        placeholder="Description"
        value={draft.description}
        onChange={(event) => onChange({ ...draft, description: event.target.value })}
        className="h-16 resize-none rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
      />
      <div className="flex gap-2">
        <input
          type="number"
          step="any"
          placeholder="Price"
          value={draft.price}
          onChange={(event) => onChange({ ...draft, price: event.target.value })}
          className="w-28 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
        />
        <input
          type="text"
          placeholder="Height in cm (optional)"
          value={draft.height}
          onChange={(event) => onChange({ ...draft, height: event.target.value })}
          className="w-32 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
        />
        <input
          type="text"
          placeholder="Width in cm (optional)"
          value={draft.width}
          onChange={(event) => onChange({ ...draft, width: event.target.value })}
          className="w-32 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
        />
      </div>
      {onImageChange && (
        <div className="flex items-center gap-3">
          {imageFile && (
            <img
              src={URL.createObjectURL(imageFile)}
              alt=""
              className="h-12 w-12 flex-none rounded-lg object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onImageChange(event.target.files?.[0] ?? null)}
            className="text-xs text-cookie-charcoal/70"
          />
        </div>
      )}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-cookie-charcoal/30 px-3 py-1 text-xs font-bold text-cookie-charcoal/70 uppercase"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-cookie-rust px-3 py-1 text-xs font-bold text-cookie-cream uppercase disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function ImageThumb({
  image,
  index,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  image: MerchImageRow
  index: number
  onDelete: (image: MerchImageRow) => void
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
      className="relative h-16 w-16 flex-none cursor-grab overflow-hidden rounded-lg border border-cookie-charcoal/15 bg-cookie-charcoal/5 active:cursor-grabbing"
    >
      <img src={image.path} alt="" className="h-full w-full object-cover" />
      <button
        type="button"
        onClick={() => onDelete(image)}
        aria-label="Delete image"
        title="Delete image"
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

function MerchTab() {
  const [items, setItems] = useState<MerchRow[]>([])
  const [imagesBySlug, setImagesBySlug] = useState<Record<string, MerchImageRow[]>>({})
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<Draft | null>(null)
  const [creatingImage, setCreatingImage] = useState<File | null>(null)
  const [creatingSaving, setCreatingSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<Draft | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<MerchRow | null>(null)
  const [confirmDeleteImage, setConfirmDeleteImage] = useState<MerchImageRow | null>(null)
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)
  const [error, setError] = useState('')
  const uploadTargetSlug = useRef<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('merch').select('*').order('position'),
      supabase.from('merch_images').select('id, merch_slug, path, position').order('merch_slug').order('position'),
    ]).then(([itemsResult, imagesResult]) => {
      setItems((itemsResult.data as MerchRow[] | null) ?? [])
      const grouped: Record<string, MerchImageRow[]> = {}
      for (const image of (imagesResult.data as MerchImageRow[] | null) ?? []) {
        grouped[image.merch_slug] = [...(grouped[image.merch_slug] ?? []), image]
      }
      setImagesBySlug(grouped)
      setLoading(false)
    })
  }, [])

  function uniqueSlug(name: string) {
    const base = slugify(name) || 'item'
    let candidate = base
    let suffix = 2
    while (items.some((item) => item.slug === candidate)) {
      candidate = `${base}-${suffix}`
      suffix += 1
    }
    return candidate
  }

  async function removeStoredImage(path: string) {
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl('')
    if (!path.startsWith(publicUrlData.publicUrl)) return
    const objectPath = path.slice(publicUrlData.publicUrl.length)
    await supabase.storage.from(BUCKET).remove([objectPath])
  }

  async function uploadImage(slug: string, file: File): Promise<MerchImageRow | null> {
    try {
      const blob = await compressImage(file)
      const objectPath = `${slug}/${crypto.randomUUID()}.jpg`
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, blob, { contentType: 'image/jpeg' })
      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath)
      const existing = imagesBySlug[slug] ?? []
      const nextPosition = existing.length === 0 ? 0 : Math.max(...existing.map((image) => image.position)) + 1

      const { data, error: insertError } = await supabase
        .from('merch_images')
        .insert({ merch_slug: slug, path: publicUrlData.publicUrl, position: nextPosition })
        .select()
        .single()
      if (insertError) throw insertError
      return data as MerchImageRow
    } catch {
      return null
    }
  }

  async function handleCreate() {
    if (!creating) return
    const parsedPrice = Number(creating.price)
    if (!creating.name.trim() || Number.isNaN(parsedPrice)) return
    setError('')
    setCreatingSaving(true)
    const nextPosition = items.length === 0 ? 0 : Math.max(...items.map((item) => item.position)) + 1
    const slug = uniqueSlug(creating.name)
    const { data, error: insertError } = await supabase
      .from('merch')
      .insert({
        slug,
        name: creating.name.trim(),
        description: creating.description.trim(),
        price: parsedPrice,
        height: creating.height.trim() || null,
        width: creating.width.trim() || null,
        position: nextPosition,
      })
      .select()
      .single()
    if (insertError || !data) {
      setError('Could not create merch item.')
      setCreatingSaving(false)
      return
    }
    setItems((prev) => [...prev, data as MerchRow])
    if (creatingImage) {
      const image = await uploadImage(slug, creatingImage)
      if (image) setImagesBySlug((prev) => ({ ...prev, [slug]: [image] }))
      else setError('Item created, but the image failed to upload - add it from the list below.')
    }
    setCreating(null)
    setCreatingImage(null)
    setCreatingSaving(false)
  }

  function startEdit(item: MerchRow) {
    setEditingId(item.id)
    setEditDraft({
      name: item.name,
      description: item.description,
      price: String(item.price),
      height: item.height ?? '',
      width: item.width ?? '',
    })
  }

  async function handleSaveEdit() {
    if (!editingId || !editDraft) return
    const parsedPrice = Number(editDraft.price)
    if (!editDraft.name.trim() || Number.isNaN(parsedPrice)) return
    const height = editDraft.height.trim() || null
    const width = editDraft.width.trim() || null
    const { error: updateError } = await supabase
      .from('merch')
      .update({
        name: editDraft.name.trim(),
        description: editDraft.description.trim(),
        price: parsedPrice,
        height,
        width,
      })
      .eq('id', editingId)
    if (!updateError) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: editDraft.name.trim(),
                description: editDraft.description.trim(),
                price: parsedPrice,
                height,
                width,
              }
            : item,
        ),
      )
    }
    setEditingId(null)
    setEditDraft(null)
  }

  async function toggleActive(item: MerchRow) {
    const { error: updateError } = await supabase
      .from('merch')
      .update({ active: !item.active })
      .eq('id', item.id)
    if (!updateError) {
      setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, active: !row.active } : row)))
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    const { error: deleteError } = await supabase.from('merch').delete().eq('id', confirmDelete.id)
    if (!deleteError) {
      setItems((prev) => prev.filter((item) => item.id !== confirmDelete.id))
      setImagesBySlug((prev) => {
        const next = { ...prev }
        delete next[confirmDelete.slug]
        return next
      })
    }
    setConfirmDelete(null)
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
    const image = await uploadImage(slug, file)
    if (image) {
      setImagesBySlug((prev) => ({ ...prev, [slug]: [...(prev[slug] ?? []), image] }))
    } else {
      setError('Could not upload image.')
    }
    setUploadingSlug(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleConfirmDeleteImage() {
    if (!confirmDeleteImage) return
    const { error: deleteError } = await supabase.from('merch_images').delete().eq('id', confirmDeleteImage.id)
    if (!deleteError) {
      await removeStoredImage(confirmDeleteImage.path)
      setImagesBySlug((prev) => ({
        ...prev,
        [confirmDeleteImage.merch_slug]: (prev[confirmDeleteImage.merch_slug] ?? []).filter(
          (image) => image.id !== confirmDeleteImage.id,
        ),
      }))
    }
    setConfirmDeleteImage(null)
  }

  async function reorder(slug: string, sourceIndex: number, targetIndex: number) {
    const current = imagesBySlug[slug] ?? []
    if (sourceIndex === targetIndex) return
    const next = [...current]
    const [moved] = next.splice(sourceIndex, 1)
    next.splice(targetIndex, 0, moved)
    const withPositions = next.map((image, index) => ({ ...image, position: index }))

    setImagesBySlug((prev) => ({ ...prev, [slug]: withPositions }))

    await Promise.all(
      withPositions.map((image) =>
        supabase.from('merch_images').update({ position: image.position }).eq('id', image.id),
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

  return (
    <div className="flex flex-col gap-4">
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

      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Merch</p>
        <button
          type="button"
          onClick={() => setCreating({ name: '', description: '', price: '', height: '', width: '' })}
          className="rounded-full bg-cookie-rust px-4 py-1.5 text-xs font-bold text-cookie-cream uppercase"
        >
          + Add merch item
        </button>
      </div>

      {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

      {creating && (
        <MerchForm
          draft={creating}
          onChange={setCreating}
          onSave={handleCreate}
          onCancel={() => {
            setCreating(null)
            setCreatingImage(null)
          }}
          imageFile={creatingImage}
          onImageChange={setCreatingImage}
          saving={creatingSaving}
        />
      )}

      {loading ? (
        <p className="font-bold text-cookie-charcoal/60 uppercase">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) =>
            editingId === item.id && editDraft ? (
              <MerchForm
                key={item.id}
                draft={editDraft}
                onChange={setEditDraft}
                onSave={handleSaveEdit}
                onCancel={() => {
                  setEditingId(null)
                  setEditDraft(null)
                }}
              />
            ) : (
              <div
                key={item.id}
                className={`flex flex-col gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-4 ${
                  item.active ? '' : 'opacity-50'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {(imagesBySlug[item.slug] ?? []).map((image, index) => (
                    <ImageThumb
                      key={image.id}
                      image={image}
                      index={index}
                      onDelete={setConfirmDeleteImage}
                      onDragStart={makeDragStart(item.slug)}
                      onDragOver={handleDragOver}
                      onDrop={makeDrop(item.slug)}
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => startUpload(item.slug)}
                    disabled={uploadingSlug === item.slug}
                    className="flex h-16 w-16 flex-none items-center justify-center rounded-lg border border-dashed border-cookie-charcoal/30 text-[11px] font-bold text-cookie-charcoal/50 uppercase disabled:opacity-50"
                  >
                    {uploadingSlug === item.slug ? '...' : '+ Add'}
                  </button>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-cookie-brown">{item.name}</p>
                    {(item.height || item.width) && (
                      <p className="text-xs font-bold text-cookie-charcoal/50">
                        {item.height && `H: ${item.height}`}
                        {item.height && item.width && '  '}
                        {item.width && `W: ${item.width}`}
                      </p>
                    )}
                    <p className="line-clamp-2 text-sm text-cookie-charcoal/60">{item.description}</p>
                    <p className="mt-1 font-mono text-sm font-bold text-cookie-charcoal/70">
                      {formatDen(item.price)} den
                    </p>
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    <label className="flex items-center gap-1.5 text-xs font-bold text-cookie-charcoal/60 uppercase">
                      <input type="checkbox" checked={item.active} onChange={() => toggleActive(item)} />
                      Active
                    </label>
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      aria-label="Edit merch item"
                      title="Edit"
                      className="text-cookie-charcoal/60 hover:text-cookie-brown"
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(item)}
                      aria-label="Delete merch item"
                      title="Delete"
                      className="text-cookie-charcoal/60 hover:text-cookie-rust"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
          {items.length === 0 && (
            <p className="rounded-lg border border-cookie-charcoal/15 bg-white px-4 py-6 text-sm text-cookie-charcoal/50">
              No merch items yet.
            </p>
          )}
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Delete <span className="font-bold text-cookie-brown">{confirmDelete.name}</span>? This
              can&apos;t be undone.
            </>
          }
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {confirmDeleteImage && (
        <ConfirmModal
          message="Delete this image? This can't be undone."
          onCancel={() => setConfirmDeleteImage(null)}
          onConfirm={handleConfirmDeleteImage}
        />
      )}
    </div>
  )
}

export default MerchTab
