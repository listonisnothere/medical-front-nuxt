import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import type { Product } from '@/data/products'

interface CityCache { items: Product[]; expiresAt: number }

const CACHE_TTL = 5 * 60 * 1000 // 5 min
const CACHE_MAX = 20

export const useProductsDataStore = defineStore('productsData', () => {
  const items = ref<Product[]>([])
  const loading = ref(false)
  const loaded = ref(false)
  const cityCache = ref(new Map<string, CityCache>())

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

  async function loadForCity(citySlug: string, opts?: { hideOutOfStock?: boolean }): Promise<Product[]> {
    const key = citySlug + (opts?.hideOutOfStock ? ':hide' : '')
    const cached = cityCache.value.get(key)
    if (cached && cached.expiresAt > Date.now()) return cached.items

    try {
      const { data } = await api.get('/products', {
        params: { city: citySlug, limit: 200, hideOutOfStock: opts?.hideOutOfStock ? 'true' : undefined },
      })
      const result: Product[] = Array.isArray(data) ? data : (data.data ?? [])

      // Evict oldest if over limit
      if (cityCache.value.size >= CACHE_MAX) {
        const firstKey = cityCache.value.keys().next().value
        if (firstKey) cityCache.value.delete(firstKey)
      }
      cityCache.value.set(key, { items: result, expiresAt: Date.now() + CACHE_TTL })
      return result
    } catch {
      return items.value
    }
  }

  function countByCity(citySlug: string): number {
    const cached = cityCache.value.get(citySlug)
    return cached?.items.length ?? 0
  }

  return { items, loading, loaded, load, loadForCity, countByCity }
})
