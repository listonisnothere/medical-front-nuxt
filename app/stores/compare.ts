import { computed } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedSet } from './usePersistedSet'

export const useCompareStore = defineStore('compare', () => {
  const set = usePersistedSet('medcore:compare')
  const count = computed(() => set.items.value.length)
  return { ...set, count }
})
