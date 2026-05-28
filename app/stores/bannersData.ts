import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export interface Banner {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  linkLabel?: string
  sortOrder: number
}

export const useBannersDataStore = defineStore('bannersData', () => {
  const items = ref<Banner[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/banners')
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
