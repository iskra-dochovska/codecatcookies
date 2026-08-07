import type { Lang } from '../i18n/LanguageContext'

export const allergenColors: Record<string, { bg: string; mutedBg: string; text: string }> = {
  'Wheat (gluten)': {
    bg: 'bg-cookie-rust',
    mutedBg: 'bg-cookie-rust/40',
    text: 'text-cookie-cream',
  },
  Egg: { bg: 'bg-cookie-gold', mutedBg: 'bg-cookie-gold/40', text: 'text-cookie-cream' },
  Milk: { bg: 'bg-cookie-sky', mutedBg: 'bg-cookie-sky/40', text: 'text-cookie-charcoal' },
  Peanuts: {
    bg: 'bg-cookie-brown',
    mutedBg: 'bg-cookie-brown/40',
    text: 'text-cookie-cream',
  },
  Honey: {
    bg: 'bg-cookie-charcoal',
    mutedBg: 'bg-cookie-charcoal/40',
    text: 'text-cookie-cream',
  },
}

export const defaultAllergenColor = {
  bg: 'bg-cookie-rust',
  mutedBg: 'bg-cookie-rust/40',
  text: 'text-cookie-cream',
}

export const allergenLabels: Record<Lang, Record<string, string>> = {
  en: {
    'Wheat (gluten)': 'Wheat (gluten)',
    Egg: 'Egg',
    Milk: 'Milk',
    Peanuts: 'Peanuts',
    Honey: 'Honey',
  },
  mk: {
    'Wheat (gluten)': 'Пченица (глутен)',
    Egg: 'Јајце',
    Milk: 'Млеко',
    Peanuts: 'Кикирики',
    Honey: 'Мед',
  },
}
