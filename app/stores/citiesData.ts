import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export interface City {
  id: string
  slug: string
  name: string
  namePrep: string
  region: string
  sortOrder: number
  isVisible: boolean
  isDefault: boolean
  faq: { question: string; answer: string }[]
}

export const useCitiesDataStore = defineStore('citiesData', () => {
  const items = ref<City[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/cities')
      items.value = Array.isArray(data) ? data : []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
