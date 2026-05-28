import { ref } from 'vue'

const KEY = 'medcore:analytics-consent'
const LEGACY_KEY = 'medcore:cookies-accepted'

export type ConsentState = 'accepted' | 'declined' | 'unset'

function read(): ConsentState {
  if (typeof localStorage === 'undefined') return 'unset'
  const v = localStorage.getItem(KEY)
  if (v === 'accepted' || v === 'declined') return v
  if (localStorage.getItem(LEGACY_KEY) === '1') {
    localStorage.setItem(KEY, 'accepted')
    localStorage.removeItem(LEGACY_KEY)
    return 'accepted'
  }
  return 'unset'
}

const consent = ref<ConsentState>(read())

function persist(value: ConsentState) {
  if (value === 'unset') return
  if (typeof localStorage !== 'undefined') localStorage.setItem(KEY, value)
}

export function useConsent() {
  return {
    consent,
    accept() {
      consent.value = 'accepted'
      persist('accepted')
    },
    decline() {
      consent.value = 'declined'
      persist('declined')
    },
    reset() {
      consent.value = 'unset'
      if (typeof localStorage !== 'undefined') localStorage.removeItem(KEY)
    },
  }
}
