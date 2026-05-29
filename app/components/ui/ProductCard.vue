<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Product } from '@/data/products'
import { useWishlistStore } from '@/stores/wishlist'
import { useUiStore } from '@/stores/ui'

const props = defineProps<{ product: Product }>()

const { t, locale } = useI18n()

const imageSrc = ref(props.product.image || '/img/product-placeholder.svg')

function onImgError() {
  imageSrc.value = '/img/product-placeholder.svg'
}
const wishlist = useWishlistStore()
const ui = useUiStore()

const NEW_PRODUCT_DAYS = 60

const isNew = computed(() => {
  if (!props.product.createdAt) return false
  const created = new Date(props.product.createdAt).getTime()
  return Date.now() - created < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000
})

const hasActiveDiscount = computed(() => {
  const p = props.product
  if (!p.discountPercent || p.discountPercent <= 0) return false
  if (p.discountUntil && new Date(p.discountUntil).getTime() < Date.now()) return false
  return true
})

interface ResolvedBadge {
  text: string
  className: string
}

const resolvedBadge = computed<ResolvedBadge | null>(() => {
  const p = props.product
  if (p.badgeKey === 'hot' || p.badge === 'Топ продаж') {
    return { text: t('productCard.badgeHot'), className: 'badge--hot' }
  }
  if (hasActiveDiscount.value) {
    return { text: t('productCard.badgeDiscount', { n: p.discountPercent }), className: 'badge--sale' }
  }
  if (p.badgeKey === 'new' || p.badge === 'Новинка' || isNew.value) {
    return { text: t('productCard.badgeNew'), className: 'badge--new' }
  }
  if (p.badgeKey === 'sale' || p.badge === 'Акция') {
    return { text: t('productCard.badgeSale'), className: 'badge--sale' }
  }
  return null
})

const priceFormatted = computed(() => {
  const p = props.product
  if (p.priceFrom == null) return p.price
  const currency = p.priceCurrency ?? 'KZT'
  const formatted = Math.round(p.priceFrom)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  if (currency === 'USD') return `от $${formatted}`
  if (currency === 'EUR') return `от €${formatted}`
  return `от ${formatted} ₸`
})

const showPriceFrom = computed(() => props.product.priceFrom != null)

const stockLabel = computed(() => {
  const status = props.product.stockStatus ?? 'in_stock'
  if (status === 'in_stock') return t('productCard.inStock')
  if (status === 'on_order') return t('productCard.onOrder')
  return t('productCard.outOfStock')
})

const urgencyComputed = computed(() => {
  const p = props.product
  if (p.urgencyText) return p.urgencyText
  if (
    p.stockStatus === 'in_stock' &&
    typeof p.stockQuantity === 'number' &&
    p.stockQuantity > 0 &&
    p.stockQuantity <= 3
  ) {
    return t('productCard.urgencyLeft', { n: p.stockQuantity })
  }
  if (hasActiveDiscount.value && p.discountUntil) {
    const dt = new Date(p.discountUntil)
    const dateStr = dt.toLocaleDateString(locale.value === 'kk' ? 'kk-KZ' : 'ru-RU')
    return t('productCard.discountUntil', { n: p.discountPercent, date: dateStr })
  }
  return ''
})

function pluralizeUnits(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'единица'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'единицы'
  return 'единиц'
}

const ratingStars = computed(() => {
  const r = props.product.rating
  if (!r) return null
  return '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r))
})

const quickSpecs = computed(() => (props.product.quickSpecs ?? []).slice(0, 4))
const highlights = computed(() => (props.product.highlights ?? []).slice(0, 4))

function toggleWishlist() {
  wishlist.toggle(props.product.id)
}

function openQuote() {
  ui.openQuote(props.product)
}
</script>

<template>
  <article class="card">
    <RouterLink :to="`/product/${product.id}`" class="media">
      <NuxtImg
        :src="imageSrc"
        :alt="`${product.name} — ${product.brand} купить в Казахстане`"
        loading="lazy"
        decoding="async"
        format="webp"
        quality="80"
        width="400"
        height="300"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        @error="onImgError"
      />

      <span v-if="resolvedBadge" class="badge" :class="resolvedBadge.className">
        {{ resolvedBadge.text }}
      </span>

      <span v-if="product.productClass" class="class-chip">{{ product.productClass }}</span>

      <button
        type="button"
        class="wish-btn"
        :class="{ active: wishlist.has(product.id) }"
        :aria-label="wishlist.has(product.id) ? $t('productCard.removeWishlist') : $t('productCard.addWishlist')"
        @click.prevent="toggleWishlist"
      >
        {{ wishlist.has(product.id) ? '❤' : '♡' }}
      </button>
    </RouterLink>

    <div v-if="quickSpecs.length" class="quick-specs">
      <div v-for="(spec, i) in quickSpecs" :key="i" class="qs-cell">
        <span class="qs-val">{{ spec.val }}</span>
        <span class="qs-label">{{ spec.label }}</span>
      </div>
    </div>

    <div class="body">
      <div class="brand-row">
        <span class="brand">{{ product.brand }}</span>
        <span v-if="product.rating" class="rating">
          <span class="stars">{{ ratingStars }}</span>
          <span v-if="product.reviewsCount" class="reviews">({{ product.reviewsCount }})</span>
        </span>
      </div>

      <RouterLink :to="`/product/${product.id}`" class="name-link">
        <h3 class="name">{{ product.name }}</h3>
      </RouterLink>

      <p v-if="product.shortDescription" class="short-desc">
        {{ product.shortDescription }}
      </p>

      <div v-if="highlights.length" class="tags">
        <span v-for="(tag, i) in highlights" :key="i" class="tag">{{ tag }}</span>
      </div>

      <div class="price-block">
        <div class="price-left">
          <div class="price-value">{{ showPriceFrom ? priceFormatted : product.price }}</div>
          <div v-if="product.priceNote" class="price-note">{{ product.priceNote }}</div>
        </div>
        <div class="price-right">
          <div v-if="product.deliveryDays" class="delivery">✈️ {{ product.deliveryDays }}</div>
          <div class="stock" :class="`stock--${product.stockStatus ?? 'in_stock'}`">
            <span class="stock-dot"></span>
            {{ stockLabel }}
          </div>
        </div>
      </div>

      <div class="actions">
        <button type="button" class="btn btn--cta" @click="openQuote">
          {{ $t('productCard.ctaBtn') }}
        </button>
        <RouterLink :to="`/product/${product.id}`" class="btn btn--secondary">
          {{ $t('productCard.details') }}
        </RouterLink>
      </div>
    </div>

    <div v-if="urgencyComputed" class="urgency">
      ⏳ {{ urgencyComputed }}
    </div>

    <div v-if="product.socialProof" class="social-proof">
      <span class="avatars">
        <span class="avatar">К</span>
        <span class="avatar">М</span>
        <span class="avatar">+</span>
      </span>
      <span class="social-text">{{ product.socialProof }}</span>
    </div>
  </article>
</template>

<style scoped>
.card {
  --card-radius: 18px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--card-radius);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;
  position: relative;
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 16px 40px -16px rgba(26, 79, 156, 0.28);
  transform: translateY(-3px);
}

.card:hover .media img {
  transform: scale(1.04);
}

@media (hover: none) {
  .card:active {
    transform: scale(0.98);
    transition: transform 0.2s;
  }
}

/* MEDIA */
.media {
  position: relative;
  display: block;
  aspect-ratio: 4/3;
  background: var(--color-surface);
  overflow: hidden;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.02em;
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.25);
}

.badge--hot { background: #d93025; }
.badge--new { background: #0f6b8a; }
.badge--sale { background: #c8881a; }

.class-chip {
  position: absolute;
  bottom: 10px;
  left: 12px;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: #0d1f3c;
  backdrop-filter: blur(6px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.wish-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid var(--color-border);
  display: grid;
  place-items: center;
  font-size: 16px;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    color 0.15s,
    transform 0.15s,
    border-color 0.15s;
}

.wish-btn:hover { color: #ff4757; border-color: #ff4757; }
.wish-btn.active {
  color: #ff4757;
  border-color: #ff4757;
  animation: pop 0.25s ease;
}

@keyframes pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* QUICK SPECS */
.quick-specs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  background: #fafbfd;
}

.qs-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 10px 4px;
  border-right: 1px solid var(--color-border);
}

.qs-cell:last-child { border-right: none; }

.qs-val {
  font-size: 14px;
  font-weight: 700;
  color: #0d1f3c;
  line-height: 1.1;
}

.qs-label {
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

/* BODY */
.body {
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.brand {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  font-weight: 700;
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.stars { color: #f39c12; letter-spacing: 1px; line-height: 1; }
.reviews { color: var(--color-text-muted); font-size: 11px; }

.name-link {
  text-decoration: none;
  color: inherit;
}

.name {
  font-size: 15px;
  line-height: 1.35;
  font-weight: 700;
  color: #0d1f3c;
  margin: 0;
  transition: color 0.15s;
}

.name-link:hover .name { color: #2e7dd1; }

.short-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tag {
  font-size: 10px;
  padding: 3px 8px;
  background: #f4f7fb;
  color: #1a4b8c;
  border-radius: 6px;
  border: 1px solid #e2e8f4;
  font-weight: 500;
}

/* PRICE BLOCK */
.price-block {
  margin-top: auto;
  background: linear-gradient(135deg, #f0f6ff, #e8f0fd);
  border: 1px solid #d8e4f7;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.price-left { min-width: 0; }

.price-value {
  font-size: 16px;
  font-weight: 800;
  color: #0d1f3c;
  line-height: 1.1;
}

.price-note {
  font-size: 10px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.price-right {
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 11px;
}

.delivery {
  color: #1a4b8c;
  font-weight: 600;
}

.stock {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-muted);
  font-weight: 500;
}

.stock-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #9ca3af;
}

.stock--in_stock { color: #27ae60; }
.stock--in_stock .stock-dot {
  background: #27ae60;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.5); }
  50% { box-shadow: 0 0 0 6px rgba(39, 174, 96, 0); }
}

.stock--out_of_stock { color: #ff4757; }
.stock--out_of_stock .stock-dot { background: #ff4757; }

/* ACTIONS */
.actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 12px;
  padding: 10px 8px;
  text-decoration: none;
  border: 1px solid transparent;
  cursor: pointer;
  transition: filter 0.15s, background 0.15s, color 0.15s, transform 0.05s;
  white-space: nowrap;
}

.btn:active { transform: translateY(1px); }

.btn--cta {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: #fff;
  flex: 2;
}

.btn--cta:hover { filter: brightness(1.08); }

.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--secondary:hover { background: var(--color-primary-soft); }

/* URGENCY */
.urgency {
  background: #fff8f0;
  border-top: 1px solid #fce4c8;
  padding: 8px 14px;
  font-size: 11px;
  color: #c97000;
  font-weight: 600;
}

/* SOCIAL PROOF */
.social-proof {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 10px;
  font-size: 11px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

.avatars { display: inline-flex; }

.avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #e2e8f4;
  color: #1a4b8c;
  font-size: 10px;
  font-weight: 700;
  display: grid;
  place-items: center;
  border: 1.5px solid #fff;
  margin-left: -6px;
}

.avatar:first-child { margin-left: 0; }
.social-text { line-height: 1.3; }
</style>
