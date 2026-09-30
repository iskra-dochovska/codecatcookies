import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export type OrderItemRow = {
  id: string
  cookie_slug: string
  cookie_name: string
  quantity: number
  unit_price: number
  unit_cost: number
}

export type OrderMerchItemRow = {
  id: string
  merch_slug: string
  merch_name: string
  quantity: number
  unit_price: number
  unit_cost: number
}

export type OrderStatus = 'pending' | 'completed'

export type OrderPackagingRow = {
  id: string
  packaging_item_id: string | null
  packaging_item_name: string
  quantity: number
  unit_price: number
}

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
  discount_amount: number
  promo_code: string | null
  order_items: OrderItemRow[]
  order_merch_items: OrderMerchItemRow[]
  order_packaging: OrderPackagingRow[]
}

export function orderQuantity(order: OrderRow) {
  return order.order_items.reduce((sum, item) => sum + item.quantity, 0)
}

export function packagingCost(order: OrderRow) {
  return order.order_packaging.reduce((sum, item) => sum + item.quantity * item.unit_price, 0)
}

export function effectiveTotal(order: OrderRow) {
  return order.total - order.discount_amount
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
      .select('*, order_items(*), order_merch_items(*), order_packaging(*)')
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
