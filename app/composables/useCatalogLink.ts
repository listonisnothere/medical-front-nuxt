import { computed, isRef, type MaybeRef, unref } from 'vue'
import { useSelectedCity } from '@/composables/useSelectedCity'

export function useCatalogLink(categorySlug: MaybeRef<string>) {
  const { selectedCitySlug, selectedCity } = useSelectedCity()

  return computed(() => {
    const slug = unref(categorySlug)
    if (!slug) return '/catalog'
    if (selectedCity.value) {
      return `/catalog/${slug}/${selectedCitySlug.value}`
    }
    return `/catalog/${slug}`
  })
}
