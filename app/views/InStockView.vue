<script setup lang="ts">
import { computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useProductsDataStore } from '@/stores/productsData'
import { useMeta } from '@/composables/useMeta'

const store = useProductsDataStore()

const inStock = computed(() =>
  store.items.filter((p) => p.badge === 'В наличии' || p.badge === 'Акция'),
)

useMeta({
  title: () => 'В наличии',
  description: () =>
    'Медицинское оборудование в наличии: УЗИ, наркозные аппараты, мониторы пациента. Отгрузка по Казахстану от 7 дней. Гарантия. Запросите КП!',
  keywords: () =>
    'медицинское оборудование в наличии, купить медтехнику Казахстан, склад медоборудование MedCore Group, быстрая поставка',
  jsonLd: () => {
    const items = inStock.value.slice(0, 20)
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            { '@type': 'ListItem', position: 2, name: 'В наличии' },
          ],
        },
        ...(items.length ? [{
          '@type': 'ItemList',
          name: 'Медицинское оборудование в наличии',
          itemListElement: items.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: p.name,
            url: `https://www.medcoregroup.kz/product/${p.id}`,
          })),
        }] : []),
      ],
    }
  },
})

await useAsyncData('productsData', () => store.load())
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('inStock.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('inStock.eyebrow')" :level="1">
        {{ $t('inStock.title') }}
        <template #sub>{{ $t('inStock.sub') }}</template>
      </SectionHeading>
      <div v-if="store.loading" class="loading">{{ $t('inStock.loading') }}</div>
      <div v-else class="grid">
        <ProductCard v-for="p in inStock" :key="p.id" :product="p" />
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-7);
}
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
</style>
