<script setup lang="ts">
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ServiceCard from '@/components/ui/ServiceCard.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useServicesDataStore } from '@/stores/servicesData'
import { useMeta } from '@/composables/useMeta'

const store = useServicesDataStore()

useMeta({
  title: () => 'Услуги',
  description: () =>
    'Услуги MedCore Group в Казахстане: проектирование клиник, поставка и монтаж оборудования, сервис, обучение, лизинг, trade-in. Оставьте заявку!',
  keywords: () =>
    'услуги MedCore Group, оснащение клиники, монтаж медоборудования, сервис медтехники, обучение врачей, лизинг медоборудования, проектирование клиники',
  jsonLd: () => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
          { '@type': 'ListItem', position: 2, name: 'Услуги' },
        ],
      },
      ...(store.items.length ? [{
        '@type': 'ItemList',
        name: 'Услуги MedCore Group',
        itemListElement: store.items.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: s.title,
          url: `https://www.medcoregroup.kz/services/${s.slug}`,
        })),
      }] : []),
    ],
  }),
})
await useAsyncData('servicesData', () => store.load())
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('services.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('services.eyebrow')" :level="1">{{ $t('services.title') }}</SectionHeading>
      <div v-if="store.loading" class="loading">{{ $t('services.loading') }}</div>
      <div v-else class="grid">
        <ServiceCard v-for="s in store.items" :key="s.slug" :service="s" />
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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}
</style>
