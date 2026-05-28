<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useProductsDataStore } from '@/stores/productsData'
import { useCategoriesDataStore } from '@/stores/categoriesData'
import { useMeta } from '@/composables/useMeta'
import { useUiStore } from '@/stores/ui'
import type { Brand } from '@/stores/brandsData'

const route = useRoute()
const ui = useUiStore()
const productsStore = useProductsDataStore()
const categoriesStore = useCategoriesDataStore()
const config = useRuntimeConfig()

const { data: brand } = await useAsyncData<Brand>(
  `brand-${route.params.slug}`,
  () => $fetch(`${config.public.apiBase}/brands/${route.params.slug}`),
  { default: () => null as unknown as Brand },
)

if (!brand.value) {
  throw createError({ statusCode: 404, statusMessage: 'Brand not found' })
}

await Promise.all([
  useAsyncData('productsData', () => productsStore.load()),
  useAsyncData('categoriesData', () => categoriesStore.load()),
])

const brandProducts = computed(() =>
  productsStore.items.filter((p) => {
    const b = p.brand as any
    if (typeof b === 'object' && b !== null) return b.slug === brand.value?.slug || b.name === brand.value?.name
    return b === brand.value?.name
  }),
)

const categoryChips = computed(() => {
  if (!brand.value?.categories?.length) return []
  return (brand.value.categories as string[]).map((slug) => {
    const cat = categoriesStore.items.find((c) => c.slug === slug)
    return { slug, label: cat?.title ?? slug }
  })
})

const BASE = 'https://www.medcoregroup.kz'

useMeta({
  title: () =>
    brand.value?.seoTitle ??
    (brand.value ? `${brand.value.name} — официальный дистрибьютор в Казахстане` : 'Производитель'),
  description: () =>
    brand.value?.seoDescription ??
    (brand.value
      ? `${brand.value.name} — официальный дистрибьютор в Казахстане. ${(brand.value.bio ?? '').slice(0, 100)} Сертификат РК, монтаж, обучение, гарантия. Запросите КП!`
      : ''),
  keywords: () =>
    brand.value?.seoKeywords ??
    (brand.value
      ? `${brand.value.name} Казахстан, купить ${brand.value.name}, ${brand.value.name} дистрибьютор, официальный поставщик ${brand.value.name} РК`
      : ''),
  canonical: () => `${BASE}/brands/${brand.value?.slug ?? ''}`,
  faqItems: () => brand.value?.faq ?? [],
  jsonLd: () => {
    if (!brand.value) return null
    const b = brand.value
    const products = brandProducts.value.slice(0, 20)
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Производители', item: `${BASE}/brands` },
            { '@type': 'ListItem', position: 3, name: b.name },
          ],
        },
        {
          '@type': 'Brand',
          name: b.name,
          description: b.bio,
          ...(b.website ? { url: b.website } : {}),
        },
        ...(products.length
          ? [{
              '@type': 'ItemList',
              name: `Оборудование ${b.name} в Казахстане`,
              itemListElement: products.map((p, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: p.name,
                url: `${BASE}/product/${p.id}`,
              })),
            }]
          : []),
      ],
    }
  },
})
</script>

<template>
  <AppContainer v-if="!brand">
    <div class="loading">Производитель не найден.</div>
  </AppContainer>

  <AppContainer v-else>
    <div class="page">
      <Breadcrumbs
        :items="[
          { label: 'Производители', to: '/brands' },
          { label: brand.name },
        ]"
      />

      <header class="brand-header">
        <div class="brand-meta">
          <span class="country-chip">{{ brand.country }}</span>
          <span class="distributor-chip">Официальный дистрибьютор в Казахстане</span>
          <span v-if="brand.partnershipSince" class="since-chip">Партнёрство с {{ brand.partnershipSince }} года</span>
        </div>
        <SectionHeading :level="1" class="brand-title">{{ brand.name }}</SectionHeading>
        <p v-if="brand.bio" class="bio">{{ brand.bio }}</p>
        <div class="header-actions">
          <button type="button" class="btn btn--primary" @click="ui.openQuote()">
            Запросить коммерческое предложение
          </button>
          <a
            v-if="brand.website"
            :href="brand.website"
            target="_blank"
            rel="noopener noreferrer nofollow"
            class="btn btn--secondary"
          >
            Сайт производителя ↗
          </a>
        </div>
      </header>

      <section v-if="categoryChips.length" class="categories-section">
        <h2 class="section-title">Категории оборудования</h2>
        <div class="cat-chips">
          <RouterLink
            v-for="chip in categoryChips"
            :key="chip.slug"
            :to="`/catalog/${chip.slug}`"
            class="cat-chip"
          >
            {{ chip.label }}
          </RouterLink>
        </div>
      </section>

      <section v-if="brandProducts.length" class="products-section">
        <h2 class="section-title">
          Оборудование {{ brand.name }}
          <span class="count">({{ brandProducts.length }})</span>
        </h2>
        <div class="products-grid">
          <ProductCard
            v-for="p in brandProducts.slice(0, 12)"
            :key="p.id"
            :product="p"
          />
        </div>
        <RouterLink
          v-if="brandProducts.length > 12"
          :to="`/catalog?brand=${encodeURIComponent(brand.name)}`"
          class="show-all-link"
        >
          Смотреть все {{ brandProducts.length }} позиций →
        </RouterLink>
      </section>

      <section v-if="brand.certificates?.length" class="certificates-section">
        <h2 class="section-title">Сертификаты и документы</h2>
        <ul class="cert-list">
          <li v-for="(cert, i) in brand.certificates" :key="i" class="cert-item">
            <span class="cert-icon">📄</span>
            <a
              v-if="cert.url"
              :href="cert.url"
              target="_blank"
              rel="noopener noreferrer"
              class="cert-link"
            >{{ cert.title }}</a>
            <span v-else class="cert-title">{{ cert.title }}</span>
          </li>
        </ul>
      </section>

      <section v-if="brand.faq?.length" class="faq-section">
        <h2 class="section-title">Часто задаваемые вопросы</h2>
        <div class="faq-list">
          <details v-for="(item, i) in brand.faq" :key="i" class="faq-item">
            <summary class="faq-question">{{ item.question }}</summary>
            <p class="faq-answer">{{ item.answer }}</p>
          </details>
        </div>
      </section>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.loading {
  padding: var(--space-9);
  text-align: center;
  color: var(--color-text-muted);
}

.brand-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-8);
  background: var(--color-surface, #f8f7f4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.brand-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.country-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #e8f0fd;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  letter-spacing: 0.02em;
}

.distributor-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  background: #e8faf0;
  color: #0f6b3d;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}

.distributor-chip::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #27ae60;
}

.since-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background: #fef3c7;
  color: #92400e;
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
}

.brand-title {
  margin: 0;
}

.bio {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-muted);
  max-width: 72ch;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-2);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: filter 0.15s, background 0.15s;
}

.btn--primary {
  background: var(--color-primary);
  color: #fff;
}

.btn--primary:hover {
  filter: brightness(1.08);
}

.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--secondary:hover {
  background: var(--color-primary-soft, #e8f0fd);
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 var(--space-4);
}

.count {
  font-size: 16px;
  font-weight: 400;
  color: var(--color-text-muted);
}

.categories-section {
  display: flex;
  flex-direction: column;
}

.cat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  padding: 8px 18px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-primary);
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}

.cat-chip:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-soft, #e8f0fd);
}

.products-section {
  display: flex;
  flex-direction: column;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-4);
}

.show-all-link {
  margin-top: var(--space-4);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  align-self: flex-start;
}

.show-all-link:hover {
  text-decoration: underline;
}

.certificates-section {
  display: flex;
  flex-direction: column;
}

.cert-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cert-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: 14px;
}

.cert-icon {
  flex-shrink: 0;
}

.cert-link {
  color: var(--color-primary);
  text-decoration: none;
}

.cert-link:hover {
  text-decoration: underline;
}

.cert-title {
  color: var(--color-text);
}

.faq-section {
  display: flex;
  flex-direction: column;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.faq-item {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.faq-item[open] {
  border-color: var(--color-primary);
}

.faq-question {
  padding: var(--space-4) var(--space-5);
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::after {
  content: '+';
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 400;
  color: var(--color-primary);
  line-height: 1;
}

.faq-item[open] .faq-question::after {
  content: '−';
}

.faq-answer {
  padding: 0 var(--space-5) var(--space-4);
  font-size: 14px;
  line-height: 1.7;
  color: var(--color-text-muted);
  margin: 0;
}
</style>
