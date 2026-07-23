import chocolateChip from '../assets/chocolate_chip.webp'
import coffeeAndCream from '../assets/coffee_and_cream.webp'
import doubleChocolatePeanutButter from '../assets/double_chocolate_peanut_butter.webp'

export type Cookie = {
  slug: string
  name: string
  image: string
  tagline: string
  description?: string
  nutrition?: { label: string; value: string; indent?: boolean }[]
  allergens?: {
    contains: string[]
    mayContain?: string[]
  }
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
  },
  {
    slug: 'coffee-and-cream',
    name: 'Coffee and cream',
    image: coffeeAndCream,
    tagline: 'Sweet, soft, aromatic',
    description:
      "A soft, buttery cookie brewed with real coffee for a warm, aromatic bite. Simple ingredients, big flavor, perfect for anyone who wants their coffee and cookie in one.",
    nutrition: [
      { label: 'Calories', value: '250 kcal' },
      { label: 'Total fat', value: '12g' },
      { label: 'Saturated fat', value: '7g', indent: true },
      { label: 'Carbohydrates', value: '32g' },
      { label: 'Sugars', value: '15g', indent: true },
      { label: 'Fiber', value: '0.6g', indent: true },
      { label: 'Protein', value: '3g' },
      { label: 'Sodium', value: '78mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
  },
]
