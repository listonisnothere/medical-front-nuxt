import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import type { Category } from '@/data/categories'

export const useCategoriesDataStore = defineStore('categoriesData', () => {
  const items = ref<Category[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/categories')
      items.value = Array.isArray(data) ? data : []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
