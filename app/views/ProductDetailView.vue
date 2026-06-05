<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { marked } from 'marked'
import AppContainer from '@/components/ui/AppContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import ProductCard from '@/components/ui/ProductCard.vue'
import { useProductsDataStore } from '@/stores/productsData'
import { useCategoriesDataStore } from '@/stores/categoriesData'
import { useWishlistStore } from '@/stores/wishlist'
import { useCompareStore } from '@/stores/compare'
import { useCartStore } from '@/stores/cart'
import { useUiStore } from '@/stores/ui'
import { useMeta, buildProductTitle } from '@/composables/useMeta'
import { useSelectedCity } from '@/composables/useSelectedCity'

const route = useRoute()
const { t } = useI18n()
const wishlist = useWishlistStore()
const compare = useCompareStore()
const cart = useCartStore()
const ui = useUiStore()
const productsStore = useProductsDataStore()
const categoriesStore = useCategoriesDataStore()
const config = useRuntimeConfig()
const { selectedCity, selectedCitySlug } = useSelectedCity()

// City-specific product data (availability overlay)
const { data: cityProduct } = await useAsyncData(
  `product-city-${route.params.id}-${selectedCitySlug.value}`,
  async () => {
    if (!selectedCitySlug.value) return null
    return $fetch<any>(
      `${config.public.apiBase}/products/${route.params.id}?city=${selectedCitySlug.value}`,
    ).catch(() => null)
  },
  { watch: [selectedCitySlug] },
)

const product = computed(() => cityProduct.value ?? productsStore.items.find((p) => p.id === route.params.id))

const category = computed(() => {
  if (!product.value) return null
  const slug = product.value.category
  for (const cat of categoriesStore.items as any[]) {
    if ((cat as any).slug === slug) return cat
    const child = (cat as any).children?.find((c: any) => c.slug === slug)
    if (child) return child
  }
  return null
})

// City availability badge
const cityAvail = computed(() => cityProduct.value?.cityAvailability ?? null)
const alternativeCities = computed(() => cityProduct.value?.alternativeCities ?? [])

const stockStatusLabel: Record<string, string> = {
  in_stock: 'В наличии',
  on_order: 'Под заказ',
  out_of_stock: 'Нет в наличии',
}
const stockStatusColor: Record<string, string> = {
  in_stock: '#059669',
  on_order: '#d97706',
  out_of_stock: '#9ca3af',
}

const stripMd = (s: string) =>
  s.replace(/[#*_`>~\-]/g, '').replace(/\s+/g, ' ').trim()

const metaDescription = computed(() => {
  if (!product.value) return ''
  const { name, description, brand } = product.value
  const cta = 'Сертификат РК, доставка по Казахстану, гарантия. Запросите КП!'
  if (description) {
    const clean = stripMd(description)
    const lead = clean.length > 100 ? clean.slice(0, 97).trimEnd() + '…' : clean
    return `${lead} ${cta}`.slice(0, 160)
  }
  return `${name} (${brand}) — купить в Казахстане. ${cta}`.slice(0, 160)
})

useMeta({
  title: () =>
    product.value
      ? buildProductTitle(product.value.brand, product.value.name, category.value?.title ?? product.value.category)
      : 'Оборудование',
  canonical: () => `https://www.medcoregroup.kz${route.path}`,
  description: () => metaDescription.value,
  keywords: () =>
    product.value
      ? `${product.value.name}, ${product.value.brand}, ${product.value.category}, купить медицинское оборудование, ${product.value.brand} цена Казахстан`
      : '',
  ogType: () => 'product',
  ogImage: () => product.value?.image ?? '',
  jsonLd: () => {
    if (!product.value) return null
    const p = product.value
    const availabilityMap: Record<string, string> = {
      in_stock: 'https://schema.org/InStock',
      on_order: 'https://schema.org/PreOrder',
      out_of_stock: 'https://schema.org/OutOfStock',
    }
    const availability = availabilityMap[p.stockStatus ?? 'in_stock'] ?? 'https://schema.org/InStock'
    const currency = p.priceCurrency ?? 'KZT'
    const offerBase = {
      '@type': 'Offer',
      priceCurrency: currency,
      availability,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: 'ТОО «MedCore Group»', url: 'https://www.medcoregroup.kz' },
      url: `https://www.medcoregroup.kz/product/${p.id}`,
      ...(p.priceFrom != null ? { price: p.priceFrom, priceValidUntil: new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10) } : {}),
      ...(p.discountUntil ? { priceValidUntil: p.discountUntil } : {}),
    }
    const productNode: Record<string, unknown> = {
      '@type': 'Product',
      name: p.name,
      sku: p.id,
      brand: { '@type': 'Brand', name: p.brand },
      description: p.description ?? `${p.name} от официального дистрибьютора MedCore Group. Гарантия, монтаж, обучение.`,
      image: p.image,
      category: p.category,
      offers: offerBase,
    }
    if (p.rating != null && p.reviewsCount) {
      productNode.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: p.rating,
        reviewCount: p.reviewsCount,
        bestRating: 5,
        worstRating: 1,
      }
    }
    return {
      '@context': 'https://schema.org',
      '@graph': [
        productNode,
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            { '@type': 'ListItem', position: 2, name: 'Каталог', item: 'https://www.medcoregroup.kz/catalog' },
            ...(category.value ? [{ '@type': 'ListItem', position: 3, name: category.value.title, item: `https://www.medcoregroup.kz/catalog/${category.value.slug}` }] : []),
            { '@type': 'ListItem', position: category.value ? 4 : 3, name: p.name },
          ],
        },
      ],
    }
  },
})

const tab = ref<'description' | 'specs' | 'docs'>('description')

const specs = computed(() => ({
  [t('product.specManufacturer')]: product.value?.brand ?? '',
  [t('product.specClass')]: product.value?.productClass ?? '',
  ...product.value?.specs,
}))

const markdownDescription = computed(() => {
  const desc = product.value?.description
  if (!desc) return ''
  return marked.parse(desc) as string
})

type ProductDocument = {
  id: string
  title: string
  fileUrl: string
  fileSize: string
  fileType: string
}

const documents = computed(
  () => ((product.value as any)?.documents as ProductDocument[] | undefined) ?? [],
)

const related = computed(() =>
  productsStore.items
    .filter((p) => p.category === product.value?.category && p.id !== product.value?.id)
    .slice(0, 4),
)

const gallery = computed<string[]>(() => {
  if (!product.value) return []
  const imgs = (product.value as any).images as { url: string }[] | undefined
  if (imgs && imgs.length > 0) return imgs.map((i) => i.url)
  return product.value.image ? [product.value.image] : []
})
const activeImage = ref(0)

await Promise.all([
  useAsyncData('productsData', () => productsStore.load()),
  useAsyncData('categoriesData', () => categoriesStore.load()),
])
</script>

<template>
  <AppContainer v-if="productsStore.loading">
    <div class="loading">{{ $t('product.loading') }}</div>
  </AppContainer>

  <AppContainer v-else-if="product">
    <Breadcrumbs
      :items="[
        { label: $t('catalog.breadcrumb'), to: '/catalog' },
        ...(category ? [{ label: category.title, to: `/catalog/${category.slug}` }] : []),
        { label: product.name },
      ]"
    />

    <div class="layout">
      <div class="gallery">
        <div class="main-img">
          <NuxtImg
            :src="gallery[activeImage]"
            :alt="`${product.name} — ${product.brand} купить в Казахстане`"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            format="webp"
            quality="85"
            width="600"
            height="600"
            sizes="100vw md:50vw"
          />
          <span v-if="product.badge" class="badge" :class="{ accent: product.badge === 'Акция' }">
            {{ product.badge }}
          </span>
        </div>
        <div class="thumbs">
          <button
            v-for="(src, i) in gallery"
            :key="i"
            :class="{ active: i === activeImage }"
            @click="activeImage = i"
          >
            <NuxtImg
              :src="src"
              :alt="`${product.name} — фото ${i + 1}`"
              loading="lazy"
              decoding="async"
              format="webp"
              quality="70"
              width="100"
              height="100"
            />
          </button>
        </div>
      </div>

      <div class="info">
        <span class="brand">{{ product.brand }} · {{ product.productClass }}</span>
        <h1>{{ product.name }}</h1>

        <div class="price-block">
          <div class="price">{{ product.price }}</div>
          <p class="price-note">{{ $t('product.priceNote') }}</p>
        </div>

        <!-- City availability -->
        <div v-if="cityAvail" class="city-avail-block">
          <span
            class="city-avail-badge"
            :style="{ background: stockStatusColor[cityAvail.stockStatus] + '18', color: stockStatusColor[cityAvail.stockStatus], borderColor: stockStatusColor[cityAvail.stockStatus] + '44' }"
          >
            {{ stockStatusLabel[cityAvail.stockStatus] ?? cityAvail.stockStatus }}
            <template v-if="cityAvail.deliveryDays"> · {{ cityAvail.deliveryDays }} дн.</template>
          </span>
          <span class="city-avail-city">{{ cityAvail.cityName }}</span>
        </div>

        <!-- Alternative cities if out of stock -->
        <div v-if="cityAvail?.stockStatus === 'out_of_stock' && alternativeCities.length" class="alt-cities">
          <span class="alt-cities-label">Доступно в:</span>
          <RouterLink
            v-for="c in alternativeCities"
            :key="c.cityId"
            :to="`/catalog/${product.category}/${c.citySlug}`"
            class="alt-city-link"
          >
            {{ c.cityName }}<template v-if="c.deliveryDays"> ({{ c.deliveryDays }} дн.)</template>
          </RouterLink>
        </div>

        <div class="actions">
          <BaseButton variant="primary" size="lg" @click="ui.openQuote(product)">
            {{ $t('product.requestQuote') }}
          </BaseButton>
          <BaseButton variant="outline" size="lg" @click="cart.toggle(product.id)">
            {{ cart.has(product.id) ? $t('product.inCart') : $t('product.buy') }}
          </BaseButton>
        </div>

        <div class="icon-actions">
          <button @click="wishlist.toggle(product.id)" :class="{ active: wishlist.has(product.id) }">
            ♡ {{ wishlist.has(product.id) ? $t('product.inWishlist') : $t('product.addToWishlist') }}
          </button>
          <button @click="compare.toggle(product.id)" :class="{ active: compare.has(product.id) }">
            ⇄ {{ compare.has(product.id) ? $t('product.inCompare') : $t('product.compare') }}
          </button>
        </div>

        <ul class="perks">
          <li>{{ $t('product.perk1') }}</li>
          <li>{{ $t('product.perk2') }}</li>
          <li>{{ $t('product.perk3') }}</li>
          <li>{{ $t('product.perk4') }}</li>
        </ul>
      </div>
    </div>

    <section class="tabs-section">
      <div class="tabs">
        <button :class="{ active: tab === 'description' }" @click="tab = 'description'">
          {{ $t('product.tabDescription') }}
        </button>
        <button :class="{ active: tab === 'specs' }" @click="tab = 'specs'">{{ $t('product.tabSpecs') }}</button>
        <button :class="{ active: tab === 'docs' }" @click="tab = 'docs'">{{ $t('product.tabDocs') }}</button>
      </div>

      <div v-if="tab === 'description'" class="tab-body">
        <div
          v-if="markdownDescription"
          class="markdown-body"
          v-html="markdownDescription"
        />
        <p v-else class="text-muted">{{ $t('product.noDescription') }}</p>
      </div>

      <div v-if="tab === 'specs'" class="tab-body">
        <table class="specs">
          <tbody>
            <tr v-for="(value, key) in specs" :key="key">
              <th>{{ key }}</th>
              <td>{{ value }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="tab === 'docs'" class="tab-body">
        <ul v-if="documents.length" class="docs">
          <li v-for="doc in documents" :key="doc.id">
            <a :href="doc.fileUrl" target="_blank" rel="noopener" class="doc-link">
              <span>📄</span>
              <div>
                <strong>{{ doc.title }}</strong>
                <small>{{ doc.fileType?.toUpperCase() }} · {{ doc.fileSize }}</small>
              </div>
            </a>
          </li>
        </ul>
        <p v-else class="text-muted">{{ $t('product.noDocs') }}</p>
      </div>
    </section>

    <section v-if="related.length" class="related">
      <h2>{{ $t('product.relatedTitle') }}</h2>
      <div class="related-grid">
        <ProductCard v-for="p in related" :key="p.id" :product="p" />
      </div>
    </section>
  </AppContainer>

  <AppContainer v-else>
    <div class="missing">
      <h2>{{ $t('product.notFound') }}</h2>
      <BaseButton to="/catalog" variant="primary">{{ $t('product.backToCatalog') }}</BaseButton>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-9);
  text-align: center;
  color: var(--color-text-muted);
}
.layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-7);
  align-items: start;
}
.gallery {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.main-img {
  position: relative;
  aspect-ratio: 4/3;
  background: #fff;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
}
.main-img :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}
.badge {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.badge.accent {
  background: var(--color-accent);
}
.thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
}
.thumbs button {
  padding: 0;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid transparent;
  background: var(--color-surface);
}
.thumbs button.active {
  border-color: var(--color-primary);
}
.thumbs :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.brand {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-primary);
  font-weight: 700;
}
h1 {
  font-family: var(--font-display);
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.price-block {
  background: var(--color-primary-soft);
  border: 1px solid #d4e4fa;
  border-radius: var(--radius);
  padding: var(--space-4) var(--space-5);
}
.price {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 700;
  color: var(--color-primary-dark);
  letter-spacing: -0.02em;
}
.price-note {
  margin-top: var(--space-2);
  font-size: 13px;
  color: var(--color-text-muted);
}
.city-avail-block {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: -4px;
}
.city-avail-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  border: 1px solid transparent;
}
.city-avail-city {
  font-size: 12.5px;
  color: var(--color-text-muted);
}
.alt-cities {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.alt-cities-label {
  color: var(--color-text-muted);
}
.alt-city-link {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.icon-actions {
  display: flex;
  gap: var(--space-3);
}
.icon-actions button {
  font-size: 14px;
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
}
.icon-actions button:hover,
.icon-actions button.active {
  color: var(--color-primary);
}
.perks {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
}
.perks li::before {
  content: none;
}
.tabs-section {
  margin-top: var(--space-7);
}
.tabs {
  display: flex;
  gap: var(--space-3);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--space-5);
}
.tabs button {
  padding: var(--space-3) var(--space-2);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}
.tabs button.active {
  color: var(--color-text);
  border-color: var(--color-primary);
}
.tab-body {
  font-size: 15px;
  line-height: 1.65;
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  max-width: 820px;
}
.text-muted {
  color: var(--color-text-muted);
}
.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4) {
  font-weight: 600;
  line-height: 1.3;
  margin: 1em 0 0.5em;
}
.markdown-body :deep(h1) { font-size: 1.5em; }
.markdown-body :deep(h2) { font-size: 1.25em; }
.markdown-body :deep(h3) { font-size: 1.1em; }
.markdown-body :deep(p) { margin: 0.75em 0; }
.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5em;
  margin: 0.5em 0;
}
.markdown-body :deep(li) { margin: 0.25em 0; }
.markdown-body :deep(strong) { font-weight: 600; }
.markdown-body :deep(em) { font-style: italic; }
.markdown-body :deep(a) { color: var(--color-primary); text-decoration: underline; }
.markdown-body :deep(img) { max-width: 100%; border-radius: var(--radius); margin: 0.5em 0; }
.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-border);
  padding-left: 1em;
  color: var(--color-text-muted);
  margin: 0.5em 0;
}
.markdown-body :deep(code) {
  background: var(--color-surface);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
}
.markdown-body :deep(pre) {
  background: var(--color-surface);
  padding: 1em;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 0.5em 0;
}
.specs {
  width: 100%;
  border-collapse: collapse;
}
.specs th,
.specs td {
  text-align: left;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  font-size: 14px;
}
.specs th {
  width: 40%;
  color: var(--color-text-muted);
  font-weight: 500;
}
.specs td {
  font-weight: 500;
}
.docs {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  list-style: none;
  padding: 0;
  margin: 0;
}
.doc-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
}
.doc-link:hover {
  border-color: var(--color-primary);
}
.docs span {
  font-size: 24px;
}
.docs strong {
  display: block;
  font-weight: 600;
}
.docs small {
  color: var(--color-text-muted);
  font-size: 12px;
}
.related {
  margin-top: var(--space-8);
}
.related h2 {
  font-size: 24px;
  margin-bottom: var(--space-5);
}
.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: var(--space-4);
}
.missing {
  margin-top: var(--space-9);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
