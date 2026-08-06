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
}

export const defaultAllergenColor = {
  bg: 'bg-cookie-rust',
  mutedBg: 'bg-cookie-rust/40',
  text: 'text-cookie-cream',
}
