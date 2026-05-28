import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'

export const useClientsDataStore = defineStore('clientsData', () => {
  const items = ref<string[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/clients')
      items.value = Array.isArray(data) ? data.map((c: any) => c.name ?? c) : []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
