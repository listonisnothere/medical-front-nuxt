import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/composables/useApi'
import type { Testimonial } from '@/data/testimonials'

export const useTestimonialsDataStore = defineStore('testimonialsData', () => {
  const items = ref<Testimonial[]>([])
  const loading = ref(false)
  const loaded = ref(false)

  async function load() {
    if (loaded.value) return
    loading.value = true
    try {
      const { data } = await api.get('/testimonials')
      items.value = Array.isArray(data) ? data : []
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  return { items, loading, loaded, load }
})
