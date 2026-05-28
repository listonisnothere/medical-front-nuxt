<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import api from '@/composables/useApi'
import type { Product } from '@/data/products'
import { useMeta } from '@/composables/useMeta'

const route = useRoute()
useMeta({
  title: () => route.query.q ? `Поиск: ${route.query.q}` : 'Поиск оборудования',
  description: () =>
    route.query.q
      ? `Результаты поиска «${route.query.q}» — медицинское оборудование в каталоге MedCore Group. Официальные поставки, гарантия, сервис в Казахстане.`
      : 'Поиск медицинского оборудования в каталоге MedCore Group. УЗИ, КТ, МРТ, наркозные аппараты, мониторы пациента.',
  noindex: true,
})

const results = ref<Product[]>([])
const loading = ref(false)

async function search(q: string) {
  if (!q.trim()) { results.value = []; return }
  loading.value = true
  try {
    const { data } = await api.get('/search', { params: { q } })
    results.value = Array.isArray(data) ? data : (data.data ?? [])
  } finally {
    loading.value = false
  }
}

watch(
  () => route.query.q as string,
  (q) => search(q ?? ''),
  { immediate: true },
)
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
