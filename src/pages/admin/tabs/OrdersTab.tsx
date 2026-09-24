import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../../lib/supabaseClient'
import { formatDen } from '../../../lib/format'
import { useClickOutside } from '../../../hooks/useClickOutside'
import ConfirmModal from '../ConfirmModal'
import {
  effectiveTotal,
  formatPickupCell,
  packagingCost,
  type OrderPackagingRow,
  type OrderRow,
  type OrderStatus,
} from '../orders'

type PackagingItem = { id: string; name: string; price: number }

type CookieOption = { slug: string; name: string; price: number; production_cost: number }

type OrderLineDraft = { slug: string; quantity: string }

function pad(value: number) {
  return value.toString().padStart(2, '0')
}

const TIME_SLOTS = (() => {
  const slots: string[] = []
  for (let minutes = 8 * 60; minutes <= 20 * 60; minutes += 30) {
    slots.push(`${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`)
  }
  return slots
})()

function StyledSelect({
  value,
  onChange,
  children,
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-lg border border-cookie-charcoal/20 bg-white py-1.5 pr-8 pl-3 text-sm font-normal normal-case text-cookie-charcoal transition-colors hover:border-cookie-charcoal/40 focus:border-cookie-rust focus:ring-2 focus:ring-cookie-rust/30 focus:outline-none"
      >
        {children}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-2.5 h-3.5 w-3.5 -translate-y-1/2 text-cookie-charcoal/50"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  )
}

type ItemOption = { key: string; label: string }

function ItemSelect({
  value,
  onChange,
  options,
  placeholder = 'Select',
  className = '',
}: {
  value: string
  onChange: (value: string) => void
  options: ItemOption[]
  placeholder?: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useClickOutside(containerRef, () => setOpen(false), open)

  const selected = options.find((option) => option.key === value)

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3 py-1.5 text-left text-sm text-cookie-charcoal transition-colors hover:border-cookie-charcoal/40 ${
          open ? 'border-cookie-rust' : 'border-cookie-charcoal/20'
        }`}
      >
        <span className="truncate">{selected ? selected.label : placeholder}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-3.5 w-3.5 shrink-0 text-cookie-charcoal/50 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-20 mt-1 max-h-[8.5rem] w-full overflow-y-auto rounded-lg border border-cookie-charcoal/20 bg-white p-1 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              role="option"
              aria-selected={option.key === value}
              onClick={() => {
                onChange(option.key)
                setOpen(false)
              }}
              className={`block w-full truncate rounded-md px-2.5 py-1.5 text-left text-sm ${
                option.key === value
                  ? 'bg-cookie-rust font-bold text-cookie-cream'
                  : 'text-cookie-charcoal hover:bg-cookie-cream'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function PackagingRowEditor({
  itemId,
  quantity,
  packagingItems,
  onItemChange,
  onQuantityChange,
}: {
  itemId: string
  quantity: string
  packagingItems: PackagingItem[]
  onItemChange: (value: string) => void
  onQuantityChange: (value: string) => void
}) {
  return (
    <>
      <ItemSelect
        value={itemId}
        onChange={onItemChange}
        options={packagingItems.map((item) => ({
          key: item.id,
          label: `${item.name} (${formatDen(item.price)} den)`,
        }))}
        placeholder="Select item"
        className="min-w-0 flex-1"
      />
      <input
        type="number"
        min="1"
        step="1"
        value={quantity}
        onChange={(event) => onQuantityChange(event.target.value)}
        className="w-16 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
    </>
  )
}

function PackagingEditor({
  order,
  packagingItems,
  onAdd,
  onEdit,
  onRemove,
}: {
  order: OrderRow
  packagingItems: PackagingItem[]
  onAdd: (orderId: string, packagingItemId: string, quantity: number) => Promise<void>
  onEdit: (orderId: string, rowId: string, packagingItemId: string, quantity: number) => Promise<void>
  onRemove: (orderId: string, rowId: string) => Promise<void>
}) {
  const [itemId, setItemId] = useState(packagingItems[0]?.id ?? '')
  const [quantity, setQuantity] = useState('1')
  const [editingRowId, setEditingRowId] = useState<string | null>(null)
  const [editItemId, setEditItemId] = useState('')
  const [editQuantity, setEditQuantity] = useState('')

  async function handleAdd() {
    const parsed = Number(quantity)
    if (!itemId || !Number.isFinite(parsed) || parsed <= 0) return
    await onAdd(order.id, itemId, parsed)
    setQuantity('1')
  }

  function startEdit(row: OrderPackagingRow) {
    setEditingRowId(row.id)
    setEditItemId(row.packaging_item_id ?? packagingItems[0]?.id ?? '')
    setEditQuantity(String(row.quantity))
  }

  async function handleSaveEdit(rowId: string) {
    const parsed = Number(editQuantity)
    if (!editItemId || !Number.isFinite(parsed) || parsed <= 0) return
    await onEdit(order.id, rowId, editItemId, parsed)
    setEditingRowId(null)
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-cookie-charcoal/10 bg-cookie-cream/40 p-3">
      {order.order_packaging.length === 0 ? (
        <p className="text-xs text-cookie-charcoal/50">No packaging used yet.</p>
      ) : (
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-bold text-cookie-charcoal/50 uppercase">
              <th className="py-1 pr-2">Item</th>
              <th className="py-1 pr-2">Qty</th>
              <th className="py-1 pr-2">Unit price</th>
              <th className="py-1 pr-2">Subtotal</th>
              <th className="py-1" />
            </tr>
          </thead>
          <tbody>
            {order.order_packaging.map((row) =>
              editingRowId === row.id ? (
                <tr key={row.id}>
                  <td className="py-1 pr-2" colSpan={3}>
                    <div className="flex items-center gap-2">
                      <PackagingRowEditor
                        itemId={editItemId}
                        quantity={editQuantity}
                        packagingItems={packagingItems}
                        onItemChange={setEditItemId}
                        onQuantityChange={setEditQuantity}
                      />
                    </div>
                  </td>
                  <td className="py-1 pr-2" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(row.id)}
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
                        onClick={() => setEditingRowId(null)}
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
                <tr key={row.id}>
                  <td className="py-1 pr-2 font-bold text-cookie-brown">{row.packaging_item_name}</td>
                  <td className="py-1 pr-2 font-mono text-cookie-charcoal/70">{row.quantity}</td>
                  <td className="py-1 pr-2 font-mono text-cookie-charcoal/70">
                    {formatDen(row.unit_price)} den
                  </td>
                  <td className="py-1 pr-2 font-mono text-cookie-charcoal/70">
                    {formatDen(row.quantity * row.unit_price)} den
                  </td>
                  <td className="py-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        aria-label="Edit packaging item"
                        title="Edit"
                        className="text-cookie-charcoal/50 hover:text-cookie-brown"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3 w-3"
                          aria-hidden="true"
                        >
                          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(order.id, row.id)}
                        aria-label="Remove packaging item"
                        title="Remove"
                        className="text-cookie-charcoal/50 hover:text-cookie-rust"
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
              ),
            )}
          </tbody>
        </table>
      )}

      {packagingItems.length === 0 ? (
        <p className="text-xs text-cookie-charcoal/50">
          No packaging items defined yet — add some in the Costs tab.
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <PackagingRowEditor
            itemId={itemId}
            quantity={quantity}
            packagingItems={packagingItems}
            onItemChange={setItemId}
            onQuantityChange={setQuantity}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="flex-none rounded-full bg-cookie-rust px-3 py-1 text-xs font-bold text-cookie-cream uppercase"
          >
            Add
          </button>
        </div>
      )}
    </div>
  )
}

function PackagingModal({
  order,
  packagingItems,
  onAdd,
  onEdit,
  onRemove,
  onClose,
}: {
  order: OrderRow
  packagingItems: PackagingItem[]
  onAdd: (orderId: string, packagingItemId: string, quantity: number) => Promise<void>
  onEdit: (orderId: string, rowId: string, packagingItemId: string, quantity: number) => Promise<void>
  onRemove: (orderId: string, rowId: string) => Promise<void>
  onClose: () => void
}) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={onClose}>
      <div
        className="w-full max-w-2xl rounded-lg border border-cookie-charcoal/15 bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Packaging</p>
            <p className="font-bold text-cookie-brown">{order.full_name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-cookie-charcoal/50 hover:text-cookie-rust"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <PackagingEditor
          order={order}
          packagingItems={packagingItems}
          onAdd={onAdd}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      </div>
    </div>,
    document.body,
  )
}

function NewOrderModal({
  cookieOptions,
  onCreate,
  onClose,
}: {
  cookieOptions: CookieOption[]
  onCreate: (payload: {
    fullName: string
    email: string
    phone: string
    pickupDate: string
    pickupTime: string
    notes: string
    lines: { slug: string; quantity: number }[]
  }) => Promise<string | null>
  onClose: () => void
}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [pickupTime, setPickupTime] = useState('')
  const [notes, setNotes] = useState('')
  const [lines, setLines] = useState<OrderLineDraft[]>([
    { slug: cookieOptions[0]?.slug ?? '', quantity: '1' },
  ])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function updateLine(index: number, patch: Partial<OrderLineDraft>) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, ...patch } : line)))
  }

  function addLine() {
    setLines((prev) => [...prev, { slug: cookieOptions[0]?.slug ?? '', quantity: '1' }])
  }

  function removeLine(index: number) {
    setLines((prev) => prev.filter((_, i) => i !== index))
  }

  const total = lines.reduce((sum, line) => {
    const cookie = cookieOptions.find((option) => option.slug === line.slug)
    const quantity = Number(line.quantity)
    return cookie && Number.isFinite(quantity) ? sum + cookie.price * quantity : sum
  }, 0)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (submitting) return
    setError('')

    const parsedLines = lines
      .map((line) => ({ slug: line.slug, quantity: Number(line.quantity) }))
      .filter((line) => line.slug && Number.isFinite(line.quantity) && line.quantity > 0)

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !pickupDate ||
      !pickupTime ||
      parsedLines.length === 0
    ) {
      setError('Fill in customer info, pickup, and at least one cookie line.')
      return
    }

    setSubmitting(true)
    const message = await onCreate({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      pickupDate,
      pickupTime,
      notes: notes.trim(),
      lines: parsedLines,
    })
    setSubmitting(false)
    if (message) setError(message)
    else onClose()
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" onClick={onClose}>
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-lg border border-cookie-charcoal/15 bg-white p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="text-lg font-bold text-cookie-brown">New order</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-cookie-charcoal/50 hover:text-cookie-rust"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs font-bold text-cookie-charcoal/60 uppercase">
              Full name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm font-normal normal-case text-cookie-charcoal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-bold text-cookie-charcoal/60 uppercase">
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm font-normal normal-case text-cookie-charcoal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-bold text-cookie-charcoal/60 uppercase">
              Phone
              <div className="flex items-center gap-1 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5">
                <span className="font-mono text-sm font-normal text-cookie-charcoal/50">+389</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 8))}
                  className="w-full text-sm font-normal normal-case text-cookie-charcoal outline-none"
                />
              </div>
            </label>
            <label className="flex flex-col gap-1 text-xs font-bold text-cookie-charcoal/60 uppercase">
              Pickup date
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                className="rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm font-normal normal-case text-cookie-charcoal"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-bold text-cookie-charcoal/60 uppercase">
              Pickup time
              <StyledSelect value={pickupTime} onChange={setPickupTime}>
                <option value="">Select time</option>
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </StyledSelect>
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs font-bold text-cookie-charcoal/60 uppercase">
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="h-16 resize-none rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm font-normal normal-case text-cookie-charcoal"
            />
          </label>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold text-cookie-charcoal/60 uppercase">Cookies</p>
            {lines.map((line, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2">
                <ItemSelect
                  value={line.slug}
                  onChange={(value) => updateLine(index, { slug: value })}
                  options={cookieOptions.map((option) => ({
                    key: option.slug,
                    label: `${option.name} (${formatDen(option.price)} den)`,
                  }))}
                  placeholder="Select cookie"
                  className="min-w-0 flex-1"
                />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={line.quantity}
                  onChange={(event) => updateLine(index, { quantity: event.target.value })}
                  className="w-16 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1.5 text-sm text-cookie-charcoal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
                {lines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    aria-label="Remove cookie line"
                    className="flex-none text-cookie-charcoal/50 hover:text-cookie-rust"
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
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLine}
              className="self-start rounded-full border border-cookie-charcoal/20 px-3 py-1 text-xs font-bold text-cookie-charcoal/70 uppercase"
            >
              + Add cookie
            </button>
          </div>

          <div className="flex items-center justify-between border-t border-dashed border-cookie-charcoal/20 pt-2 font-mono text-sm">
            <span className="text-cookie-charcoal/60">Total</span>
            <span className="font-bold text-cookie-brown">{formatDen(total)} den</span>
          </div>

          {error && <p className="text-sm font-bold text-cookie-rust">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-cookie-rust px-4 py-2 text-xs font-bold text-cookie-cream uppercase disabled:opacity-50"
          >
            {submitting ? 'Creating...' : 'Create order'}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  )
}

function OrderActionButtons({
  order,
  onMarkCompleted,
  onDelete,
}: {
  order: OrderRow
  onMarkCompleted: (id: string) => void
  onDelete: (order: OrderRow) => void
}) {
  if (order.status === 'pending') {
    return (
      <button
        type="button"
        onClick={() => onMarkCompleted(order.id)}
        aria-label="Mark completed"
        title="Mark completed"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-cookie-rust text-cookie-cream"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onDelete(order)}
      aria-label="Delete order"
      title="Delete order"
      className="text-cookie-charcoal/60 hover:text-cookie-rust"
    >
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
    </button>
  )
}

function OrderCard({
  order,
  showPackaging,
  onToggleDiscount,
  onMarkCompleted,
  onDelete,
  onOpenPackaging,
}: {
  order: OrderRow
  showPackaging: boolean
  onToggleDiscount: (id: string, discount: boolean) => void
  onMarkCompleted: (id: string) => void
  onDelete: (order: OrderRow) => void
  onOpenPackaging: (id: string) => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cookie-charcoal/15 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-bold text-cookie-brown">{order.full_name}</p>
          <p className="text-xs text-cookie-charcoal/50">+389{order.phone}</p>
          <p className="truncate text-xs text-cookie-charcoal/50">{order.email}</p>
        </div>
        <div className="flex flex-none items-center gap-2">
          <OrderActionButtons order={order} onMarkCompleted={onMarkCompleted} onDelete={onDelete} />
        </div>
      </div>

      <p className="text-sm text-cookie-charcoal/70">
        {formatPickupCell(order.pickup_date, order.pickup_time)}
      </p>

      <div className="flex flex-col gap-0.5 text-sm text-cookie-charcoal/70">
        {order.order_items.map((item) => (
          <p key={item.id}>
            {item.cookie_name} x{item.quantity}
          </p>
        ))}
      </div>

      {order.notes && (
        <p className="rounded-lg bg-cookie-cream/60 px-2.5 py-1.5 text-sm whitespace-pre-wrap text-cookie-charcoal/70">
          {order.notes}
        </p>
      )}

      <label className="flex items-center gap-2 text-xs font-bold text-cookie-charcoal/60 uppercase">
        <input
          type="checkbox"
          checked={order.discount}
          onChange={(event) => onToggleDiscount(order.id, event.target.checked)}
          aria-label="10 den per cookie discount applied"
          className="h-4 w-4 accent-cookie-rust"
        />
        Discount
        {order.promo_code && (
          <span className="font-mono text-cookie-charcoal/50 normal-case">({order.promo_code})</span>
        )}
      </label>

      <div className="flex items-center justify-between border-t border-dashed border-cookie-charcoal/15 pt-2">
        <span className="text-xs font-bold text-cookie-charcoal/50 uppercase">Total</span>
        <span className="font-mono font-bold text-cookie-brown">{effectiveTotal(order)} den</span>
      </div>

      {showPackaging && (
        <button
          type="button"
          onClick={() => onOpenPackaging(order.id)}
          className="w-full rounded-full border border-cookie-charcoal/20 px-3 py-1.5 font-mono text-xs font-bold text-cookie-charcoal/70 uppercase"
        >
          Packaging: {formatDen(packagingCost(order))} den
        </button>
      )}
    </div>
  )
}

function OrdersTab({
  orders,
  setOrders,
}: {
  orders: OrderRow[]
  setOrders: React.Dispatch<React.SetStateAction<OrderRow[]>>
}) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('pending')
  const [confirmDelete, setConfirmDelete] = useState<OrderRow | null>(null)
  const [packagingOrderId, setPackagingOrderId] = useState<string | null>(null)
  const [packagingItems, setPackagingItems] = useState<PackagingItem[]>([])
  const [cookieOptions, setCookieOptions] = useState<CookieOption[]>([])
  const [showNewOrder, setShowNewOrder] = useState(false)
  const filteredOrders = orders.filter((order) => order.status === statusFilter)
  const packagingOrder = orders.find((order) => order.id === packagingOrderId) ?? null

  useEffect(() => {
    supabase
      .from('packaging_items')
      .select('id, name, price')
      .order('name')
      .then(({ data }) => setPackagingItems((data as PackagingItem[] | null) ?? []))

    supabase
      .from('cookies')
      .select('slug, name, price, production_cost')
      .order('name')
      .then(({ data }) => setCookieOptions((data as CookieOption[] | null) ?? []))
  }, [])

  async function createOrder(payload: {
    fullName: string
    email: string
    phone: string
    pickupDate: string
    pickupTime: string
    notes: string
    lines: { slug: string; quantity: number }[]
  }) {
    const orderItems = payload.lines.flatMap((line) => {
      const cookie = cookieOptions.find((option) => option.slug === line.slug)
      if (!cookie) return []
      return [
        {
          cookie_slug: cookie.slug,
          cookie_name: cookie.name,
          quantity: line.quantity,
          unit_price: cookie.price,
          unit_cost: cookie.production_cost,
        },
      ]
    })
    if (orderItems.length === 0) return 'Could not create order.'

    const total = orderItems.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)

    const { data: result, error } = await supabase.rpc('create_order', {
      order_data: {
        full_name: payload.fullName,
        email: payload.email,
        phone: payload.phone,
        pickup_date: payload.pickupDate,
        pickup_time: payload.pickupTime,
        notes: payload.notes || null,
        total,
      },
      items: orderItems,
      promo_code: null,
    })

    const orderId = (result as { order_id?: string } | null)?.order_id
    if (error || !orderId) return 'Could not create order.'

    const { data: fullOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(*), order_packaging(*)')
      .eq('id', orderId)
      .single()

    if (fetchError || !fullOrder) return 'Order created but failed to load.'

    setOrders((prev) => [fullOrder as OrderRow, ...prev])
    return null
  }

  async function addPackaging(orderId: string, packagingItemId: string, quantity: number) {
    const item = packagingItems.find((candidate) => candidate.id === packagingItemId)
    if (!item) return
    const { data, error } = await supabase
      .from('order_packaging')
      .insert({
        order_id: orderId,
        packaging_item_id: item.id,
        packaging_item_name: item.name,
        quantity,
        unit_price: item.price,
      })
      .select()
      .single()
    if (!error && data) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, order_packaging: [...order.order_packaging, data as OrderPackagingRow] }
            : order,
        ),
      )
    }
  }

  async function editPackaging(orderId: string, rowId: string, packagingItemId: string, quantity: number) {
    const item = packagingItems.find((candidate) => candidate.id === packagingItemId)
    if (!item) return
    const { error } = await supabase
      .from('order_packaging')
      .update({
        packaging_item_id: item.id,
        packaging_item_name: item.name,
        quantity,
        unit_price: item.price,
      })
      .eq('id', rowId)
    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                order_packaging: order.order_packaging.map((row) =>
                  row.id === rowId
                    ? {
                        ...row,
                        packaging_item_id: item.id,
                        packaging_item_name: item.name,
                        quantity,
                        unit_price: item.price,
                      }
                    : row,
                ),
              }
            : order,
        ),
      )
    }
  }

  async function removePackaging(orderId: string, rowId: string) {
    const { error } = await supabase.from('order_packaging').delete().eq('id', rowId)
    if (!error) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? { ...order, order_packaging: order.order_packaging.filter((row) => row.id !== rowId) }
            : order,
        ),
      )
    }
  }

  async function markCompleted(id: string) {
    const { error } = await supabase.from('orders').update({ status: 'completed' }).eq('id', id)
    if (!error) {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status: 'completed' } : order)),
      )
    }
  }

  async function toggleDiscount(id: string, discount: boolean) {
    const updates = discount ? { discount } : { discount, promo_code: null }
    const { error } = await supabase.from('orders').update(updates).eq('id', id)
    if (!error) {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...updates } : order)))
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return
    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', confirmDelete.id)
      .select('id')
    if (!error && data && data.length > 0) {
      setOrders((prev) => prev.filter((order) => order.id !== confirmDelete.id))
    }
    setConfirmDelete(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowNewOrder(true)}
          className="rounded-full bg-cookie-rust px-4 py-1.5 text-xs font-bold text-cookie-cream uppercase"
        >
          + New order
        </button>
        <div className="inline-flex rounded-full bg-cookie-charcoal/10 p-1">
          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-colors ${
              statusFilter === 'pending' ? 'bg-cookie-rust text-cookie-cream' : 'text-cookie-charcoal/60'
            }`}
          >
            Current
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase transition-colors ${
              statusFilter === 'completed' ? 'bg-cookie-rust text-cookie-cream' : 'text-cookie-charcoal/60'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-cookie-charcoal/15 bg-white sm:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="bg-cookie-brown text-xs font-bold text-cookie-cream uppercase">
              <th className="px-3 py-2">Customer</th>
              <th className="px-3 py-2">Pickup</th>
              <th className="px-3 py-2">Items</th>
              <th className="px-3 py-2">Notes</th>
              <th className="px-3 py-2 text-center">Discount</th>
              <th className="px-3 py-2">Code</th>
              <th className="px-3 py-2 text-center">Total</th>
              {statusFilter === 'completed' && <th className="px-3 py-2 text-center">Packaging</th>}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order.id} className={index % 2 === 1 ? 'bg-cookie-honey/25' : ''}>
                <td className="px-3 py-2">
                  <p className="font-bold text-cookie-brown">{order.full_name}</p>
                  <p className="text-xs text-cookie-charcoal/50">+389{order.phone}</p>
                  <p className="text-xs text-cookie-charcoal/50">{order.email}</p>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-cookie-charcoal/70">
                  {formatPickupCell(order.pickup_date, order.pickup_time)}
                </td>
                <td className="px-3 py-2 text-cookie-charcoal/70">
                  {order.order_items.map((item) => (
                    <p key={item.id}>
                      {item.cookie_name} x{item.quantity}
                    </p>
                  ))}
                </td>
                <td className="max-w-[200px] px-3 py-2 whitespace-pre-wrap text-cookie-charcoal/70">
                  {order.notes}
                </td>
                <td className="px-3 py-2">
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={order.discount}
                      onChange={(event) => toggleDiscount(order.id, event.target.checked)}
                      aria-label="10 den per cookie discount applied"
                      className="h-4 w-4 accent-cookie-rust"
                    />
                  </div>
                </td>
                <td className="px-3 py-2 font-mono text-cookie-charcoal/70">
                  {order.promo_code ?? '—'}
                </td>
                <td className="px-3 py-2 text-center font-mono font-bold text-cookie-brown">
                  {effectiveTotal(order)} den
                </td>
                {statusFilter === 'completed' && (
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => setPackagingOrderId(order.id)}
                      className="rounded-full border border-cookie-charcoal/20 px-3 py-1 font-mono text-xs font-bold text-cookie-charcoal/70 uppercase"
                    >
                      {formatDen(packagingCost(order))} den
                    </button>
                  </td>
                )}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <OrderActionButtons order={order} onMarkCompleted={markCompleted} onDelete={setConfirmDelete} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <p className="px-4 py-6 text-sm text-cookie-charcoal/50">
            No {statusFilter === 'pending' ? 'current' : 'completed'} orders.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            showPackaging={statusFilter === 'completed'}
            onToggleDiscount={toggleDiscount}
            onMarkCompleted={markCompleted}
            onDelete={setConfirmDelete}
            onOpenPackaging={setPackagingOrderId}
          />
        ))}
        {filteredOrders.length === 0 && (
          <p className="rounded-lg border border-cookie-charcoal/15 bg-white px-4 py-6 text-sm text-cookie-charcoal/50">
            No {statusFilter === 'pending' ? 'current' : 'completed'} orders.
          </p>
        )}
      </div>

      {confirmDelete && (
        <ConfirmModal
          message={
            <>
              Delete the order from{' '}
              <span className="font-bold text-cookie-brown">{confirmDelete.full_name}</span>? This
              can&apos;t be undone.
            </>
          }
          onCancel={() => setConfirmDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {packagingOrder && (
        <PackagingModal
          order={packagingOrder}
          packagingItems={packagingItems}
          onAdd={addPackaging}
          onEdit={editPackaging}
          onRemove={removePackaging}
          onClose={() => setPackagingOrderId(null)}
        />
      )}

      {showNewOrder && (
        <NewOrderModal
          cookieOptions={cookieOptions}
          onCreate={createOrder}
          onClose={() => setShowNewOrder(false)}
        />
      )}
    </div>
  )
}

export default OrdersTab
