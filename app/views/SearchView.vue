<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import type { Product } from '@/data/products'
import { useMeta } from '@/composables/useMeta'

const route = useRoute()
const config = useRuntimeConfig()

type SearchResponse = Product[] | {
  results?: Product[]
  data?: Product[]
  total?: number
  query?: string
}

const searchQuery = computed(() => {
  const raw = route.query.q
  return Array.isArray(raw) ? (raw[0] ?? '') : (raw ?? '')
})

function extractResults(data: SearchResponse | null | undefined): Product[] {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  if (Array.isArray(data?.data)) return data.data
  return []
}

useMeta({
  title: () => route.query.q ? `Поиск: ${route.query.q}` : 'Поиск оборудования',
  description: () =>
    route.query.q
      ? `Результаты поиска «${route.query.q}» — медицинское оборудование в каталоге MedCore Group. Официальные поставки, гарантия, сервис в Казахстане.`
      : 'Поиск медицинского оборудования в каталоге MedCore Group. УЗИ, КТ, МРТ, наркозные аппараты, мониторы пациента.',
  noindex: true,
})

const { data: searchData, pending: loading } = await useAsyncData<SearchResponse>(
  'search-results',
  async () => {
    const q = searchQuery.value.trim()
    if (!q) return { results: [], total: 0, query: q }

    return await $fetch<SearchResponse>(`${config.public.apiBase}/search`, {
      query: { q },
    }).catch(() => ({ results: [], total: 0, query: q }))
  },
  { watch: [searchQuery] },
)

const results = computed(() => extractResults(searchData.value))
</script>

<template>
  <AppContainer>
    <Breadcrumbs :items="[{ label: $t('search.breadcrumb') }]" />
    <SectionHeading :level="1">
      {{ $t('search.title', { q: route.query.q || '...' }) }}
      <template #sub>{{ loading ? $t('search.searching') : $t('search.found', { n: results.length }) }}</template>
    </SectionHeading>

    <div v-if="loading" class="loading">{{ $t('search.loading') }}</div>
    <div v-else-if="results.length" class="grid">
      <ProductCard v-for="p in results" :key="p.id" :product="p" />
    </div>
    <p v-else-if="route.query.q" class="empty">{{ $t('search.noResults') }}</p>
    <p v-else class="empty">{{ $t('search.noQuery') }}</p>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}
.empty {
  padding: var(--space-7);
  background: var(--color-surface);
  border-radius: var(--radius);
  text-align: center;
  color: var(--color-text-muted);
}
</style>
