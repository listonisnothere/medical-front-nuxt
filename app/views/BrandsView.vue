<script setup lang="ts">
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useBrandsDataStore } from '@/stores/brandsData'
import { useMeta } from '@/composables/useMeta'

const store = useBrandsDataStore()

useMeta({
  title: () => 'Бренды',
  description: () =>
    'Официальный дистрибьютор Mindray, GE Healthcare, Dräger, Canon, Pentax, SonoScape в Казахстане. Сертификация РК, гарантия, сервис. Запросите КП!',
  keywords: () =>
    'бренды медицинского оборудования, Mindray дистрибьютор, GE Healthcare Казахстан, Dräger, Canon, Pentax, SonoScape, SIUI официальный представитель',
  jsonLd: () => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
          { '@type': 'ListItem', position: 2, name: 'Производители' },
        ],
      },
      ...(store.items.length ? [{
        '@type': 'ItemList',
        name: 'Производители медицинского оборудования',
        itemListElement: store.items.map((b, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: b.name,
        })),
      }] : []),
    ],
  }),
})

await useAsyncData('brandsData', () => store.load())
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('brands.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('brands.eyebrow')" :level="1">{{ $t('brands.title') }}</SectionHeading>
      <div v-if="store.loading" class="loading">{{ $t('brands.loading') }}</div>
      <div v-else class="grid">
        <article
          v-for="b in store.items"
          :key="b.slug"
          class="card"
        >
          <div class="logo">{{ b.name }}</div>
          <div class="meta">
            <span class="country">{{ b.country }}</span>
            <span class="status">{{ $t('brands.officialDistributor') }}</span>
          </div>
        </article>
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--space-3);
}
.card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}
.logo {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}
.meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 13px;
  color: var(--color-text-muted);
}
.status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 12px;
}
.status::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
}
</style>
