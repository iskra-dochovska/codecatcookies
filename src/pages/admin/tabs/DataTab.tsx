import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { formatDen } from '../../../lib/format'
import ConfirmModal from '../ConfirmModal'

type CookieCostRow = {
  slug: string
  name: string
  price: number
  production_cost: number
}

type IngredientUnit = 'gram' | 'item'

type Ingredient = {
  id: string
  name: string
  unit: IngredientUnit
  price_per_unit: number
}

type PackagingItem = {
  id: string
  name: string
  price: number
}

function CookiesSection({ cookies, loading }: { cookies: CookieCostRow[]; loading: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-4">
      <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Cookies</p>
      {loading ? (
        <p className="font-bold text-cookie-charcoal/60 uppercase">Loading...</p>
      ) : (
        <div className="max-h-80 overflow-auto rounded-lg border border-cookie-charcoal/10">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="sticky top-0 bg-cookie-brown text-[11px] font-bold text-cookie-cream uppercase">
                <th className="px-2 py-1.5">Cookie</th>
                <th className="px-2 py-1.5">Price</th>
                <th className="px-2 py-1.5">Prod. cost</th>
              </tr>
            </thead>
            <tbody>
              {cookies.map((cookie, index) => (
                <tr key={cookie.slug} className={index % 2 === 1 ? 'bg-cookie-cream/50' : ''}>
                  <td className="px-2 py-1.5 font-bold text-cookie-brown">{cookie.name}</td>
                  <td className="px-2 py-1.5 font-mono text-cookie-charcoal/70">
                    {formatDen(cookie.price)} den
                  </td>
                  <td className="px-2 py-1.5 font-mono text-cookie-charcoal/70">
                    {formatDen(cookie.production_cost)} den
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

type IngredientDraft = { name: string; unit: IngredientUnit; price: string }

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

function IngredientsSection({
  ingredients,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: {
  ingredients: Ingredient[]
  loading: boolean
  onAdd: (name: string, unit: IngredientUnit, pricePerUnit: number) => Promise<void>
  onEdit: (id: string, name: string, unit: IngredientUnit, pricePerUnit: number) => Promise<void>
  onDelete: (id: string) => Promise<string | null>
}) {
  const [draft, setDraft] = useState<IngredientDraft | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<IngredientDraft | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Ingredient | null>(null)
  const [error, setError] = useState('')

  async function handleConfirmDraft() {
    if (!draft) return
    const parsed = Number(draft.price)
    if (!draft.name.trim() || Number.isNaN(parsed)) return
    await onAdd(draft.name.trim(), draft.unit, parsed)
    setDraft(null)
  }

  function startEdit(ingredient: Ingredient) {
    setEditingId(ingredient.id)
    setEditDraft({
      name: ingredient.name,
      unit: ingredient.unit,
      price: String(ingredient.price_per_unit),
    })
  }

  async function handleConfirmEdit() {
    if (!editingId || !editDraft) return
    const parsed = Number(editDraft.price)
    if (!editDraft.name.trim() || Number.isNaN(parsed)) return
    await onEdit(editingId, editDraft.name.trim(), editDraft.unit, parsed)
    setEditingId(null)
    setEditDraft(null)
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    setError('')
    const message = await onDelete(confirmDelete.id)
    if (message) setError(message)
    setConfirmDelete(null)
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Ingredients</p>
        <button
          type="button"
          onClick={() => setDraft({ name: '', unit: 'gram', price: '' })}
          aria-label="Add ingredient"
          title="Add ingredient"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

      <div className="hidden max-h-96 overflow-auto rounded-lg border border-cookie-charcoal/10 sm:block">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="sticky top-0 bg-cookie-brown text-xs font-bold text-cookie-cream uppercase">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Priced per</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {draft && (
              <tr className="bg-cookie-honey/30">
                <td className="px-3 py-1.5">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Name"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    className="w-full rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <select
                    value={draft.unit}
                    onChange={(event) =>
                      setDraft({ ...draft, unit: event.target.value as IngredientUnit })
                    }
                    className="rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                  >
                    <option value="gram">Gram</option>
                    <option value="item">Item</option>
                  </select>
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    step="any"
                    placeholder="Price"
                    value={draft.price}
                    onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                    className="w-24 rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDraft}
                      aria-label="Confirm new ingredient"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft(null)}
                      aria-label="Cancel"
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {ingredients.map((ingredient, index) =>
              editingId === ingredient.id && editDraft ? (
                <tr key={ingredient.id} className="bg-cookie-honey/30">
                  <td className="px-3 py-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={editDraft.name}
                      onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
                      className="w-full rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <select
                      value={editDraft.unit}
                      onChange={(event) =>
                        setEditDraft({ ...editDraft, unit: event.target.value as IngredientUnit })
                      }
                      className="rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                    >
                      <option value="gram">Gram</option>
                      <option value="item">Item</option>
                    </select>
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      step="any"
                      value={editDraft.price}
                      onChange={(event) => setEditDraft({ ...editDraft, price: event.target.value })}
                      className="w-24 rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmEdit}
                        aria-label="Save ingredient"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null)
                          setEditDraft(null)
                        }}
                        aria-label="Cancel"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                          aria-hidden="true"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={ingredient.id} className={index % 2 === 1 ? 'bg-cookie-cream/50' : ''}>
                  <td className="px-3 py-2 font-bold text-cookie-brown">{ingredient.name}</td>
                  <td className="px-3 py-2 text-cookie-charcoal/70">{ingredient.unit}</td>
                  <td className="px-3 py-2 font-mono text-cookie-charcoal/70">
                    {formatDen(ingredient.price_per_unit)} den
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(ingredient)}
                        aria-label="Edit ingredient"
                        title="Edit"
                        className="text-cookie-charcoal/60 hover:text-cookie-brown"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(ingredient)}
                        aria-label="Delete ingredient"
                        title="Delete"
                        className="text-cookie-charcoal/60 hover:text-cookie-rust"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {!loading && !draft && ingredients.length === 0 && (
          <p className="px-4 py-6 text-sm text-cookie-charcoal/50">No ingredients yet.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {draft && (
          <div className="flex flex-col gap-2 rounded-lg border border-cookie-charcoal/15 bg-cookie-honey/30 p-3">
            <input
              type="text"
              autoFocus
              placeholder="Name"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
            />
            <div className="flex gap-2">
              <select
                value={draft.unit}
                onChange={(event) => setDraft({ ...draft, unit: event.target.value as IngredientUnit })}
                className="flex-1 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
              >
                <option value="gram">Gram</option>
                <option value="item">Item</option>
              </select>
              <input
                type="number"
                step="any"
                placeholder="Price"
                value={draft.price}
                onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                className="w-24 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleConfirmDraft}
                aria-label="Confirm new ingredient"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Cancel"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {ingredients.map((ingredient) =>
          editingId === ingredient.id && editDraft ? (
            <div
              key={ingredient.id}
              className="flex flex-col gap-2 rounded-lg border border-cookie-charcoal/15 bg-cookie-honey/30 p-3"
            >
              <input
                type="text"
                autoFocus
                value={editDraft.name}
                onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
                className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
              />
              <div className="flex gap-2">
                <select
                  value={editDraft.unit}
                  onChange={(event) =>
                    setEditDraft({ ...editDraft, unit: event.target.value as IngredientUnit })
                  }
                  className="flex-1 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
                >
                  <option value="gram">Gram</option>
                  <option value="item">Item</option>
                </select>
                <input
                  type="number"
                  step="any"
                  value={editDraft.price}
                  onChange={(event) => setEditDraft({ ...editDraft, price: event.target.value })}
                  className="w-24 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  aria-label="Save ingredient"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setEditDraft(null)
                  }}
                  aria-label="Cancel"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div
              key={ingredient.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-bold text-cookie-brown">{ingredient.name}</p>
                <p className="text-xs text-cookie-charcoal/50">{ingredient.unit}</p>
              </div>
              <div className="flex flex-none items-center gap-3">
                <span className="font-mono text-sm text-cookie-charcoal/70">
                  {formatDen(ingredient.price_per_unit)} den
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(ingredient)}
                  aria-label="Edit ingredient"
                  title="Edit"
                  className="text-cookie-charcoal/60 hover:text-cookie-brown"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(ingredient)}
                  aria-label="Delete ingredient"
                  title="Delete"
                  className="text-cookie-charcoal/60 hover:text-cookie-rust"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ),
        )}
        {!loading && !draft && ingredients.length === 0 && (
          <p className="px-1 py-4 text-sm text-cookie-charcoal/50">No ingredients yet.</p>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Delete <span className="font-bold text-cookie-brown">{confirmDelete.name}</span>?
              This can&apos;t be undone.
            </>
          }
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

type PackagingDraft = { name: string; price: string }

function PackagingSection({
  items,
  loading,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: PackagingItem[]
  loading: boolean
  onAdd: (name: string, price: number) => Promise<void>
  onEdit: (id: string, name: string, price: number) => Promise<void>
  onDelete: (id: string) => Promise<string | null>
}) {
  const [draft, setDraft] = useState<PackagingDraft | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<PackagingDraft | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<PackagingItem | null>(null)
  const [error, setError] = useState('')

  async function handleConfirmDraft() {
    if (!draft) return
    const parsed = Number(draft.price)
    if (!draft.name.trim() || Number.isNaN(parsed)) return
    await onAdd(draft.name.trim(), parsed)
    setDraft(null)
  }

  function startEdit(item: PackagingItem) {
    setEditingId(item.id)
    setEditDraft({ name: item.name, price: String(item.price) })
  }

  async function handleConfirmEdit() {
    if (!editingId || !editDraft) return
    const parsed = Number(editDraft.price)
    if (!editDraft.name.trim() || Number.isNaN(parsed)) return
    await onEdit(editingId, editDraft.name.trim(), parsed)
    setEditingId(null)
    setEditDraft(null)
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    setError('')
    const message = await onDelete(confirmDelete.id)
    if (message) setError(message)
    setConfirmDelete(null)
  }

  return (
    <div className="flex min-w-0 flex-col gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Packaging</p>
        <button
          type="button"
          onClick={() => setDraft({ name: '', price: '' })}
          aria-label="Add packaging item"
          title="Add packaging item"
          className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

      <div className="hidden max-h-96 overflow-auto rounded-lg border border-cookie-charcoal/10 sm:block">
        <table className="w-full min-w-[360px] text-left text-sm">
          <thead>
            <tr className="sticky top-0 bg-cookie-brown text-xs font-bold text-cookie-cream uppercase">
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {draft && (
              <tr className="bg-cookie-honey/30">
                <td className="px-3 py-1.5">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Name"
                    value={draft.name}
                    onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                    className="w-full rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <input
                    type="number"
                    step="any"
                    placeholder="Price"
                    value={draft.price}
                    onChange={(event) => setDraft({ ...draft, price: event.target.value })}
                    className="w-24 rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                  />
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDraft}
                      aria-label="Confirm new packaging item"
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDraft(null)}
                      aria-label="Cancel"
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3 w-3"
                        aria-hidden="true"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            )}
            {items.map((item, index) =>
              editingId === item.id && editDraft ? (
                <tr key={item.id} className="bg-cookie-honey/30">
                  <td className="px-3 py-1.5">
                    <input
                      type="text"
                      autoFocus
                      value={editDraft.name}
                      onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
                      className="w-full rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="number"
                      step="any"
                      value={editDraft.price}
                      onChange={(event) => setEditDraft({ ...editDraft, price: event.target.value })}
                      className="w-24 rounded-lg border border-cookie-charcoal/20 px-2 py-1 text-sm text-cookie-charcoal"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConfirmEdit}
                        aria-label="Save packaging item"
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null)
                          setEditDraft(null)
                        }}
                        aria-label="Cancel"
                        className="flex h-6 w-6 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                          aria-hidden="true"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={item.id} className={index % 2 === 1 ? 'bg-cookie-cream/50' : ''}>
                  <td className="px-3 py-2 font-bold text-cookie-brown">{item.name}</td>
                  <td className="px-3 py-2 font-mono text-cookie-charcoal/70">
                    {formatDen(item.price)} den
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        aria-label="Edit packaging item"
                        title="Edit"
                        className="text-cookie-charcoal/60 hover:text-cookie-brown"
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(item)}
                        aria-label="Delete packaging item"
                        title="Delete"
                        className="text-cookie-charcoal/60 hover:text-cookie-rust"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        {!loading && !draft && items.length === 0 && (
          <p className="px-4 py-6 text-sm text-cookie-charcoal/50">No packaging items yet.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {draft && (
          <div className="flex flex-col gap-2 rounded-lg border border-cookie-charcoal/15 bg-cookie-honey/30 p-3">
            <input
              type="text"
              autoFocus
              placeholder="Name"
              value={draft.name}
              onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
            />
            <input
              type="number"
              step="any"
              placeholder="Price"
              value={draft.price}
              onChange={(event) => setDraft({ ...draft, price: event.target.value })}
              className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleConfirmDraft}
                aria-label="Confirm new packaging item"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                aria-label="Cancel"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {items.map((item) =>
          editingId === item.id && editDraft ? (
            <div
              key={item.id}
              className="flex flex-col gap-2 rounded-lg border border-cookie-charcoal/15 bg-cookie-honey/30 p-3"
            >
              <input
                type="text"
                autoFocus
                value={editDraft.name}
                onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })}
                className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
              />
              <input
                type="number"
                step="any"
                value={editDraft.price}
                onChange={(event) => setEditDraft({ ...editDraft, price: event.target.value })}
                className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleConfirmEdit}
                  aria-label="Save packaging item"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null)
                    setEditDraft(null)
                  }}
                  aria-label="Cancel"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3 w-3"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-3"
            >
              <p className="truncate font-bold text-cookie-brown">{item.name}</p>
              <div className="flex flex-none items-center gap-3">
                <span className="font-mono text-sm text-cookie-charcoal/70">
                  {formatDen(item.price)} den
                </span>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  aria-label="Edit packaging item"
                  title="Edit"
                  className="text-cookie-charcoal/60 hover:text-cookie-brown"
                >
                  <EditIcon />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(item)}
                  aria-label="Delete packaging item"
                  title="Delete"
                  className="text-cookie-charcoal/60 hover:text-cookie-rust"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ),
        )}
        {!loading && !draft && items.length === 0 && (
          <p className="px-1 py-4 text-sm text-cookie-charcoal/50">No packaging items yet.</p>
        )}
      </div>

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
    </div>
  )
}

function DataTab() {
  const [cookies, setCookies] = useState<CookieCostRow[]>([])
  const [cookiesLoading, setCookiesLoading] = useState(true)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [ingredientsLoading, setIngredientsLoading] = useState(true)
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([])
  const [packagingLoading, setPackagingLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('cookies')
      .select('slug, name, price, production_cost')
      .order('price')
      .then(({ data }) => {
        setCookies((data as CookieCostRow[] | null) ?? [])
        setCookiesLoading(false)
      })

    supabase
      .from('ingredients')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setIngredients((data as Ingredient[] | null) ?? [])
        setIngredientsLoading(false)
      })

    supabase
      .from('packaging_items')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setPackagingItems((data as PackagingItem[] | null) ?? [])
        setPackagingLoading(false)
      })
  }, [])

  async function addIngredient(name: string, unit: IngredientUnit, pricePerUnit: number) {
    const { data, error } = await supabase
      .from('ingredients')
      .insert({ name, unit, price_per_unit: pricePerUnit })
      .select()
      .single()
    if (!error && data) {
      setIngredients((prev) => [...prev, data as Ingredient].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  async function editIngredient(id: string, name: string, unit: IngredientUnit, pricePerUnit: number) {
    const { error } = await supabase
      .from('ingredients')
      .update({ name, unit, price_per_unit: pricePerUnit })
      .eq('id', id)
    if (!error) {
      setIngredients((prev) =>
        prev
          .map((ingredient) =>
            ingredient.id === id ? { ...ingredient, name, unit, price_per_unit: pricePerUnit } : ingredient,
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
    }
  }

  async function deleteIngredient(id: string) {
    const { error } = await supabase.from('ingredients').delete().eq('id', id)
    if (error) return 'Could not remove — it is used in a recipe.'
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id))
    return null
  }

  async function addPackagingItem(name: string, price: number) {
    const { data, error } = await supabase
      .from('packaging_items')
      .insert({ name, price })
      .select()
      .single()
    if (!error && data) {
      setPackagingItems((prev) =>
        [...prev, data as PackagingItem].sort((a, b) => a.name.localeCompare(b.name)),
      )
    }
  }

  async function editPackagingItem(id: string, name: string, price: number) {
    const { error } = await supabase.from('packaging_items').update({ name, price }).eq('id', id)
    if (!error) {
      setPackagingItems((prev) =>
        prev
          .map((item) => (item.id === id ? { ...item, name, price } : item))
          .sort((a, b) => a.name.localeCompare(b.name)),
      )
    }
  }

  async function deletePackagingItem(id: string) {
    const { error } = await supabase.from('packaging_items').delete().eq('id', id)
    if (error) return 'Could not remove this item.'
    setPackagingItems((prev) => prev.filter((item) => item.id !== id))
    return null
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <CookiesSection cookies={cookies} loading={cookiesLoading} />
        <IngredientsSection
          ingredients={ingredients}
          loading={ingredientsLoading}
          onAdd={addIngredient}
          onEdit={editIngredient}
          onDelete={deleteIngredient}
        />
        <PackagingSection
          items={packagingItems}
          loading={packagingLoading}
          onAdd={addPackagingItem}
          onEdit={editPackagingItem}
          onDelete={deletePackagingItem}
        />
      </div>
    </div>
  )
}

export default DataTab
