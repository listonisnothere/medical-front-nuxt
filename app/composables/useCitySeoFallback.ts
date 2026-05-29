import type { City } from '@/stores/citiesData'
import type { FaqItem } from '@/composables/useMeta'

interface CitySeoParts {
  title: string
  description: string
  keywords: string
  faq: FaqItem[]
}

export function buildCitySeoFallback(catTitle: string, city: City): CitySeoParts {
  const name = city.name
  const prep = city.namePrep
  const region = city.region

  const faq: FaqItem[] = [
    {
      question: `Какова цена на ${catTitle.toLowerCase()} ${prep}?`,
      answer: `Цена на ${catTitle.toLowerCase()} ${prep} зависит от модели, комплектации и производителя. Оставьте заявку — мы подготовим коммерческое предложение в течение 2 часов.`,
    },
    {
      question: `Как осуществляется доставка ${catTitle.toLowerCase()} ${prep}?`,
      answer: `Доставка по ${prep} и ${region.replace(/_/g, ' ')} выполняется нашими партнёрами. Сроки — 2–14 рабочих дней в зависимости от наличия на складе.`,
    },
    {
      question: `Включает ли поставка монтаж и пусконаладку?`,
      answer: `Да. В стоимость поставки входят монтаж, пусконаладочные работы, обучение персонала и первичное техническое обслуживание.`,
    },
    {
      question: `Какова гарантия на оборудование?`,
      answer: `На всё оборудование предоставляется официальная гарантия производителя (от 12 до 36 месяцев) и сертификат соответствия РК.`,
    },
    {
      question: `Возможна ли оплата для юридических лиц?`,
      answer: `Да. Мы работаем как с юридическими, так и с физическими лицами. Доступны безналичный расчёт, лизинг и рассрочка платежа.`,
    },
  ]

  return {
    title: `${catTitle} ${prep} — купить с доставкой`,
    description: `Купить ${catTitle.toLowerCase()} ${prep}. Официальный дилер, сертификат РК. Доставка по ${name} и области, монтаж, обучение персонала, гарантия. КП за 2 часа.`,
    keywords: `${catTitle} ${name}, купить ${catTitle.toLowerCase()} ${prep}, ${catTitle.toLowerCase()} цена ${name}, медтехника ${name}, медицинское оборудование ${name}`,
    faq,
  }
}
