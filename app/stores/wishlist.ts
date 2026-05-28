import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedSet } from './usePersistedSet'

export const useWishlistStore = defineStore('wishlist', () => {
  const set = usePersistedSet('medcore:wishlist')
  const count = computed(() => set.items.value.length)
  return { ...set, count }
})
