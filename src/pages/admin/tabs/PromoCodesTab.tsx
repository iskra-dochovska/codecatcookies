import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import ConfirmModal from '../ConfirmModal'

type DiscountType = 'fixed' | 'percent'
type DiscountScope = 'per_cookie' | 'total'

type PromoCode = {
  id: string
  code: string
  max_uses: number | null
  uses: number
  active: boolean
  created_at: string
  discount_type: DiscountType
  discount_scope: DiscountScope
  discount_value: number
}

type UsageType = 'once' | 'unlimited'

type Draft = {
  id: string | null
  code: string
  usageType: UsageType
  discountType: DiscountType
  discountScope: DiscountScope
  discountValue: string
  active: boolean
}

function formatDiscount(promo: Pick<PromoCode, 'discount_type' | 'discount_scope' | 'discount_value'>) {
  const amount = promo.discount_type === 'percent' ? `${promo.discount_value}%` : `${promo.discount_value} den`
  const scope = promo.discount_scope === 'per_cookie' ? 'per cookie' : 'off total'
  return `${amount} ${scope}`
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 8

function generateCode() {
  const bytes = new Uint8Array(CODE_LENGTH)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join('')
}

function newDraft(): Draft {
  return {
    id: null,
    code: generateCode(),
    usageType: 'unlimited',
    discountType: 'fixed',
    discountScope: 'per_cookie',
    discountValue: '10',
    active: true,
  }
}

function editDraft(promo: PromoCode): Draft {
  return {
    id: promo.id,
    code: promo.code,
    usageType: promo.max_uses === 1 ? 'once' : 'unlimited',
    discountType: promo.discount_type,
    discountScope: promo.discount_scope,
    discountValue: String(promo.discount_value),
    active: promo.active,
  }
}

function RefreshIcon() {
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
      <path d="M3 12a9 9 0 0 1 15.36-6.36L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.36 6.36L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  )
}

function CheckIcon() {
  return (
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
  )
}

function CloseIcon() {
  return (
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

function PencilIcon() {
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
      <path d="m15 5 4 4" />
    </svg>
  )
}

function ToggleGroup<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="inline-flex self-start rounded-full bg-cookie-charcoal/10 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${
            value === option.value ? 'bg-cookie-rust text-cookie-cream' : 'text-cookie-charcoal/60'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

function PromoCodeField({ draft, onChange }: { draft: Draft; onChange: (draft: Draft) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={draft.code}
        onChange={(event) => onChange({ ...draft, code: event.target.value.toUpperCase() })}
        className="w-28 rounded-lg border border-cookie-charcoal/20 px-2 py-1 font-mono text-xs text-cookie-charcoal uppercase"
      />
      <button
        type="button"
        onClick={() => onChange({ ...draft, code: generateCode() })}
        aria-label="Regenerate code"
        title="Regenerate"
        className="text-cookie-charcoal/60 hover:text-cookie-brown"
      >
        <RefreshIcon />
      </button>
    </div>
  )
}

function DiscountFields({ draft, onChange }: { draft: Draft; onChange: (draft: Draft) => void }) {
  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-2">
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="0"
          step="any"
          value={draft.discountValue}
          onChange={(event) => onChange({ ...draft, discountValue: event.target.value })}
          className="w-16 rounded-lg border border-cookie-charcoal/20 px-2 py-1 font-mono text-xs text-cookie-charcoal"
        />
        <ToggleGroup
          value={draft.discountType}
          onChange={(discountType) => onChange({ ...draft, discountType })}
          options={[
            { value: 'fixed', label: 'Den' },
            { value: 'percent', label: '%' },
          ]}
        />
      </div>
      <ToggleGroup
        value={draft.discountScope}
        onChange={(discountScope) => onChange({ ...draft, discountScope })}
        options={[
          { value: 'per_cookie', label: 'Per cookie' },
          { value: 'total', label: 'Final price' },
        ]}
      />
    </div>
  )
}

function UsesField({ draft, onChange }: { draft: Draft; onChange: (draft: Draft) => void }) {
  return (
    <ToggleGroup
      value={draft.usageType}
      onChange={(usageType) => onChange({ ...draft, usageType })}
      options={[
        { value: 'once', label: 'Once' },
        { value: 'unlimited', label: 'Until off' },
      ]}
    />
  )
}

function PromoEditRow({
  draft,
  isNew,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Draft
  isNew: boolean
  onChange: (draft: Draft) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <tr className="bg-cookie-honey/30">
      <td className="px-3 py-2 align-top">
        <PromoCodeField draft={draft} onChange={onChange} />
      </td>
      <td className="px-3 py-2 align-top">
        <DiscountFields draft={draft} onChange={onChange} />
      </td>
      <td className="px-3 py-2 align-top">
        <UsesField draft={draft} onChange={onChange} />
      </td>
      <td className="px-3 py-2 align-top">
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={draft.active}
            onChange={(event) => onChange({ ...draft, active: event.target.checked })}
            aria-label="Promo code active"
            className="h-4 w-4 accent-cookie-rust"
          />
        </div>
      </td>
      <td className="px-3 py-2 align-top">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            aria-label={isNew ? 'Create code' : 'Save code'}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
          >
            <CheckIcon />
          </button>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cancel"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
          >
            <CloseIcon />
          </button>
        </div>
      </td>
    </tr>
  )
}

function PromoDisplayRow({
  promo,
  striped,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  promo: PromoCode
  striped: boolean
  onToggleActive: (id: string, active: boolean) => void
  onEdit: (promo: PromoCode) => void
  onDelete: (promo: PromoCode) => void
}) {
  return (
    <tr className={striped ? 'bg-cookie-honey/25' : ''}>
      <td className="px-3 py-2 font-mono font-bold text-cookie-brown">{promo.code}</td>
      <td className="px-3 py-2 font-mono text-cookie-charcoal/70">{formatDiscount(promo)}</td>
      <td className="px-3 py-2 font-mono text-cookie-charcoal/70">
        {promo.uses} / {promo.max_uses ?? '∞'}
      </td>
      <td className="px-3 py-2">
        <div className="flex justify-center">
          <input
            type="checkbox"
            checked={promo.active}
            onChange={(event) => onToggleActive(promo.id, event.target.checked)}
            aria-label="Promo code active"
            className="h-4 w-4 accent-cookie-rust"
          />
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onEdit(promo)}
            aria-label="Edit promo code"
            title="Edit"
            className="text-cookie-charcoal/60 hover:text-cookie-brown"
          >
            <PencilIcon />
          </button>
          <button
            type="button"
            onClick={() => onDelete(promo)}
            aria-label="Delete promo code"
            title="Delete"
            className="text-cookie-charcoal/60 hover:text-cookie-rust"
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  )
}

function PromoEditCard({
  draft,
  isNew,
  onChange,
  onSave,
  onCancel,
}: {
  draft: Draft
  isNew: boolean
  onChange: (draft: Draft) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cookie-rust bg-white p-3">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-cookie-charcoal/60 uppercase">Code</span>
        <PromoCodeField draft={draft} onChange={onChange} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-cookie-charcoal/60 uppercase">Discount</span>
        <DiscountFields draft={draft} onChange={onChange} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-cookie-charcoal/60 uppercase">Uses</span>
        <UsesField draft={draft} onChange={onChange} />
      </div>
      <label className="flex items-center gap-2 text-xs font-bold text-cookie-charcoal/60 uppercase">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(event) => onChange({ ...draft, active: event.target.checked })}
          className="h-4 w-4 accent-cookie-rust"
        />
        Active
      </label>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onSave}
          aria-label={isNew ? 'Create code' : 'Save code'}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
        >
          <CheckIcon />
        </button>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

function PromoCard({
  promo,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  promo: PromoCode
  onToggleActive: (id: string, active: boolean) => void
  onEdit: (promo: PromoCode) => void
  onDelete: (promo: PromoCode) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-3">
      <div className="min-w-0">
        <p className="truncate font-mono font-bold text-cookie-brown">{promo.code}</p>
        <p className="font-mono text-xs text-cookie-charcoal/50">{formatDiscount(promo)}</p>
        <p className="font-mono text-xs text-cookie-charcoal/50">
          {promo.uses} / {promo.max_uses ?? '∞'} uses
        </p>
      </div>
      <div className="flex flex-none items-center gap-3">
        <input
          type="checkbox"
          checked={promo.active}
          onChange={(event) => onToggleActive(promo.id, event.target.checked)}
          aria-label="Promo code active"
          className="h-4 w-4 accent-cookie-rust"
        />
        <button
          type="button"
          onClick={() => onEdit(promo)}
          aria-label="Edit promo code"
          title="Edit"
          className="text-cookie-charcoal/60 hover:text-cookie-brown"
        >
          <PencilIcon />
        </button>
        <button
          type="button"
          onClick={() => onDelete(promo)}
          aria-label="Delete promo code"
          title="Delete"
          className="text-cookie-charcoal/60 hover:text-cookie-rust"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  )
}

function PromoCodesTab() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<PromoCode | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCodes((data as PromoCode[] | null) ?? [])
        setLoading(false)
      })
  }, [])

  function startCreate() {
    setError('')
    setDraft(newDraft())
  }

  function startEdit(promo: PromoCode) {
    setError('')
    setDraft(editDraft(promo))
  }

  function cancelDraft() {
    setError('')
    setDraft(null)
  }

  async function confirmDraft() {
    if (!draft) return
    const code = draft.code.trim().toUpperCase()
    const discountValue = Number(draft.discountValue)
    if (!code || !Number.isFinite(discountValue) || discountValue <= 0) return
    setError('')

    const payload = {
      code,
      max_uses: draft.usageType === 'once' ? 1 : null,
      active: draft.active,
      discount_type: draft.discountType,
      discount_scope: draft.discountScope,
      discount_value: discountValue,
    }

    if (draft.id) {
      const { data, error: updateError } = await supabase
        .from('promo_codes')
        .update(payload)
        .eq('id', draft.id)
        .select()
        .single()
      if (updateError) {
        setError(updateError.code === '23505' ? 'That code already exists.' : 'Could not update code.')
        return
      }
      setCodes((prev) => prev.map((promo) => (promo.id === draft.id ? (data as PromoCode) : promo)))
    } else {
      const { data, error: insertError } = await supabase
        .from('promo_codes')
        .insert(payload)
        .select()
        .single()
      if (insertError) {
        setError(insertError.code === '23505' ? 'That code already exists.' : 'Could not create code.')
        return
      }
      setCodes((prev) => [data as PromoCode, ...prev])
    }
    setDraft(null)
  }

  async function toggleActive(id: string, active: boolean) {
    const { error: updateError } = await supabase.from('promo_codes').update({ active }).eq('id', id)
    if (!updateError) {
      setCodes((prev) => prev.map((promo) => (promo.id === id ? { ...promo, active } : promo)))
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    const { error: deleteError } = await supabase
      .from('promo_codes')
      .delete()
      .eq('id', confirmDelete.id)
    if (!deleteError) {
      setCodes((prev) => prev.filter((promo) => promo.id !== confirmDelete.id))
      if (draft?.id === confirmDelete.id) setDraft(null)
    }
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Promo codes</p>
        <button
          type="button"
          onClick={startCreate}
          className="rounded-full bg-cookie-rust px-4 py-1.5 text-xs font-bold text-cookie-cream uppercase"
        >
          Generate code
        </button>
      </div>

      {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

      <div className="hidden overflow-x-auto rounded-lg border border-cookie-charcoal/15 bg-white sm:block">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="bg-cookie-brown text-xs font-bold text-cookie-cream uppercase">
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Discount</th>
              <th className="px-3 py-2">Uses</th>
              <th className="px-3 py-2 text-center">Active</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {draft && !draft.id && (
              <PromoEditRow draft={draft} isNew onChange={setDraft} onSave={confirmDraft} onCancel={cancelDraft} />
            )}
            {codes.map((promo, index) =>
              draft?.id === promo.id ? (
                <PromoEditRow
                  key={promo.id}
                  draft={draft}
                  isNew={false}
                  onChange={setDraft}
                  onSave={confirmDraft}
                  onCancel={cancelDraft}
                />
              ) : (
                <PromoDisplayRow
                  key={promo.id}
                  promo={promo}
                  striped={index % 2 === 1}
                  onToggleActive={toggleActive}
                  onEdit={startEdit}
                  onDelete={setConfirmDelete}
                />
              ),
            )}
          </tbody>
        </table>
        {!loading && codes.length === 0 && !draft && (
          <p className="px-4 py-6 text-sm text-cookie-charcoal/50">No promo codes yet.</p>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:hidden">
        {draft && !draft.id && (
          <PromoEditCard draft={draft} isNew onChange={setDraft} onSave={confirmDraft} onCancel={cancelDraft} />
        )}
        {codes.map((promo) =>
          draft?.id === promo.id ? (
            <PromoEditCard
              key={promo.id}
              draft={draft}
              isNew={false}
              onChange={setDraft}
              onSave={confirmDraft}
              onCancel={cancelDraft}
            />
          ) : (
            <PromoCard
              key={promo.id}
              promo={promo}
              onToggleActive={toggleActive}
              onEdit={startEdit}
              onDelete={setConfirmDelete}
            />
          ),
        )}
        {!loading && codes.length === 0 && !draft && (
          <p className="px-1 py-4 text-sm text-cookie-charcoal/50">No promo codes yet.</p>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Delete promo code{' '}
              <span className="font-bold text-cookie-brown">{confirmDelete.code}</span>? This can&apos;t
              be undone.
            </>
          }
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  )
}

export default PromoCodesTab
