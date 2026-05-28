import { ref, watch } from 'vue'

export function usePersistedSet(key: string) {
  const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null
  const initial = stored ? (JSON.parse(stored) as string[]) : []
  const items = ref<string[]>(initial)

  watch(
    items,
    (val) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(val))
      }
    },
    { deep: true },
  )

  const has = (id: string) => items.value.includes(id)

  const toggle = (id: string) => {
    const idx = items.value.indexOf(id)
    if (idx === -1) items.value.push(id)
    else items.value.splice(idx, 1)
  }

  const add = (id: string) => {
    if (!has(id)) items.value.push(id)
  }

  const remove = (id: string) => {
    const idx = items.value.indexOf(id)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  const clear = () => {
    items.value = []
  }

  return { items, has, toggle, add, remove, clear }
}
