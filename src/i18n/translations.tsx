import type { Lang } from './LanguageContext'

export const nutritionLabels: Record<Lang, Record<string, string>> = {
  en: {
    Calories: 'Calories',
    'Total fat': 'Total fat',
    'Saturated fat': 'Saturated fat',
    Carbohydrates: 'Carbohydrates',
    Sugars: 'Sugars',
    Fiber: 'Fiber',
    Protein: 'Protein',
    Sodium: 'Sodium',
  },
  mk: {
    Calories: 'Калории',
    'Total fat': 'Вкупни масти',
    'Saturated fat': 'Заситени масти',
    Carbohydrates: 'Јаглехидрати',
    Sugars: 'Шеќери',
    Fiber: 'Влакна',
    Protein: 'Протеини',
    Sodium: 'Натриум',
  },
}

export const scaleLabels: Record<Lang, Record<string, string>> = {
  en: {
    Sweetness: 'Sweetness',
    Chewiness: 'Chewiness',
    Thickness: 'Thickness',
  },
  mk: {
    Sweetness: 'Сладост',
    Chewiness: 'Џвакливост',
    Thickness: 'Дебелина',
  },
}

export const ui = {
  en: {
    nav: { home: 'Home', cookies: 'Cookies', openMenu: 'Open menu', closeMenu: 'Close menu' },
    hero: {
      before: 'The ',
      highlight: 'only',
      after: ' cookies you want to accept.',
      badge: 'Coming soon',
      imagePlaceholder: 'Image',
    },
    cookiesPreview: {
      seeAll: 'See all cookies',
      imagePlaceholder: 'Image',
    },
    catStory: {
      heading: 'How did we get here?',
      paragraph: (
        <>
          <strong>codecatcookies</strong> is what happens when a programmer quits their day
          job and decides it&apos;s time to touch some grass. The little menace of a cat is
          Sushi, she&apos;s the lifelong micromanager of the business and she guarantees top
          notch quality with every batch baked.
        </>
      ),
    },
    locations: {
      heading: 'Where can you buy our cookies?',
      paragraph: (
        <>
          <strong>codecatcookies</strong> will soon be offered at your favorite cafes around
          town, follow us for more!
        </>
      ),
    },
    follow: {
      heading: 'Follow along',
      paragraph:
        "If you're curious on how we make this whole thing happen, follow us over on Instagram and see the inner workings of a sugar addict and a snappy siamese!",
      button: 'Follow @codecatcookies',
    },
    faqSection: { heading: 'FAQ' },
    cookiesPage: { heading: 'Find your favorite' },
    cookieCard: {
      nutritionAndAllergens: 'Nutrition & allergens',
      nutrition: 'Nutrition',
      perCookie: 'per cookie',
      allergens: 'Allergens',
      mayContain: 'May contain:',
      disclaimer: 'Values are rough estimates, not exact calculations.',
      imagePlaceholder: 'Image',
    },
    footer: {
      copyright: (year: number) => `© ${year} codecatcookies. All rights reserved.`,
    },
  },
  mk: {
    nav: { home: 'Почетна', cookies: 'Колачиња', openMenu: 'Отвори мени', closeMenu: 'Затвори мени' },
    hero: {
      before: '',
      highlight: 'Единствените',
      after: ' колачиња што сакате да ги прифатите.',
      badge: 'Наскоро',
      imagePlaceholder: 'Слика',
    },
    cookiesPreview: {
      seeAll: 'Сите колачиња',
      imagePlaceholder: 'Слика',
    },
    catStory: {
      heading: 'Како стигнавме до тука?',
      paragraph: (
        <>
          <strong>codecatcookies</strong> е она што се случува кога еден програмер го
          напушта своето работно место и одлучува дека е време да излезе на чист воздух.
          Малото немирно маче се вика Суши, таа е доживотниот менаџер на бизнисот и
          гарантира врвен квалитет во секоја серија.
        </>
      ),
    },
    locations: {
      heading: 'Каде можете да ги купите нашите колачиња?',
      paragraph: (
        <>
          <strong>codecatcookies</strong> наскоро ќе биде достапно во вашите омилени
          кафулиња низ градот, следете нè за повеќе!
        </>
      ),
    },
    follow: {
      heading: 'Следете нè',
      paragraph:
        'Ако сте љубопитни како сето ова се случува, следете нè на Instagram и надникнете зад кулисите кај еден зависник од шеќер и една брза сијамска мачка!',
      button: 'Следете нè @codecatcookies',
    },
    faqSection: { heading: 'Прашања' },
    cookiesPage: { heading: 'Пронајдете го вашиот омилен' },
    cookieCard: {
      nutritionAndAllergens: 'Нутритивна вредност и алергени',
      nutrition: 'Нутритивна вредност',
      perCookie: 'по колаче',
      allergens: 'Алергени',
      mayContain: 'Може да содржи:',
      disclaimer: 'Вредностите се приближни проценки, не се точни пресметки.',
      imagePlaceholder: 'Слика',
    },
    footer: {
      copyright: (year: number) => `© ${year} codecatcookies. Сите права се задржани.`,
    },
  },
}

export const faqs: Record<
  Lang,
  { question: React.ReactNode; answer: React.ReactNode }[]
> = {
  en: [
    {
      question: (
        <span>
          Are <strong>codecatcookies</strong> only in Skopje?
        </span>
      ),
      answer:
        "Yes, for now we only sell in Skopje until we figure out how to get the cat a driver's licence.",
    },
    {
      question: "How can I buy cookies for myself or an event I'm organizing?",
      answer: (
        <>
          If you&apos;d like to place a larger order, feel free to email us at{' '}
          <strong>info@codecatcookies.com</strong> with the cookies you&apos;d like and your
          contact information and we&apos;ll be in touch. Please make sure to place your
          order at least 48 hours in advance.
        </>
      ),
    },
    {
      question: (
        <span>
          How do I start selling <strong>codecatcookies</strong> at my establishment?
        </span>
      ),
      answer: (
        <>
          Email us over at <strong>info@codecatcookies.com</strong> and let&apos;s make it
          happen!
        </>
      ),
    },
  ],
  mk: [
    {
      question: (
        <span>
          Дали <strong>codecatcookies</strong> е достапно само во Скопје?
        </span>
      ),
      answer:
        'Да, засега продаваме само во Скопје додека не смислиме како да ѝ издадеме возачка дозвола на мачката.',
    },
    {
      question: 'Како можам да купам колачиња за себе или за настан што го организирам?',
      answer: (
        <>
          Ако сакате да направите поголема нарачка, слободно испратете ни е-пошта на{' '}
          <strong>info@codecatcookies.com</strong> со колачињата што ги сакате и вашите
          контакт информации, и ќе стапиме во контакт. Ве молиме нарачајте најмалку 48 часа
          однапред.
        </>
      ),
    },
    {
      question: (
        <span>
          Како можам да почнам да продавам <strong>codecatcookies</strong> во мојот објект?
        </span>
      ),
      answer: (
        <>
          Испратете ни е-пошта на <strong>info@codecatcookies.com</strong> и да го направиме
          тоа заедно!
        </>
      ),
    },
  ],
}
