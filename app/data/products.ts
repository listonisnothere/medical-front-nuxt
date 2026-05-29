export type ProductClass = 'Expert' | 'Высокий' | 'Базовый'

export interface ProductCityAvailability {
  cityId: string
  cityName: string
  cityNamePrep?: string
  stockStatus: StockStatus
  deliveryDays?: number | null
  priceOverride?: number | null
}

export type StockStatus = 'in_stock' | 'on_order' | 'out_of_stock'
export type PriceCurrency = 'KZT' | 'USD' | 'EUR'
export type BadgeKey = 'hot' | 'new' | 'sale' | 'in-stock'

export interface QuickSpec {
  val: string
  label: string
  icon?: string
}

export interface Product {
  id: string
  name: string
  brand: string
  category: string
  productClass: ProductClass
  price: string
  priceFrom?: number | null
  priceCurrency?: PriceCurrency
  priceNote?: string
  badge?: string
  badgeKey?: BadgeKey
  image: string
  description?: string
  shortDescription?: string
  specs?: Record<string, string>
  quickSpecs?: QuickSpec[]
  highlights?: string[]
  stockStatus?: StockStatus
  stockQuantity?: number | null
  deliveryDays?: string
  urgencyText?: string
  socialProof?: string
  rating?: number | null
  reviewsCount?: number
  discountPercent?: number | null
  discountUntil?: string | null
  createdAt?: string
  cityAvailability?: ProductCityAvailability | null
  alternativeCities?: { cityId: string; citySlug: string; cityName: string; stockStatus: StockStatus; deliveryDays?: number | null }[]
}

