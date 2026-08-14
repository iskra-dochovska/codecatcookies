import type { Lang } from './LanguageContext'

type Dict = Record<string, { en: string; mk: string }>

export function t(dict: Dict, key: string, lang: Lang): string {
  return dict[key]?.[lang] ?? key
}

export const scaleLabels: Dict = {
  Sweetness: { en: 'Sweetness', mk: 'Слаткост' },
  Chewiness: { en: 'Chewiness', mk: 'Мекост' },
  Thickness: { en: 'Thickness', mk: 'Дебелина' },
}

export const nutritionLabels: Dict = {
  Calories: { en: 'Calories', mk: 'Калории' },
  'Total fat': { en: 'Total fat', mk: 'Вкупни масти' },
  'Saturated fat': { en: 'Saturated fat', mk: 'Заситени масти' },
  Carbohydrates: { en: 'Carbohydrates', mk: 'Јаглехидрати' },
  Sugars: { en: 'Sugars', mk: 'Шеќери' },
  Fiber: { en: 'Fiber', mk: 'Влакна' },
  Protein: { en: 'Protein', mk: 'Протеини' },
  Sodium: { en: 'Sodium', mk: 'Натриум' },
  Caffeine: { en: 'Caffeine', mk: 'Кофеин' },
}

export const nutritionValues: Dict = {
  Yes: { en: 'Yes', mk: 'Да' },
}

export const allergenLabels: Dict = {
  'Wheat (gluten)': { en: 'Wheat (gluten)', mk: 'Пченица (глутен)' },
  Egg: { en: 'Egg', mk: 'Јајце' },
  Milk: { en: 'Milk', mk: 'Млеко' },
  Peanuts: { en: 'Peanuts', mk: 'Кикирики' },
  Honey: { en: 'Honey', mk: 'Мед' },
}

export const ui: Dict = {
  nutritionAndAllergens: { en: 'Nutrition & allergens', mk: 'Нутритивна вредност и алергени' },
  nutrition: { en: 'Nutrition', mk: 'Нутритивна вредност' },
  perCookie: { en: 'per cookie', mk: 'по колаче' },
  allergens: { en: 'Allergens', mk: 'Алергени' },
  mayContain: { en: 'May contain', mk: 'Може да содржи' },
  nutritionDisclaimer: {
    en: 'Values are rough estimates, not exact calculations.',
    mk: 'Вредностите се груби проценки, не точни пресметки.',
  },
}
