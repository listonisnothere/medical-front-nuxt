import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import { publications as fallback, type Publication } from '@/data/publications'

// Намеренное отклонение от паттерна остальных data-stores: для блога используется
// локальный fallback. Статьи — статический маркетинговый контент, эндпоинт /publications
// может быть ещё не реализован на бэкенде (см. BACKEND_REQUIREMENTS.md), а пустой /news
// бьёт по SEO и E-E-A-T.
export const usePublicationsDataStore = defineStore('publicationsData', () => {
  const items = ref<Publication[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/publications', { params: { limit: 100 } })
      const list = Array.isArray(data) ? data : (data.data ?? [])
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
