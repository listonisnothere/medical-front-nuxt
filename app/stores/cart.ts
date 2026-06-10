import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { usePersistedSet } from './usePersistedSet'

const CART_META_KEY = 'medcore:cart:meta'
const REMINDER_DELAY_MS = 24 * 60 * 60 * 1000

interface CartMeta {
  lastChangedAt: number
  lastReminderAt: number
  submittedSignature: string
}

function safeNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : 0
}

function readMeta(): CartMeta {
  if (typeof localStorage === 'undefined') {
    return { lastChangedAt: 0, lastReminderAt: 0, submittedSignature: '' }
  }

  try {
    const raw = localStorage.getItem(CART_META_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    return {
      lastChangedAt: safeNumber(parsed?.lastChangedAt),
      lastReminderAt: safeNumber(parsed?.lastReminderAt),
      submittedSignature: typeof parsed?.submittedSignature === 'string' ? parsed.submittedSignature : '',
    }
  } catch {
    return { lastChangedAt: 0, lastReminderAt: 0, submittedSignature: '' }
  }
}

export const useCartStore = defineStore('cart', () => {
  const set = usePersistedSet('medcore:cart')
  const meta = ref<CartMeta>(readMeta())
  const count = computed(() => set.items.value.length)
  const signature = computed(() => [...set.items.value].sort().join('|'))

  watch(
    meta,
    (value) => {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CART_META_KEY, JSON.stringify(value))
      }
    },
    { deep: true },
  )

  if (set.items.value.length && !meta.value.lastChangedAt && typeof localStorage !== 'undefined') {
    meta.value = { ...meta.value, lastChangedAt: Date.now() }
  }

  const touch = () => {
    meta.value = {
      lastChangedAt: Date.now(),
      lastReminderAt: 0,
      submittedSignature: '',
    }
  }

  const toggle = (id: string) => {
    set.toggle(id)
    touch()
  }

  const add = (id: string) => {
    if (set.has(id)) return
    set.add(id)
    touch()
  }

  const remove = (id: string) => {
    if (!set.has(id)) return
    set.remove(id)
    touch()
  }

  const clear = () => {
    if (!set.items.value.length) return
    set.clear()
    touch()
  }

  const markReminderShown = () => {
    meta.value = { ...meta.value, lastReminderAt: Date.now() }
  }

  const canRemind = (now = Date.now()) => {
    if (!set.items.value.length) return false
    if (!signature.value || signature.value === meta.value.submittedSignature) return false
    const anchor = Math.max(meta.value.lastChangedAt, meta.value.lastReminderAt)
    return anchor > 0 && now - anchor >= REMINDER_DELAY_MS
  }

  const clearAfterSubmit = () => {
    const submittedSignature = signature.value
    if (!submittedSignature) return

    set.clear()
    meta.value = {
      lastChangedAt: Date.now(),
      lastReminderAt: 0,
      submittedSignature,
    }
  }

  return {
    items: set.items,
    count,
    signature,
    has: set.has,
    toggle,
    add,
    remove,
    clear,
    canRemind,
    markReminderShown,
    clearAfterSubmit,
  }
})
