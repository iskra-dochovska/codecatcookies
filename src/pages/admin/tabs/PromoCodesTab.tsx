import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import ConfirmModal from '../ConfirmModal'

type PromoCode = {
  id: string
  code: string
  max_uses: number | null
  uses: number
  active: boolean
  created_at: string
}

type UsageType = 'once' | 'unlimited'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const CODE_LENGTH = 8

function generateCode() {
  const bytes = new Uint8Array(CODE_LENGTH)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (byte) => CODE_CHARS[byte % CODE_CHARS.length]).join('')
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

function PromoCodesTab() {
  const [codes, setCodes] = useState<PromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<{ code: string; usageType: UsageType } | null>(null)
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

  function startDraft() {
    setError('')
    setDraft({ code: generateCode(), usageType: 'unlimited' })
  }

  async function confirmDraft() {
    if (!draft) return
    const code = draft.code.trim().toUpperCase()
    if (!code) return
    setError('')
    const { data, error: insertError } = await supabase
      .from('promo_codes')
      .insert({ code, max_uses: draft.usageType === 'once' ? 1 : null, active: true })
      .select()
      .single()
    if (insertError) {
      setError(insertError.code === '23505' ? 'That code already exists.' : 'Could not create code.')
      return
    }
    setCodes((prev) => [data as PromoCode, ...prev])
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
    }
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Promo codes</p>
        <button
          type="button"
          onClick={startDraft}
          className="rounded-full bg-cookie-rust px-4 py-1.5 text-xs font-bold text-cookie-cream uppercase"
        >
          Generate code
        </button>
      </div>

      {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

      {draft && (
        <div className="flex flex-col gap-4 rounded-lg border border-cookie-charcoal/15 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-cookie-charcoal/60 uppercase">Code</span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={draft.code}
                onChange={(event) => setDraft({ ...draft, code: event.target.value.toUpperCase() })}
                className="w-40 rounded-lg border border-cookie-charcoal/20 px-2 py-1.5 font-mono text-sm text-cookie-charcoal uppercase"
              />
              <button
                type="button"
                onClick={() => setDraft({ ...draft, code: generateCode() })}
                aria-label="Regenerate code"
                title="Regenerate"
                className="text-cookie-charcoal/60 hover:text-cookie-brown"
              >
                <RefreshIcon />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-cookie-charcoal/60 uppercase">Uses</span>
            <div className="inline-flex rounded-full bg-cookie-charcoal/10 p-1">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, usageType: 'once' })}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors ${
                  draft.usageType === 'once' ? 'bg-cookie-rust text-cookie-cream' : 'text-cookie-charcoal/60'
                }`}
              >
                Once
              </button>
              <button
                type="button"
                onClick={() => setDraft({ ...draft, usageType: 'unlimited' })}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase transition-colors ${
                  draft.usageType === 'unlimited'
                    ? 'bg-cookie-rust text-cookie-cream'
                    : 'text-cookie-charcoal/60'
                }`}
              >
                Until I turn it off
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={confirmDraft}
              aria-label="Create code"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
            >
              <CheckIcon />
            </button>
            <button
              type="button"
              onClick={() => setDraft(null)}
              aria-label="Cancel"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-cookie-charcoal/30 text-cookie-charcoal/60"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-cookie-charcoal/15 bg-white">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="bg-cookie-brown text-xs font-bold text-cookie-cream uppercase">
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2">Uses</th>
              <th className="px-3 py-2 text-center">Active</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {codes.map((promo, index) => (
              <tr key={promo.id} className={index % 2 === 1 ? 'bg-cookie-honey/25' : ''}>
                <td className="px-3 py-2 font-mono font-bold text-cookie-brown">{promo.code}</td>
                <td className="px-3 py-2 font-mono text-cookie-charcoal/70">
                  {promo.uses} / {promo.max_uses ?? '∞'}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={promo.active}
                      onChange={(event) => toggleActive(promo.id, event.target.checked)}
                      aria-label="Promo code active"
                      className="h-4 w-4 accent-cookie-rust"
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(promo)}
                    aria-label="Delete promo code"
                    title="Delete"
                    className="text-cookie-charcoal/60 hover:text-cookie-rust"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && codes.length === 0 && (
          <p className="px-4 py-6 text-sm text-cookie-charcoal/50">No promo codes yet.</p>
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
