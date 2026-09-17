import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import ConfirmModal from '../ConfirmModal'
import {
  effectiveTotal,
  formatPickupCell,
  type OrderRow,
  type OrderStatus,
} from '../orders'

function OrdersTab({
  orders,
  setOrders,
}: {
  orders: OrderRow[]
  setOrders: React.Dispatch<React.SetStateAction<OrderRow[]>>
}) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('pending')
  const [confirmDelete, setConfirmDelete] = useState<OrderRow | null>(null)
  const filteredOrders = orders.filter((order) => order.status === statusFilter)

  async function markCompleted(id: string) {
    const { error } = await supabase.from('orders').update({ status: 'completed' }).eq('id', id)
    if (!error) {
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? { ...order, status: 'completed' } : order)),
      )
    }
  }

  async function toggleDiscount(id: string, discount: boolean) {
    const { error } = await supabase.from('orders').update({ discount }).eq('id', id)
    if (!error) {
      setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, discount } : order)))
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
              <th className="px-3 py-2 text-center">Total</th>
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
                <td className="px-3 py-2 text-center font-mono font-bold text-cookie-brown">
                  {effectiveTotal(order)} den
                </td>
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
    </div>
  )
}

export default OrdersTab
