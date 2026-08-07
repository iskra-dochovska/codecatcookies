import chocolateChip from '../assets/choco_chip.png'
import coffeeAndCream from '../assets/coffee_and_cream.webp'
import doubleChocolatePeanutButter from '../assets/double_choco_pb.png'
import whiteChocolate from '../assets/white_chocolate.png'
import lemon from '../assets/lemon.png'

export type Cookie = {
  slug: string
  name: string
  image?: string
  tagline: string
  scales?: { label: string; value: number }[]
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
      { label: 'Sweetness', value: 3 },
      { label: 'Chewiness', value: 2 },
      { label: 'Thickness', value: 3 },
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
    tagline: 'Nutty and sticky',
    scales: [
      { label: 'Sweetness', value: 5 },
      { label: 'Chewiness', value: 4 },
      { label: 'Thickness', value: 5 },
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
      { label: 'Sweetness', value: 2 },
      { label: 'Chewiness', value: 3 },
      { label: 'Thickness', value: 2 },
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
  {
    slug: 'white-chocolate',
    name: 'White chocolate',
    image: whiteChocolate,
    tagline: 'Milky, sweet goodness',
    scales: [
      { label: 'Sweetness', value: 4 },
      { label: 'Chewiness', value: 4 },
      { label: 'Thickness', value: 2 },
    ],
    nutrition: [
      { label: 'Calories', value: '264 kcal' },
      { label: 'Total fat', value: '15g' },
      { label: 'Saturated fat', value: '9g', indent: true },
      { label: 'Carbohydrates', value: '30g' },
      { label: 'Sugars', value: '15g', indent: true },
      { label: 'Fiber', value: '0.5g', indent: true },
      { label: 'Protein', value: '3g' },
      { label: 'Sodium', value: '88mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
  },
  {
    slug: 'lemon',
    name: 'Lemon',
    image: lemon,
    tagline: 'Zesty and bright',
    scales: [
      { label: 'Sweetness', value: 3 },
      { label: 'Chewiness', value: 4 },
      { label: 'Thickness', value: 3 },
    ],
    nutrition: [
      { label: 'Calories', value: '287 kcal' },
      { label: 'Total fat', value: '13g' },
      { label: 'Saturated fat', value: '7.8g', indent: true },
      { label: 'Carbohydrates', value: '38g' },
      { label: 'Sugars', value: '13g', indent: true },
      { label: 'Fiber', value: '1g', indent: true },
      { label: 'Protein', value: '4g' },
      { label: 'Sodium', value: '76mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
  },
  {
    slug: 'caramel',
    name: 'Caramel',
    tagline: 'Sticky sweet',
    scales: [
      { label: 'Sweetness', value: 4 },
      { label: 'Chewiness', value: 4 },
      { label: 'Thickness', value: 1 },
    ],
    nutrition: [
      { label: 'Calories', value: '305 kcal' },
      { label: 'Total fat', value: '15g' },
      { label: 'Saturated fat', value: '9g', indent: true },
      { label: 'Carbohydrates', value: '38g' },
      { label: 'Sugars', value: '26g', indent: true },
      { label: 'Fiber', value: '0.4g', indent: true },
      { label: 'Protein', value: '2g' },
      { label: 'Sodium', value: '269mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
  },
  {
    slug: 'oatmeal',
    name: 'Oatmeal',
    tagline: 'Pass the oats brother',
    scales: [
      { label: 'Sweetness', value: 3 },
      { label: 'Chewiness', value: 3 },
      { label: 'Thickness', value: 3 },
    ],
    nutrition: [
      { label: 'Calories', value: '262 kcal' },
      { label: 'Total fat', value: '11g' },
      { label: 'Saturated fat', value: '6.2g', indent: true },
      { label: 'Carbohydrates', value: '36g' },
      { label: 'Sugars', value: '15.7g', indent: true },
      { label: 'Fiber', value: '1.9g', indent: true },
      { label: 'Protein', value: '5g' },
      { label: 'Sodium', value: '146mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk', 'Honey'],
    },
  },
  {
    slug: 'cornflakes-and-oats',
    name: 'Cornflakes & Oats',
    tagline: 'Breakfast of champions',
    scales: [
      { label: 'Sweetness', value: 4 },
      { label: 'Chewiness', value: 4 },
      { label: 'Thickness', value: 3 },
    ],
    nutrition: [
      { label: 'Calories', value: '297 kcal' },
      { label: 'Total fat', value: '14.8g' },
      { label: 'Saturated fat', value: '8.7g', indent: true },
      { label: 'Carbohydrates', value: '37.7g' },
      { label: 'Sugars', value: '17g', indent: true },
      { label: 'Fiber', value: '1.4g', indent: true },
      { label: 'Protein', value: '4g' },
      { label: 'Sodium', value: '343mg' },
    ],
    allergens: {
      contains: ['Wheat (gluten)', 'Egg', 'Milk'],
    },
  },
]
