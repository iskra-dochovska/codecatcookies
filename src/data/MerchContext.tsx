import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'

export type MerchImage = { src: string }

export type Merch = {
  slug: string
  name: string
  description: string
  price: number
  height: string | null
  width: string | null
  images: MerchImage[]
}

type MerchContextValue = {
  merch: Merch[]
  loading: boolean
  error: boolean
}

const MerchContext = createContext<MerchContextValue | undefined>(undefined)

type MerchRow = {
  slug: string
  name: string
  description: string
  price: number
  height: string | null
  width: string | null
  merch_images: { path: string; position: number }[]
}

function mapRow(row: MerchRow): Merch {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    height: row.height,
    width: row.width,
    images: [...row.merch_images]
      .sort((a, b) => a.position - b.position)
      .map((image) => ({ src: image.path })),
  }
}

export function MerchProvider({ children }: { children: ReactNode }) {
  const [merch, setMerch] = useState<Merch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('merch')
      .select('slug, name, description, price, height, width, merch_images(path, position)')
      .eq('active', true)
      .order('position', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setError(true)
          setLoading(false)
          return
        }
        setMerch((data as MerchRow[]).map(mapRow))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return <MerchContext.Provider value={{ merch, loading, error }}>{children}</MerchContext.Provider>
}

export function useMerch() {
  const context = useContext(MerchContext)
  if (!context) throw new Error('useMerch must be used within a MerchProvider')
  return context
}
