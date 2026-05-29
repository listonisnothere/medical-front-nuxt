<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppContainer from '@/components/ui/AppContainer.vue'
import HeroBlock from '@/components/home/HeroBlock.vue'
import BannersCarousel from '@/components/home/BannersCarousel.vue'
import DirectionsBlock from '@/components/home/DirectionsBlock.vue'
import StatsBlock from '@/components/home/StatsBlock.vue'
import EquipmentQuiz from '@/components/quiz/EquipmentQuiz.vue'
import WhyUsBlock from '@/components/home/WhyUsBlock.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import LogoStrip from '@/components/ui/LogoStrip.vue'
import PublicationsTabs from '@/components/home/PublicationsTabs.vue'
import { useProductsDataStore } from '@/stores/productsData'
import { useBrandsDataStore } from '@/stores/brandsData'
import { useBannersDataStore } from '@/stores/bannersData'
import { useMeta } from '@/composables/useMeta'

const productsStore = useProductsDataStore()
const brandsStore = useBrandsDataStore()
const bannersStore = useBannersDataStore()
const popular = computed(() => productsStore.items.slice(0, 8))
const brandNames = computed(() =>
  brandsStore.items.slice(0, 8).map((b: { name: string; slug: string }) => ({ name: b.name, slug: b.slug })),
)

useMeta({
  title: () => 'Медицинское оборудование в Казахстане — MedCore Group',
  description: () =>
    'MedCore Group — поставщик медицинской техники для больниц, клиник и медицинских центров по всему Казахстану. УЗИ, КТ, МРТ, мониторы пациента, наркозные аппараты.',
  keywords: () =>
    'медицинское оборудование Казахстан, УЗИ, КТ, МРТ, монитор пациента, наркозный аппарат, оснащение клиник, MedCore Group',
  ogType: () => 'website',
  jsonLd: () => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'MedicalOrganization'],
        '@id': 'https://www.medcoregroup.kz/#organization',
        name: 'ТОО «MedCore Group»',
        alternateName: 'MedCore Group',
        taxID: '250540020756',
        url: 'https://www.medcoregroup.kz',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.medcoregroup.kz/favicon.svg',
        },
        telephone: '+77752540351',
        email: 'info@medcoregroup.kz',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Усть-Каменогорск',
          addressRegion: 'Восточно-Казахстанская область',
          addressCountry: 'KZ',
        },
        areaServed: ['KZ'],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+77752540351',
          contactType: 'sales',
          areaServed: 'KZ',
          availableLanguage: ['Russian', 'Kazakh'],
        },
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.medcoregroup.kz/#website',
        url: 'https://www.medcoregroup.kz',
        name: 'MedCore Group',
        inLanguage: 'ru',
        publisher: { '@id': 'https://www.medcoregroup.kz/#organization' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://www.medcoregroup.kz/search?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }),
})

await Promise.all([
  useAsyncData('productsData', () => productsStore.load()),
  useAsyncData('brandsData', () => brandsStore.load()),
  useAsyncData('bannersData', () => bannersStore.load()),
])
</script>

<template>
  <AppContainer>
    <h1 class="sr-only">{{ $t('home.h1') }}</h1>

    <section class="block hero-block">
      <HeroBlock />
    </section>

    <section v-if="bannersStore.items.length" class="block">
      <BannersCarousel />
    </section>

    <section class="block">
      <DirectionsBlock />
    </section>

    <section class="block">
      <EquipmentQuiz />
    </section>

    <section class="block">
      <StatsBlock />
    </section>

    <section class="block">
      <WhyUsBlock />
    </section>

    <section class="block open-clinic-cta">
      <div class="oc-card">
        <div class="oc-text">
          <h2 class="oc-title">{{ $t('home.openClinicTitle') }}</h2>
          <p class="oc-sub">{{ $t('home.openClinicSub') }}</p>
        </div>
        <RouterLink to="/open-clinic" class="oc-btn">
          {{ $t('home.openClinicCta') }}
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="14" height="14">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>
    </section>

    <section v-if="brandNames.length" class="block">
      <SectionHeading align="center" :eyebrow="$t('home.partnersEyebrow')">
        {{ $t('home.partnersTitle') }}
      </SectionHeading>
      <LogoStrip :items="brandNames" />
    </section>

    <section v-if="popular.length" class="block">
      <SectionHeading :eyebrow="$t('home.catalogEyebrow')">
        {{ $t('home.popularTitle') }}
      </SectionHeading>
      <div class="popular-grid">
        <ProductCard v-for="p in popular" :key="p.id" :product="p" />
      </div>
      <div class="popular-more">
        <RouterLink to="/catalog" class="more-link">
          {{ $t('common.toCatalog') }}
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </RouterLink>
      </div>
    </section>

    <section class="block">
      <SectionHeading :eyebrow="$t('home.blogEyebrow')">
        {{ $t('home.blogTitle') }}
      </SectionHeading>
      <PublicationsTabs />
    </section>
  </AppContainer>
</template>

<style scoped>
.block {
  margin-top: var(--space-9);
}
.hero-block {
  margin-top: var(--space-5);
}
.popular-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}
.popular-more {
  margin-top: var(--space-5);
  display: flex;
  justify-content: center;
}
.more-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
  background: transparent;
  border: 1px solid var(--color-border-strong, #c8c2b6);
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.2s, border-color 0.2s;
}
.more-link:hover {
  background: #fff;
  border-color: var(--color-text);
}
.more-link svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s;
}
.more-link:hover svg {
  transform: translateX(3px);
}

/* Open clinic CTA */
.oc-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-7) var(--space-8);
  background: linear-gradient(135deg, #1a3a6b 0%, #0f6bbd 100%);
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
}
.oc-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.oc-title {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.oc-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}
.oc-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 14px 28px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  background: #fff;
  color: var(--color-primary);
  transition: filter 0.15s;
}
.oc-btn:hover {
  filter: brightness(0.95);
}
@media (max-width: 640px) {
  .oc-card {
    padding: var(--space-6);
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
