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
  currency: { en: 'den', mk: 'ден' },
  nutritionAndAllergens: { en: 'Nutrition & allergens', mk: 'Нутритивна вредност и алергени' },
  nutrition: { en: 'Nutrition', mk: 'Нутритивна вредност' },
  perCookie: { en: 'per cookie', mk: 'по колаче' },
  allergens: { en: 'Allergens', mk: 'Алергени' },
  mayContain: { en: 'May contain', mk: 'Може да содржи' },
  nutritionDisclaimer: {
    en: 'Values are rough estimates, not exact calculations.',
    mk: 'Вредностите се груби проценки, не точни пресметки.',
  },
  checkout: { en: 'Checkout', mk: 'Нарачај' },
  checkoutMinNotice: {
    en: 'Add {n} more cookie(s) to checkout — minimum order is 4.',
    mk: 'Додадете уште {n} колаче/а за нарачка — минимум е 4.',
  },
  checkoutTitle: { en: 'Complete your order', mk: 'Завршете ја нарачката' },
  orderSummary: { en: 'Order summary', mk: 'Преглед на нарачка' },
  fullName: { en: 'Full name', mk: 'Име и презиме' },
  email: { en: 'Email', mk: 'Е-пошта' },
  invalidEmail: {
    en: 'Please enter a valid email address.',
    mk: 'Ве молиме внесете валидна е-пошта.',
  },
  phone: { en: 'Phone number', mk: 'Телефонски број' },
  pickupDate: { en: 'Pickup date', mk: 'Датум за подигање' },
  pickupTime: { en: 'Pickup time', mk: 'Час за подигање' },
  selectTime: { en: 'Select a time', mk: 'Изберете час' },
  noTimesAvailable: {
    en: 'No pickup times left that day — orders need at least 24h notice. Pick a later date.',
    mk: 'Нема слободни термини тој ден — нарачките бараат најмалку 24ч претходно. Изберете подоцнежен датум.',
  },
  pickupAddressLabel: { en: 'Pickup address', mk: 'Адреса за подигање' },
  pickupAddressNotice: {
    en: 'Orders are picked up at Prashka 9, 1000 Skopje. Please arrive within your selected time slot.',
    mk: 'Нарачките се подигаат на Прашка 9, 1000 Скопје. Ве молиме доjдете во избраниот термин.',
  },
  advanceNoticeNotice: {
    en: 'Pickup must be at least 24 hours from now.',
    mk: 'Подигањето мора да биде најмалку 24 часа од сега.',
  },
  cashPaymentNotice: {
    en: 'Payment is made in cash at pickup.',
    mk: 'Плаќањето се врши во готово при подигање.',
  },
  placeOrder: { en: 'Place order', mk: 'Потврди нарачка' },
  placingOrder: { en: 'Placing order…', mk: 'Се испраќа…' },
  orderSubmitError: {
    en: "Something went wrong sending your order. Please try again or email us at info@codecatcookies.com.",
    mk: 'Настана грешка при испраќање на нарачката. Обидете се повторно или пишете ни на info@codecatcookies.com.',
  },
  orderConfirmedTitle: { en: 'Order received!', mk: 'Нарачката е примена!' },
  orderConfirmedBody: {
    en: "We'll see you at Prashka 9, 1000 Skopje at your chosen time.",
    mk: 'Ве очекуваме на Прашка 9, 1000 Скопје во избраното време.',
  },
  backToCookies: { en: 'Back to cookies', mk: 'Назад кон колачиња' },
}
