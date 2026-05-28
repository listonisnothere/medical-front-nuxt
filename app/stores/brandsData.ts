import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export interface FaqItem {
  question: string
  answer: string
}

export interface BrandCertificate {
  title: string
  url: string
}

export interface Brand {
  id: string
  slug: string
  name: string
  country: string
  logoUrl?: string
  isOfficialPartner: boolean
  sortOrder: number
  isVisible: boolean
  bio?: string
  website?: string
  partnershipSince?: number
  categories: string[]
  faq: FaqItem[]
  certificates: BrandCertificate[]
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}

export const useBrandsDataStore = defineStore('brandsData', () => {
  const items = ref<Brand[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/brands')
      items.value = Array.isArray(data) ? data : []
    } catch {
      items.value = []
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
