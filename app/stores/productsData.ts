import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import type { Product } from '@/data/products'

export const useProductsDataStore = defineStore('productsData', () => {
  const items = ref<Product[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/products', { params: { limit: 100 } })
      items.value = Array.isArray(data) ? data : (data.data ?? [])
    } catch {
      items.value = []
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
