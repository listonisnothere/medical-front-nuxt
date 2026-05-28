import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedSet } from './usePersistedSet'

export const useCartStore = defineStore('cart', () => {
  const set = usePersistedSet('medcore:cart')
  const count = computed(() => set.items.value.length)
  return { ...set, count }
})
