import chocolateChip from '../assets/chocolate_chip.webp'
import coffeeAndCream from '../assets/coffee_and_cream.webp'
import doubleChocolatePeanutButter from '../assets/double_chocolate_peanut_butter.webp'

export type Cookie = {
  slug: string
  name: string
  image: string
  tagline: string
  description: string
  nutrition: { label: string; value: string; indent?: boolean }[]
  allergens: {
    contains: string[]
    mayContain?: string[]
  }
  pairings: { type: 'Coffee' | 'Tea'; name: string; note: string }[]
}

export const cookies: Cookie[] = [
  {
    slug: 'chocolate-chip',
    name: 'Chocolate chip',
    image: chocolateChip,
    tagline: 'Crumbly, fluffy, not too sweet',
    description:
      'Our take on a cookie classic. Made to be dunked in a hot cup of cappuccino and enjoyed by the dozens. This cookie will have you thinking about it for the whole day due to its velvety after taste.',
    nutrition: [
      { label: 'Calories', value: '265 kcal' },
      { label: 'Total fat', value: '14g' },
      { label: 'Saturated fat', value: '8.5g', indent: true },
      { label: 'Carbohydrates', value: '33g' },
      { label: 'Sugars', value: '17g', indent: true },
      { label: 'Fiber', value: '1g', indent: true },
      { label: 'Protein', value: '3g' },
      { label: 'Sodium', value: '36mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
    pairings: [
      {
        type: 'Coffee',
        name: 'Medium-roast drip coffee',
        note: 'Balances the sweetness and cuts through the butter without competing with the chocolate.',
      },
      {
        type: 'Coffee',
        name: 'Cappuccino or latte',
        note: 'The milky foam mirrors the fluffy, crumbly texture and mellows the chocolate.',
      },
      {
        type: 'Tea',
        name: 'Earl Grey',
        note: 'Bergamot citrus cuts the richness and plays nicely against the chocolate.',
      },
      {
        type: 'Tea',
        name: 'Chai',
        note: 'Warm cinnamon and cardamom spice complement the brown sugar notes.',
      },
    ],
  },
  {
    slug: 'double-chocolate-peanut-butter',
    name: 'Double chocolate peanut butter',
    image: doubleChocolatePeanutButter,
    tagline: 'Dense, rich, chewy',
    description:
      'This is for all our chocolate lovers. The iconic chocolate and peanut butter combination is rich and chewy, perfect for all of us with a major sweet tooth.',
    nutrition: [
      { label: 'Calories', value: '418 kcal' },
      { label: 'Total fat', value: '25.5g' },
      { label: 'Saturated fat', value: '11.8g', indent: true },
      { label: 'Carbohydrates', value: '43g' },
      { label: 'Sugars', value: '22.5g', indent: true },
      { label: 'Fiber', value: '3g', indent: true },
      { label: 'Protein', value: '8g' },
      { label: 'Sodium', value: '189mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk', 'Peanuts'],
    },
    pairings: [
      {
        type: 'Coffee',
        name: 'Dark roast espresso or Americano',
        note: 'Bold bitterness cuts the richness and cocoa intensity, and offsets the peanut butter fat.',
      },
      {
        type: 'Coffee',
        name: 'Cold brew',
        note: 'Smooth, low-acid intensity stands up to the density without adding more sweetness.',
      },
      {
        type: 'Tea',
        name: 'Assam black tea',
        note: 'Malty, robust body matches the dense chew and deep chocolate.',
      },
      {
        type: 'Tea',
        name: 'Peppermint tea',
        note: 'Cool, sharp mint cuts through the richness and complements the chocolate.',
      },
    ],
  },
  {
    slug: 'coffee-and-cream',
    name: 'Coffee and cream',
    image: coffeeAndCream,
    tagline: 'Thin, snappy, caramelized',
    description:
      "When it's not enough to drink your coffee, you also have to infuse your cookies with it. If you're someone who is mindful of texture and enjoys a nice snap, this is for you. This cookie has a perfectly caramelized snappy bottom and smells like a shot of espresso.",
    nutrition: [
      { label: 'Calories', value: '268 kcal' },
      { label: 'Total fat', value: '10.5g' },
      { label: 'Saturated fat', value: '6.4g', indent: true },
      { label: 'Carbohydrates', value: '40g' },
      { label: 'Sugars', value: '22g', indent: true },
      { label: 'Fiber', value: '0.5g', indent: true },
      { label: 'Protein', value: '3g' },
      { label: 'Sodium', value: '119mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
    pairings: [
      {
        type: 'Coffee',
        name: 'Flat white or macchiato',
        note: 'The milky espresso echoes the marbled coffee-and-cream look without overpowering the cookie.',
      },
      {
        type: 'Coffee',
        name: 'Iced coffee',
        note: 'A cool contrast to the crisp, caramelized snap.',
      },
      {
        type: 'Tea',
        name: 'English breakfast',
        note: 'Strong, malty black tea holds its own next to the coffee flavor without clashing.',
      },
      {
        type: 'Tea',
        name: 'Rooibos',
        note: 'Naturally sweet, caramel-like notes echo the caramelized bottom, caffeine-free.',
      },
    ],
  },
]
