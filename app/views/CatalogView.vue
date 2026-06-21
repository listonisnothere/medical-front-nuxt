<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useMeta } from '@/composables/useMeta'
import { useCatalogFilters } from '@/composables/useCatalogFilters'
import EquipmentQuiz from '@/components/quiz/EquipmentQuiz.vue'

const route = useRoute()
const isDesktop = ref(true)
const filtersOpen = ref(false)

const {
  activeCategory, activeBrand, searchQuery, sortBy,
  sorted, currentTitle, flatCategoryTree, activeFilters,
  isDescendantActive, categoryProductCount, clearAllFilters, loading,
  productsStore, categoriesStore, brandsStore,
} = useCatalogFilters()

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

// --- SEO (uses computed values from composable) ---

useMeta({
  title: () =>
    activeCategory.value === 'sale'
      ? 'Медтехника со скидкой — спецпредложения в Казахстане'
      : activeCategory.value
        ? `${currentTitle.value} — купить в Казахстане`
        : 'Каталог медицинского оборудования в Казахстане',
  description: () =>
    activeCategory.value
      ? `${currentTitle.value} в Казахстане. Сертификация РК, монтаж, обучение, гарантия. Поставка от MedCore Group. Запросите КП!`
      : 'Каталог медтехники: УЗИ, КТ, МРТ, наркозные аппараты, мониторы пациента. Сертификация РК, монтаж, гарантия. Поставка от MedCore Group. Запросите КП!',
  keywords: () =>
    activeCategory.value
      ? `${currentTitle.value}, медицинское оборудование Казахстан`
      : 'медицинское оборудование, каталог медтехники, купить медоборудование, Казахстан, MedCore Group',
  canonical: () => `https://www.medcoregroup.kz${route.path}`,
  faqItems: () => [],
  jsonLd: () => {
    const breadcrumb = {
      '@type': 'BreadcrumbList',
      itemListElement: activeCategory.value
        ? [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://www.medcoregroup.kz/catalog' },
            { '@type': 'ListItem', position: 3, name: currentTitle.value },
          ]
        : [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            { '@type': 'ListItem', position: 2, name: 'Каталог' },
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
      ? { '@type': 'ItemList', name: currentTitle.value, itemListElement: listItems }
      : null
    return {
      '@context': 'https://schema.org',
      '@graph': itemList ? [breadcrumb, itemList] : [breadcrumb],
    }
  },
})

await Promise.all([
  useAsyncData('productsData', () => productsStore.load()),
  useAsyncData('categoriesData', () => categoriesStore.load()),
  useAsyncData('brandsData', () => brandsStore.load()),
])
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs
        :items="
          activeCategory
            ? [
                { label: $t('catalog.breadcrumb'), to: '/catalog' },
                { label: currentTitle },
              ]
            : [{ label: $t('catalog.breadcrumb') }]
        "
      />
      <SectionHeading :eyebrow="$t('catalog.eyebrow')" :level="1">{{ currentTitle }}</SectionHeading>

      <div class="quiz-wrap">
        <EquipmentQuiz variant="compact" />
      </div>

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

        </div>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-8);
}

/* QUIZ */
.quiz-wrap {
  margin-bottom: var(--space-6);
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
  display: flex;
  flex-direction: column;
}

.filter-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  margin-bottom: 8px;
}

.chevron {
  font-size: 20px;
  transition: transform 0.2s;
  display: inline-block;
  line-height: 1;
}

.chevron.open { transform: rotate(90deg); }

.filters {
  position: sticky;
  top: 120px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

@media (max-width: 900px) {
  .filters {
    position: static;
  }
}

.group h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}

.group ul {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.group button {
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-size: 14px;
  color: var(--color-text);
  transition: background 0.15s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.group button:hover { background: var(--color-surface); }

.group button.active {
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  font-weight: 600;
}

.cat-count {
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border-radius: 999px;
  padding: 1px 7px;
  flex-shrink: 0;
}

.group button.active .cat-count {
  background: rgba(31, 95, 191, 0.12);
  color: var(--color-primary-dark);
}

/* ACTIVE FILTER CHIPS */
.active-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: var(--space-4);
  align-items: center;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  border: 1px solid #c8d8f5;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.filter-chip:hover {
  background: #d8e8ff;
  border-color: #a8c4ee;
}

.clear-all {
  font-size: 12px;
  color: var(--color-text-muted);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 8px;
  text-decoration: underline;
  transition: color 0.15s;
}

.clear-all:hover { color: var(--color-text); }

/* TOOLBAR */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: var(--space-4);
}

.count {
  color: var(--color-text-muted);
  font-size: 14px;
  margin: 0;
}

.sort-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.sort-select {
  appearance: none;
  -webkit-appearance: none;
  padding: 8px 34px 8px 12px;
  border: 1.5px solid var(--color-border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: var(--color-text);
  background: #fff;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.sort-select:hover { border-color: var(--color-primary); }

.sort-select:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(31, 95, 191, 0.12);
}

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

/* TRUST STRIP */
.trust-strip {
  margin-top: var(--space-7);
  padding: 20px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

@media (min-width: 768px) {
  .trust-strip { grid-template-columns: repeat(4, 1fr); }
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--color-text);
}

.trust-icon { font-size: 22px; flex-shrink: 0; }
.trust-text { font-weight: 500; line-height: 1.3; }

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

</style>
