import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import type { Service } from '@/data/services'

export const useServicesDataStore = defineStore('servicesData', () => {
  const items = ref<Service[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/services')
      items.value = Array.isArray(data) ? data : []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
