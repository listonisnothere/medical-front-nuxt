<script setup lang="ts">
import { computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import StatsBlock from '@/components/home/StatsBlock.vue'
import { useBrandsDataStore } from '@/stores/brandsData'
import { useMeta } from '@/composables/useMeta'

const brandsStore = useBrandsDataStore()
const partners = computed(() => brandsStore.items.map((b: { name: string; slug: string }) => ({ name: b.name, slug: b.slug })))

useMeta({
  title: () => 'О компании',
  description: () =>
    'ТОО «MedCore Group» — поставщик медицинского оборудования в Казахстане. Официальный дистрибьютор GE Healthcare, Mindray, Dräger, Canon. Свяжитесь с нами!',
  keywords: () =>
    'о компании MedCore Group, ТОО MedCore Group, поставщик медоборудования Казахстан, официальный дистрибьютор Mindray, GE Healthcare Казахстан',
  jsonLd: () => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'MedicalOrganization'],
        name: 'ТОО «MedCore Group»',
        alternateName: 'MedCore Group',
        taxID: '250540020756',
        foundingDate: '2025',
        slogan: 'Развитие здравоохранения через партнёрство',
        url: 'https://www.medcoregroup.kz',
        logo: 'https://www.medcoregroup.kz/favicon.svg',
        telephone: '+77752540351',
        email: 'info@medcoregroup.kz',
        knowsAbout: [
          'Медицинское оборудование',
          'ЛОР-комбайны',
          'УЗИ-аппараты',
          'Эндоскопия',
          'Анестезиология',
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'проспект Ауэзова, 14/1',
          addressLocality: 'Усть-Каменогорск',
          addressRegion: 'Восточно-Казахстанская область',
          postalCode: '070004',
          addressCountry: 'KZ',
        },
        areaServed: ['KZ'],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
          { '@type': 'ListItem', position: 2, name: 'О компании' },
        ],
      },
    ],
  }),
})

await useAsyncData('brandsData', () => brandsStore.load())
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('about.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('about.eyebrow')" :level="1">
        {{ $t('about.heading') }}
        <template #sub>{{ $t('about.sub') }}</template>
      </SectionHeading>

      <section class="story">
        <p>{{ $t('about.body1') }}</p>
        <p>{{ $t('about.body2') }}</p>
        <p>{{ $t('about.body3') }}</p>
      </section>

      <div class="block">
        <StatsBlock />
      </div>

      <section v-if="partners.length" class="block partners">
        <h2 class="section-title">{{ $t('about.partnersTitle') }}</h2>
        <p class="section-lead">{{ $t('about.partnersLead') }}</p>
        <div class="chips">
          <span v-for="p in partners" :key="p.name" class="chip">{{ p.name }}</span>
        </div>
      </section>

      <section class="block cta">
        <h2>{{ $t('about.ctaTitle') }}</h2>
        <p>{{ $t('about.ctaText') }}</p>
        <BaseButton variant="primary" size="lg" to="/contacts">{{ $t('about.ctaBtn') }}</BaseButton>
      </section>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-7);
}

.story {
  max-width: 760px;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  font-size: 16px;
  line-height: 1.65;
  color: var(--color-text);
}

.block {
  margin-top: var(--space-7);
}

.section-title {
  font-size: clamp(22px, 2.4vw, 28px);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-3);
}

.section-lead {
  max-width: 760px;
  color: var(--color-text-muted);
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: var(--space-5);
}

.geo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-4);
}

.geo-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-4);
}

.geo-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.geo-note {
  font-size: 13px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.expertise-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.expertise-card {
  padding: var(--space-5);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.expertise-card h3 {
  font-size: 18px;
  margin-bottom: var(--space-2);
  color: var(--color-primary);
}

.expertise-card p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 14px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
}

.clients .section-lead {
  max-width: 820px;
}

.cta {
  margin-top: var(--space-8);
  padding: var(--space-7);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.cta h2 {
  font-size: clamp(22px, 2.6vw, 30px);
  letter-spacing: -0.01em;
}

.cta p {
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

@media (max-width: 900px) {
  .geo-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .expertise-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .geo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
