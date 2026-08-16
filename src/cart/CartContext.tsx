import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export const MIN_CHECKOUT_ITEMS = 4

type CartItems = Record<string, number>

type CartContextValue = {
  items: CartItems
  totalCount: number
  increment: (slug: string) => void
  decrement: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

const STORAGE_KEY = 'codecatcookies-cart'

function loadStoredItems(): CartItems {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItems) : {}
  } catch {
    return {}
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItems>(loadStoredItems)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const increment = (slug: string) => {
    setItems((prev) => {
      const next = { ...prev }
      next[slug] = (next[slug] ?? 0) + 1
      return next
    })
  }

  const decrement = (slug: string) => {
    setItems((prev) => {
      const next = { ...prev }
      const quantity = (next[slug] ?? 0) - 1
      if (quantity <= 0) delete next[slug]
      else next[slug] = quantity
      return next
    })
  }

  const remove = (slug: string) => {
    setItems((prev) => {
      const next = { ...prev }
      delete next[slug]
      return next
    })
  }

  const clear = () => setItems({})

  const totalCount = Object.values(items).reduce((sum, quantity) => sum + quantity, 0)

  return (
    <CartContext.Provider value={{ items, totalCount, increment, decrement, remove, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
