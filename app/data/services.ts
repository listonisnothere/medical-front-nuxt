export interface Service {
  slug: string
  title: string
  description: string
  icon: string
}

export const services: Service[] = [
  {
    slug: 'consulting',
    title: 'Консалтинг',
    description:
      'Подбор оборудования и техническая экспертиза для медицинских учреждений любого профиля.',
    icon: '◆',
  },
  {
    slug: 'design',
    title: 'Проектирование медицинских учреждений',
    description: 'Разработка архитектурных и инженерных решений «под ключ».',
    icon: '▲',
  },
  {
    slug: 'equipment',
    title: 'Оснащение медицинских учреждений',
    description: 'Поставка, монтаж и пусконаладка оборудования по СанПиН и стандартам Минздрава.',
    icon: '■',
  },
  {
    slug: 'marketing',
    title: 'Медицинский маркетинг',
    description: 'Стратегия продвижения клиники: брендинг, digital, программы лояльности.',
    icon: '●',
  },
  {
    slug: 'service',
    title: 'Сервисное обслуживание',
    description: 'Гарантийный и постгарантийный сервис собственными инженерами по СНГ.',
    icon: '✦',
  },
  {
    slug: 'digitalization',
    title: 'Цифровизация медицинского бизнеса',
    description: 'Внедрение МИС, PACS, телемедицины и аналитики.',
    icon: '◇',
  },
  {
    slug: 'training',
    title: 'Обучение',
    description: 'Тренинги для врачей и инженеров на оборудовании ведущих производителей.',
    icon: '★',
  },
  {
    slug: 'trade-in',
    title: 'Trade-in',
    description: 'Зачёт старого оборудования при покупке нового — выгодное обновление парка.',
    icon: '↻',
  },
  {
    slug: 'leasing',
    title: 'Лизинг',
    description: 'Гибкие финансовые программы и партнёрские условия с банками региона.',
    icon: '₸',
  },
]
