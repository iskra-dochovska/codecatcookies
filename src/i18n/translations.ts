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

export const cookieTaglines: Dict = {
  'chocolate-chip': {
    en: 'Classics have never tasted so good',
    mk: 'Класичен вкус никогаш не бил поубав',
  },
  'double-chocolate-peanut-butter': {
    en: 'Sticky centered hugged by a lotta chocolate',
    mk: 'Полнета средина гушната од мнооогу чоколадо',
  },
  'white-chocolate': {
    en: 'The fairest in the land',
    mk: 'Најубавата на целиот свет',
  },
  lemon: {
    en: 'Pucker up and give me a smooch',
    mk: 'Спреми се за благо киселки бакнежи',
  },
  caramel: {
    en: 'Sugar in its stickiest form',
    mk: 'Шеќер во најлеплива варијанта',
  },
  oatmeal: {
    en: 'Cheeky little breakfast treat',
    mk: 'Почасти се малку за доручек',
  },
  'dark-chocolate-orange': {
    en: 'Match made in heaven',
    mk: 'Едноставно врвна комбинација',
  },
  'cinnamon-swirl': {
    en: 'The best pick me up for rainy days',
    mk: 'Најдобрата утеха на врнежливи денови',
  },
  'earl-grey': {
    en: 'Even your cookie is sophisticated',
    mk: 'Дури и кукисот ти е софистициран',
  },
  'triple-chocolate': {
    en: 'There will never be enough chocolate',
    mk: 'Никогаш нема доволно чоколадо',
  },
}

export const ui: Dict = {
  currency: { en: 'den', mk: 'ден' },
  addToCart: { en: 'Add to cart', mk: 'Додади во кошничка' },
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
    en: 'Minimum order is 4 cookies, add {n} more to checkout.',
    mk: 'Минималната нарачка е 4 колачиња, додадете уште {n} за нарачка.',
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
  selectDate: { en: 'Select a date', mk: 'Изберете датум' },
  selectTime: { en: 'Select a time', mk: 'Изберете час' },
  noTimesAvailable: {
    en: 'No pickup times left that day — orders need at least 24h notice. Pick a later date.',
    mk: 'Нема слободни термини тој ден — нарачките бараат најмалку 24ч претходно. Изберете подоцнежен датум.',
  },
  orderNotes: { en: 'Order notes (optional)', mk: 'Забелешки (по желба)' },
  orderNotesPlaceholder: {
    en: 'Allergies, custom requests, anything else we should know…',
    mk: 'Алергии, посебни барања, нешто друго што треба да знаеме…',
  },
  pickupAddressLabel: { en: 'Pickup address', mk: 'Адреса за подигање' },
  cashPaymentNotice: {
    en: 'Payment: done in cash at pickup',
    mk: 'Плаќање: во готово при подигање',
  },
  placeOrder: { en: 'Place order', mk: 'Потврди нарачка' },
  placingOrder: { en: 'Placing order…', mk: 'Се испраќа…' },
  orderSubmitError: {
    en: "Something went wrong sending your order. Please try again or email us at info@codecatcookies.com.",
    mk: 'Настана грешка при испраќање на нарачката. Обидете се повторно или пишете ни на info@codecatcookies.com.',
  },
  orderConfirmedTitle: { en: 'Order received!', mk: 'Нарачката е примена!' },
  orderConfirmedBody: {
    en: 'Thank you for your order, please check your email for your order confirmation.',
    mk: 'Ви благодариме за нарачката, проверете ја вашата е-пошта за потврда на нарачката.',
  },
  backToCookies: { en: 'Back to cookies', mk: 'Назад кон колачиња' },

  navHome: { en: 'Home', mk: 'Почетна' },
  navCookies: { en: 'Cookies', mk: 'Колачиња' },

  yourCart: { en: 'Your cart', mk: 'Вашата кошничка' },
  emptyCartMessage: {
    en: 'Your cart is empty. Add some cookies!',
    mk: 'Вашата кошничка е празна. Додадете колачиња!',
  },
  cookiesCountLabel: { en: 'Cookies', mk: 'Колачиња' },
  total: { en: 'Total', mk: 'Вкупно' },

  allRightsReserved: { en: 'All rights reserved.', mk: 'Сите права задржани.' },

  findYourFavorite: { en: 'Find your favorite', mk: 'Пронајдете го вашето омилено' },

  seeAllCookies: { en: 'See all cookies', mk: 'Погледнете ги сите колачиња' },
  howToBuy: { en: 'How to buy codecatcookies', mk: 'Како да купите codecatcookies' },
  followButton: { en: 'Follow @codecatcookies', mk: 'Следете @codecatcookies' },
}
