import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabaseClient'

export type Cookie = {
  slug: string
  name: string
  image?: string
  price: number
  tagline: { en: string; mk: string }
  scales?: { label: string; value: number }[]
  nutrition?: { label: string; value: string; indent?: boolean }[]
  allergens?: {
    contains: string[]
    mayContain?: string[]
  }
}

type CookiesContextValue = {
  cookies: Cookie[]
  loading: boolean
  error: boolean
}

const CookiesContext = createContext<CookiesContextValue | undefined>(undefined)

type CookieRow = {
  slug: string
  name: string
  price: number
  image_path: string | null
  tagline_en: string
  tagline_mk: string
  scales: { label: string; value: number }[]
  nutrition: { label: string; value: string; indent?: boolean }[]
  allergens: { contains?: string[]; mayContain?: string[] }
}

function mapRow(row: CookieRow): Cookie {
  return {
    slug: row.slug,
    name: row.name,
    price: row.price,
    image: row.image_path ?? undefined,
    tagline: { en: row.tagline_en, mk: row.tagline_mk },
    scales: row.scales.length ? row.scales : undefined,
    nutrition: row.nutrition.length ? row.nutrition : undefined,
    allergens: row.allergens.contains?.length
      ? { contains: row.allergens.contains, mayContain: row.allergens.mayContain }
      : undefined,
  }
}

export function CookiesProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookies] = useState<Cookie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    supabase
      .from('cookies')
      .select('slug, name, price, image_path, tagline_en, tagline_mk, scales, nutrition, allergens')
      .eq('purchasable', true)
      .order('price', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error || !data) {
          setError(true)
          setLoading(false)
          return
        }
        setCookies((data as CookieRow[]).map(mapRow))
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <CookiesContext.Provider value={{ cookies, loading, error }}>
      {children}
    </CookiesContext.Provider>
  )
}

export function useCookies() {
  const context = useContext(CookiesContext)
  if (!context) throw new Error('useCookies must be used within a CookiesProvider')
  return context
}
