import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import { services as fallback, type Service } from '@/data/services'

export const useServicesDataStore = defineStore('servicesData', () => {
  const items = ref<Service[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/services')
      const list = Array.isArray(data) ? data : []
      items.value = list.length ? list : fallback
    } catch {
      items.value = fallback
    } finally {
      loaded.value = true
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
