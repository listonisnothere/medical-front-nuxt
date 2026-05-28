import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

export function useLocale() {
  const i18n = useI18n()
  const currentLocale = ref(i18n.locale.value)

  const availableLocales = computed(() => [
    { code: 'ru', name: 'Рус' },
    { code: 'kk', name: 'Қаз' }
  ])

  const setLocale = (locale: string) => {
    i18n.locale.value = locale
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
  }

  return {
    currentLocale,
    availableLocales,
    setLocale,
    t: i18n.t
  }
}
