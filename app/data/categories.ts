export interface FaqItem {
  question: string
  answer: string
}

export interface Category {
  id: string
  slug: string
  title: string
  short: string
  icon?: string | null
  parentId?: string | null
  faq?: FaqItem[]
  children?: Category[]
}
