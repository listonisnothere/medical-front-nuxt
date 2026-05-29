<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import CityDeliveryBanner from '@/components/ui/CityDeliveryBanner.vue'
import { useMeta, type FaqItem } from '@/composables/useMeta'
import { useCatalogFilters } from '@/composables/useCatalogFilters'
import { useCitiesDataStore } from '@/stores/citiesData'
import { buildCitySeoFallback } from '@/composables/useCitySeoFallback'
import { mergeSeo } from '@/utils/mergeSeo'

const route = useRoute()
const { t } = useI18n()
const isDesktop = ref(true)
const filtersOpen = ref(false)

const {
  activeCategory, activeBrand, searchQuery, sortBy,
  sorted, currentTitle, flatCategoryTree, activeFilters,
  isDescendantActive, categoryProductCount, clearAllFilters, loading,
  productsStore, categoriesStore, brandsStore,
} = useCatalogFilters()

const citiesStore = useCitiesDataStore()
const config = useRuntimeConfig()
const citySlug = (route.params.city as string).toLowerCase()

// Load stores in parallel, then load products for specific city
await Promise.all([
  useAsyncData('categoriesData', () => categoriesStore.load()),
  useAsyncData('brandsData', () => brandsStore.load()),
  useAsyncData('citiesData', () => citiesStore.load()),
])

// Validate city — 404 if unknown
const city = computed(() => citiesStore.items.find((c) => c.slug === citySlug && c.isVisible) ?? null)
if (!city.value) {
  throw createError({ statusCode: 404, statusMessage: 'City not found' })
}

// Load products for city (uses city-specific endpoint)
const { data: cityProductsData } = await useAsyncData(
  `products-city-${citySlug}`,
  () => productsStore.loadForCity(citySlug),
)
// Override sorted products with city-specific ones
if (cityProductsData.value?.length) {
  productsStore.items = cityProductsData.value
}

// Fetch SEO from backend (now always 200, may return empty fields)
const { data: seoData } = await useAsyncData(
  `catalog-seo-${activeCategory.value}-${citySlug}`,
  () => $fetch<{
    category: { slug: string; title: string; short?: string; faq: FaqItem[] }
    city: { slug: string; name: string; namePrep: string; region: string; faq: FaqItem[] }
    seo: { title: string; description: string; keywords: string; faq: FaqItem[] }
  }>(`${config.public.apiBase}/catalog-seo/${activeCategory.value}/${citySlug}`).catch(() => null),
)

// Merge backend SEO with client-side fallback (fallback fills empty fields)
const mergedSeo = computed(() => {
  const c = city.value
  if (!c) return { title: '', description: '', keywords: '', faq: [] as FaqItem[] }
  const fallback = buildCitySeoFallback(currentTitle.value || 'Медицинское оборудование', c)
  return mergeSeo(fallback, seoData.value?.seo)
})

// Related categories for the same city (exclude current)
const relatedCategoryLinks = computed(() =>
  categoriesStore.items
    .filter((c: any) => c.isVisible && c.slug !== activeCategory.value)
    .slice(0, 6)
    .map((c: any) => ({ slug: c.slug, title: c.title, to: `/catalog/${c.slug}/${citySlug}` })),
)

function handleResize() {
  isDesktop.value = window.innerWidth > 900
  if (isDesktop.value) filtersOpen.value = true
}

onMounted(() => {
  isDesktop.value = window.innerWidth > 900
  filtersOpen.value = isDesktop.value
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

useMeta({
  title: () => mergedSeo.value.title,
  description: () => mergedSeo.value.description,
  keywords: () => mergedSeo.value.keywords,
  canonical: () => `https://www.medcoregroup.kz/catalog/${activeCategory.value}/${citySlug}`,
  faqItems: () => mergedSeo.value.faq,
  jsonLd: () => {
    const catTitle = currentTitle.value
    const cityName = city.value?.name ?? ''
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
        { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://www.medcoregroup.kz/catalog' },
        { '@type': 'ListItem', position: 3, name: catTitle, item: `https://www.medcoregroup.kz/catalog/${activeCategory.value}` },
        { '@type': 'ListItem', position: 4, name: cityName },
      ],
    }
    const listItems = sorted.value.slice(0, 20).map((p: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.medcoregroup.kz/product/${p.id}`,
      name: p.name,
      image: p.image,
    }))
    const itemList = listItems.length
      ? { '@type': 'ItemList', name: `${catTitle} ${city.value?.namePrep ?? ''}`, itemListElement: listItems }
      : null
    const service = {
      '@type': 'Service',
      name: `${catTitle} ${city.value?.namePrep ?? ''}`,
      provider: { '@type': 'Organization', name: 'MedCore Group' },
      areaServed: { '@type': 'City', name: cityName },
    }
    const faqPage = mergedSeo.value.faq.length
      ? {
          '@type': 'FAQPage',
          mainEntity: mergedSeo.value.faq.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null
    return {
      '@context': 'https://schema.org',
      '@graph': [breadcrumb, service, ...(itemList ? [itemList] : []), ...(faqPage ? [faqPage] : [])],
    }
  },
})
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs
        :items="[
          { label: $t('catalog.breadcrumb'), to: '/catalog' },
          { label: currentTitle, to: `/catalog/${activeCategory}` },
          { label: city?.name ?? citySlug },
        ]"
      />
      <SectionHeading :eyebrow="`MedCore Group · ${city?.name ?? ''}`" :level="1">
        {{ currentTitle }} в {{ city?.name ?? '' }}
      </SectionHeading>
      <CityDeliveryBanner v-if="city" :city="city" />

      <div class="search-wrap">
        <span class="search-icon-glyph">&#128269;</span>
        <input
          v-model="searchQuery"
          type="search"
          class="search-input"
          :placeholder="$t('catalog.searchPlaceholder')"
          autocomplete="off"
        />
        <button v-if="searchQuery" class="search-clear" type="button" @click="searchQuery = ''">&#10005;</button>
      </div>

      <div v-if="loading" class="layout">
        <div class="sidebar">
          <div class="sk-sidebar">
            <div class="sk-line sk-heading"></div>
            <div v-for="i in 8" :key="i" class="sk-line sk-filter-btn"></div>
          </div>
        </div>
        <div>
          <div class="grid">
            <div v-for="i in 6" :key="i" class="skeleton-card">
              <div class="sk-media"></div>
              <div class="sk-body">
                <div class="sk-line sk-brand-line"></div>
                <div class="sk-line sk-title-line"></div>
                <div class="sk-line sk-title-line sk-title--short"></div>
                <div class="sk-line sk-price-line"></div>
                <div class="sk-actions">
                  <div class="sk-line sk-btn-line"></div>
                  <div class="sk-line sk-btn-line sk-btn--short"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="layout">
        <div class="sidebar">
          <button
            v-if="!isDesktop"
            type="button"
            class="filter-toggle"
            @click="filtersOpen = !filtersOpen"
          >
            <span>{{ $t('catalog.filtersToggle') }}{{ activeFilters.length ? ` (${activeFilters.length})` : '' }}</span>
            <span class="chevron" :class="{ open: filtersOpen }">&#8250;</span>
          </button>

          <aside v-show="filtersOpen || isDesktop" class="filters">
            <div class="group">
              <h4>{{ $t('catalog.filterCategory') }}</h4>
              <ul>
                <li>
                  <button
                    :class="{ active: !activeCategory }"
                    @click="activeCategory = ''"
                  >
                    <span>{{ $t('catalog.allCategories') }}</span>
                    <span class="cat-count">{{ productsStore.items.length }}</span>
                  </button>
                </li>
                <template v-for="{ cat, depth } in flatCategoryTree" :key="cat.slug">
                  <li :style="depth > 0 ? `padding-left: ${depth * 16}px` : ''">
                    <button
                      :class="{ active: isDescendantActive(cat) }"
                      @click="activeCategory = cat.slug"
                    >
                      <span>{{ cat.title }}</span>
                      <span class="cat-count">{{ categoryProductCount(cat) }}</span>
                    </button>
                  </li>
                </template>
              </ul>
            </div>

            <div class="group">
              <h4>{{ $t('catalog.filterBrand') }}</h4>
              <ul>
                <li>
                  <button :class="{ active: !activeBrand }" @click="activeBrand = ''">{{ $t('catalog.allBrands') }}</button>
                </li>
                <li v-for="b in brandsStore.items" :key="b.slug">
                  <button
                    :class="{ active: activeBrand === b.name }"
                    @click="activeBrand = b.name"
                  >
                    {{ b.name }}
                  </button>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div>
          <div v-if="activeFilters.length" class="active-filters">
            <button
              v-for="(chip, i) in activeFilters"
              :key="i"
              type="button"
              class="filter-chip"
              @click="chip.clear()"
            >
              {{ chip.label }} &#10005;
            </button>
            <button type="button" class="clear-all" @click="clearAllFilters">
              {{ $t('catalog.clearAll') }}
            </button>
          </div>

          <div class="toolbar">
            <p class="count">{{ $t('catalog.found', { n: sorted.length }) }}</p>
            <div class="sort-wrap">
              <select v-model="sortBy" class="sort-select">
                <option value="default">{{ $t('catalog.sortDefault') }}</option>
                <option value="price-asc">{{ $t('catalog.sortPriceAsc') }}</option>
                <option value="price-desc">{{ $t('catalog.sortPriceDesc') }}</option>
                <option value="new">{{ $t('catalog.sortNew') }}</option>
              </select>
              <span class="sort-arrow">&#8250;</span>
            </div>
          </div>

          <div v-if="sorted.length" class="grid">
            <ProductCard
              v-for="(p, i) in sorted"
              :key="p.id"
              :product="p"
              :style="{ animationDelay: `${Math.min(i * 0.05, 0.3)}s` }"
            />
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">&#128269;</div>
            <h3 class="empty-title">{{ $t('catalog.emptyTitle') }}</h3>
            <p class="empty-sub">{{ $t('catalog.emptySub') }}</p>
            <button type="button" class="empty-reset" @click="clearAllFilters">
              {{ $t('catalog.emptyReset') }}
            </button>
          </div>

          <div v-if="sorted.length" class="help-banner">
            <div class="help-content">
              <h3 class="help-title">{{ $t('catalog.helpTitle') }}</h3>
              <p class="help-sub">{{ $t('catalog.helpSub') }}</p>
            </div>
            <RouterLink to="/contacts" class="help-btn">
              {{ $t('catalog.helpBtn') }}
            </RouterLink>
          </div>

          <div v-if="mergedSeo.faq.length" class="faq-section">
            <h2 class="faq-heading">Частые вопросы</h2>
            <details
              v-for="(item, i) in mergedSeo.faq"
              :key="i"
              class="faq-item"
            >
              <summary class="faq-question">{{ item.question }}</summary>
              <p class="faq-answer">{{ item.answer }}</p>
            </details>
          </div>

          <div v-if="relatedCategoryLinks.length" class="related-cities-section">
            <h2 class="related-heading">Другие категории в {{ city?.name }}</h2>
            <div class="related-grid">
              <RouterLink
                v-for="cat in relatedCategoryLinks"
                :key="cat.slug"
                :to="cat.to"
                class="related-card"
              >
                {{ cat.title }}
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-8);
}

/* SEARCH */
.search-wrap {
  position: relative;
  margin-bottom: var(--space-5);
}

.search-icon-glyph {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  opacity: 0.45;
}

.search-input {
  width: 100%;
  padding: 12px 44px 12px 44px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-family: inherit;
  color: var(--color-text);
  background: #fff;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(31, 95, 191, 0.12);
}

.search-input::-webkit-search-cancel-button { display: none; }

.search-clear {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 16px;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.15s;
}

.search-clear:hover { color: var(--color-text); }

/* LAYOUT */
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: var(--space-7);
  align-items: start;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

/* SIDEBAR & MOBILE TOGGLE */
.sidebar {
  position: sticky;
  top: var(--space-5);
}

.filter-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  margin-bottom: var(--space-3);
  background: var(--color-surface);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: border-color 0.15s;
}

.filter-toggle:hover { border-color: var(--color-primary); }

.chevron {
  display: inline-block;
  font-size: 20px;
  font-weight: 400;
  line-height: 1;
  transition: transform 0.2s;
  transform: rotate(90deg);
}

.chevron.open { transform: rotate(-90deg); }

.filters {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}

.group + .group { margin-top: var(--space-4); border-top: 1px solid var(--color-border); padding-top: var(--space-4); }

.group h4 {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2);
}

.group ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group li button {
  width: 100%;
  text-align: left;
  padding: 6px 10px;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  font-size: 13px;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}

.group li button:hover { background: var(--color-surface-2); }
.group li button.active { background: var(--color-primary); color: #fff; }
.group li button.active .cat-count { color: rgba(255,255,255,0.75); }

.cat-count {
  font-size: 11px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* ACTIVE FILTER CHIPS */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--space-4);
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 13px;
  cursor: pointer;
  transition: filter 0.15s;
}

.filter-chip:hover { filter: brightness(1.1); }

.clear-all {
  padding: 5px 12px;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 13px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.clear-all:hover { border-color: var(--color-text); color: var(--color-text); }

/* TOOLBAR */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  gap: var(--space-3);
}

.count {
  font-size: 13px;
  color: var(--color-text-muted);
  margin: 0;
}

.sort-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.sort-select {
  appearance: none;
  padding: 6px 32px 6px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 13px;
  font-family: inherit;
  color: var(--color-text);
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}

.sort-select:focus { border-color: var(--color-primary); }

.sort-arrow {
  position: absolute;
  right: 10px;
  font-size: 18px;
  color: var(--color-text-muted);
  pointer-events: none;
  transform: rotate(90deg);
  line-height: 1;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--space-5);
}

.grid > * {
  animation: cardFadeUp 0.4s ease both;
}

@keyframes cardFadeUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

/* EMPTY STATE */
.empty-state {
  padding: var(--space-8) var(--space-5);
  text-align: center;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.35;
  line-height: 1;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.empty-sub {
  font-size: 14px;
  color: var(--color-text-muted);
  margin: 0;
}

.empty-reset {
  margin-top: 4px;
  padding: 10px 24px;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.15s;
}

.empty-reset:hover { filter: brightness(1.1); }

/* SKELETON */
.skeleton-card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: 18px;
  overflow: hidden;
}

.sk-media {
  aspect-ratio: 4/3;
  animation: shimmer 1.4s ease-in-out infinite;
  background-size: 200% 100%;
  background-image: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-2) 50%, var(--color-surface) 75%);
}

.sk-body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk-line {
  border-radius: 6px;
  animation: shimmer 1.4s ease-in-out infinite;
  background-size: 200% 100%;
  background-image: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-2) 50%, var(--color-surface) 75%);
}

.sk-brand-line { height: 10px; width: 40%; }
.sk-title-line { height: 14px; width: 90%; }
.sk-title--short { width: 65%; }
.sk-price-line { height: 36px; border-radius: 10px; }
.sk-actions { display: flex; gap: 8px; }
.sk-btn-line { height: 36px; flex: 2; border-radius: 10px; }
.sk-btn--short { flex: 1; }

.sk-sidebar { display: flex; flex-direction: column; gap: 8px; }
.sk-heading { height: 12px; width: 60%; margin-bottom: 4px; }
.sk-filter-btn { height: 32px; border-radius: var(--radius-sm); }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* HELP BANNER */
.help-banner {
  margin-top: var(--space-5);
  background: var(--color-text);
  border-radius: var(--radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  color: #fff;
}

@media (min-width: 768px) {
  .help-banner {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }
}

.help-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 6px;
}

.help-sub {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
  margin: 0;
  max-width: 520px;
}

.help-btn {
  flex-shrink: 0;
  background: #c8881a;
  color: #fff;
  padding: 12px 22px;
  border-radius: var(--radius);
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: background 0.15s, transform 0.05s;
}

.help-btn:hover { background: #a96d0f; }
.help-btn:active { transform: translateY(1px); }

/* FAQ */
.faq-section {
  margin-top: var(--space-7);
}

.faq-heading {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text);
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: 8px;
  overflow: hidden;
}

.faq-question {
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  user-select: none;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.12s;
}

.faq-question:hover { background: var(--color-surface); }

.faq-question::-webkit-details-marker { display: none; }

.faq-question::after {
  content: '+';
  font-size: 18px;
  font-weight: 400;
  color: var(--color-primary);
  flex-shrink: 0;
}

details[open] .faq-question::after { content: '−'; }

.faq-answer {
  padding: 0 18px 14px;
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

/* RELATED CATEGORIES */
.related-cities-section {
  margin-top: var(--space-7);
}

.related-heading {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--space-3);
}

.related-card {
  padding: 12px 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.related-card:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-soft);
}
</style>
