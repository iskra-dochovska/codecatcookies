import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { DISCOUNT_PER_COOKIE } from '../../lib/discount'

export type OrderItemRow = {
  id: string
  cookie_slug: string
  cookie_name: string
  quantity: number
  unit_price: number
  unit_cost: number
}

export type OrderStatus = 'pending' | 'completed'

export type OrderRow = {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  pickup_date: string
  pickup_time: string
  notes: string | null
  total: number
  status: OrderStatus
  discount: boolean
  promo_code: string | null
  order_items: OrderItemRow[]
}

export function orderQuantity(order: OrderRow) {
  return order.order_items.reduce((sum, item) => sum + item.quantity, 0)
}

export function effectiveTotal(order: OrderRow) {
  return order.discount ? order.total - DISCOUNT_PER_COOKIE * orderQuantity(order) : order.total
}

export function formatPickupCell(pickupDate: string, pickupTime: string) {
  const [year, month, day] = pickupDate.split('-').map(Number)
  const prettyDate = new Date(year, month - 1, day).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${pickupTime} · ${prettyDate}`
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setOrders((data as OrderRow[] | null) ?? [])
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { orders, setOrders, loading }
}
