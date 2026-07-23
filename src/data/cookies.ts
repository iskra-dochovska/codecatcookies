import chocolateChip from '../assets/chocolate_chip.webp'
import coffeeAndCream from '../assets/coffee_and_cream.webp'
import doubleChocolatePeanutButter from '../assets/double_chocolate_peanut_butter.webp'

export type Cookie = {
  slug: string
  name: string
  image: string
  tagline: string
  scales?: { left: string; right: string; value: number }[]
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
    tagline: 'Our take on a classic',
    scales: [
      { left: 'Fluffy', right: 'Dense', value: 2 },
      { left: 'Soft', right: 'Crunchy', value: 2 },
      { left: 'Mild', right: 'Bold', value: 2 },
    ],
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
    tagline: 'A timeless combination',
    scales: [
      { left: 'Fluffy', right: 'Dense', value: 5 },
      { left: 'Soft', right: 'Crunchy', value: 3 },
      { left: 'Mild', right: 'Bold', value: 5 },
    ],
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
    tagline: 'Double caffeinated',
    scales: [
      { left: 'Fluffy', right: 'Dense', value: 3 },
      { left: 'Soft', right: 'Crunchy', value: 2 },
      { left: 'Mild', right: 'Bold', value: 3 },
    ],
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
