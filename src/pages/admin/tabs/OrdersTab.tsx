import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../../lib/supabaseClient'
import { formatDen } from '../../../lib/format'
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
      <select
        value={itemId}
        onChange={(event) => onItemChange(event.target.value)}
        className="min-w-0 flex-1 appearance-none rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1 text-xs text-cookie-charcoal"
      >
        {packagingItems.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} ({formatDen(item.price)} den)
          </option>
        ))}
      </select>
      <input
        type="number"
        min="1"
        step="1"
        value={quantity}
        onChange={(event) => onQuantityChange(event.target.value)}
        className="w-16 rounded-lg border border-cookie-charcoal/20 bg-white px-2 py-1 text-xs text-cookie-charcoal [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
  const filteredOrders = orders.filter((order) => order.status === statusFilter)
  const packagingOrder = orders.find((order) => order.id === packagingOrderId) ?? null

  useEffect(() => {
    supabase
      .from('packaging_items')
      .select('id, name, price')
      .order('name')
      .then(({ data }) => setPackagingItems((data as PackagingItem[] | null) ?? []))
  }, [])

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
      <div className="flex items-center justify-end">
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

      <div className="overflow-x-auto rounded-lg border border-cookie-charcoal/15 bg-white">
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
                    {order.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => markCompleted(order.id)}
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
                    )}
                    {order.status === 'completed' && (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(order)}
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
                    )}
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
    </div>
  )
}

export default OrdersTab
