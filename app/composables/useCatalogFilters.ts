import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useProductsDataStore } from '@/stores/productsData'
import { useCategoriesDataStore } from '@/stores/categoriesData'
import { useBrandsDataStore } from '@/stores/brandsData'

export function useCatalogFilters() {
  const route = useRoute()
  const productsStore = useProductsDataStore()
  const categoriesStore = useCategoriesDataStore()
  const brandsStore = useBrandsDataStore()

  const activeCategory = ref<string>((route.params.category as string) ?? '')
  const activeBrand = ref<string>('')
  const searchQuery = ref('')
  const sortBy = ref<'default' | 'price-asc' | 'price-desc' | 'new'>('default')

  watch(
    () => route.params.category,
    (val) => { activeCategory.value = (val as string) ?? '' },
  )

  function findCategoryBySlug(slug: string, cats?: any[]): any {
    const list = cats ?? (categoriesStore.items as any[])
    for (const cat of list) {
      if (cat.slug === slug) return cat
      const found = findCategoryBySlug(slug, cat.children ?? [])
      if (found) return found
    }
    return null
  }

  function collectAllSlugs(cat: any): string[] {
    const slugs = [cat.slug]
    for (const child of cat.children ?? []) slugs.push(...collectAllSlugs(child))
    return slugs
  }

  const activeSlugSet = computed<Set<string> | null>(() => {
    if (!activeCategory.value || activeCategory.value === 'sale') return null
    const found = findCategoryBySlug(activeCategory.value)
    if (found) return new Set(collectAllSlugs(found))
    return new Set([activeCategory.value])
  })

  const filtered = computed(() => {
    const q = searchQuery.value.trim().toLowerCase()
    return productsStore.items.filter((p) => {
      if (activeCategory.value === 'sale') {
        if (p.badge !== 'Акция') return false
      } else if (activeSlugSet.value && !activeSlugSet.value.has(p.category)) {
        return false
      }
      if (activeBrand.value && p.brand !== activeBrand.value) return false
      if (q && !p.name.toLowerCase().includes(q)) return false
      return true
    })
  })

  const sorted = computed(() => {
    const list = [...filtered.value]
    if (sortBy.value === 'price-asc') return list.sort((a, b) => (a.priceFrom ?? 0) - (b.priceFrom ?? 0))
    if (sortBy.value === 'price-desc') return list.sort((a, b) => (b.priceFrom ?? 0) - (a.priceFrom ?? 0))
    if (sortBy.value === 'new') {
      return list.sort((a, b) => {
        const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return tb - ta
      })
    }
    return list
  })

  const currentTitle = computed(() => {
    if (!activeCategory.value) return 'Каталог медицинского оборудования'
    const found = findCategoryBySlug(activeCategory.value)
    return found?.title ?? 'Каталог'
  })

  function isDescendantActive(cat: any): boolean {
    if (activeCategory.value === cat.slug) return true
    return cat.children?.some((c: any) => isDescendantActive(c)) ?? false
  }

  const flatCategoryTree = computed(() => {
    const result: Array<{ cat: any; depth: number }> = []
    const visit = (cats: any[], depth: number) => {
      for (const cat of cats) {
        result.push({ cat, depth })
        if (cat.children?.length && isDescendantActive(cat)) visit(cat.children, depth + 1)
      }
    }
    visit(categoriesStore.items as any[], 0)
    return result
  })

  function categoryProductCount(cat: any): number {
    if (cat.slug === 'sale') return productsStore.items.filter((p) => p.badge === 'Акция').length
    const slugSet = new Set(collectAllSlugs(cat))
    return productsStore.items.filter((p) => slugSet.has(p.category)).length
  }

  const activeFilters = computed(() => {
    const chips: Array<{ label: string; clear: () => void }> = []
    if (activeCategory.value) {
      const found = findCategoryBySlug(activeCategory.value)
      chips.push({ label: found?.title ?? activeCategory.value, clear: () => { activeCategory.value = '' } })
    }
    if (activeBrand.value) chips.push({ label: activeBrand.value, clear: () => { activeBrand.value = '' } })
    if (searchQuery.value.trim()) chips.push({ label: `"${searchQuery.value.trim()}"`, clear: () => { searchQuery.value = '' } })
    return chips
  })

  function clearAllFilters() {
    activeCategory.value = ''
    activeBrand.value = ''
    searchQuery.value = ''
    sortBy.value = 'default'
  }

  const loading = computed(() => productsStore.loading || categoriesStore.loading || brandsStore.loading)

  return {
    activeCategory, activeBrand, searchQuery, sortBy,
    filtered, sorted, currentTitle,
    flatCategoryTree, activeFilters,
    findCategoryBySlug, collectAllSlugs, isDescendantActive, categoryProductCount,
    clearAllFilters, loading,
    productsStore, categoriesStore, brandsStore,
  }
}
