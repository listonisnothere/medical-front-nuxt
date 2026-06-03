<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppContainer from '../ui/AppContainer.vue'
import LanguageSwitcher from '../ui/LanguageSwitcher.vue'
import CitySwitcher from './CitySwitcher.vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useCompareStore } from '@/stores/compare'
import { useCategoriesDataStore } from '@/stores/categoriesData'
import { useCitiesDataStore } from '@/stores/citiesData'
import { useSelectedCity } from '@/composables/useSelectedCity'

interface NavItem {
  to: string
  label: string
  children?: { to: string; label: string }[]
}

const open = ref(false)
const openMenu = ref<string | null>(null)
const search = ref('')
const scrolled = ref(false)
const router = useRouter()
const { t } = useI18n()
const cart = useCartStore()
const wishlist = useWishlistStore()
const compare = useCompareStore()
const categoriesStore = useCategoriesDataStore()
const citiesStore = useCitiesDataStore()
const { selectedCity, selectedCitySlug } = useSelectedCity()

onMounted(() => {
  categoriesStore.load()
  citiesStore.load()
  const onScroll = () => { scrolled.value = window.scrollY > 12 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

function catLink(slug: string) {
  return selectedCity.value
    ? `/catalog/${slug}/${selectedCitySlug.value}`
    : `/catalog/${slug}`
}

const categoryNavItems = computed<NavItem[]>(() =>
  (categoriesStore.items as any[]).map((cat) => ({
    to: catLink(cat.slug),
    label: cat.title,
    children: cat.children?.length
      ? [
          { to: catLink(cat.slug), label: t('header.allCategory') + cat.title },
          ...cat.children.map((sub: any) => ({
            to: catLink(sub.slug),
            label: sub.title,
          })),
        ]
      : undefined,
  }))
)

const navItems = computed<NavItem[]>(() => [
  ...categoryNavItems.value,
  { to: '/catalog/sale', label: t('header.sale') },
  { to: '/in-stock', label: t('header.inStock') },
  { to: '/contacts', label: t('header.contacts') },
])

const submitSearch = (e: Event) => {
  e.preventDefault()
  const q = search.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
  search.value = ''
  open.value = false
}
</script>

<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="topbar">
      <AppContainer>
        <div class="topbar-row">
          <CitySwitcher />
          <LanguageSwitcher />
          <a href="tel:+77752540351" class="phone">+7 775 254 03 51</a>
          <a href="mailto:info@medcoregroup.kz" class="email">info@medcoregroup.kz</a>
          <span class="hours">{{ $t('header.hours') }}</span>
        </div>
      </AppContainer>
    </div>

    <div class="main">
      <AppContainer>
        <div class="main-row">
          <RouterLink to="/" class="logo" :aria-label="$t('header.logoAriaLabel')">
            <NuxtImg
              src="~/assets/images/og-logo.png"
              alt="MedCore Group"
              format="webp"
              width="160"
              height="107"
              loading="eager"
            />
          </RouterLink>

          <form class="search" role="search" @submit="submitSearch">
            <svg class="search-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5"/>
              <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <input
              v-model="search"
              type="search"
              :placeholder="$t('header.searchPlaceholder')"
              :aria-label="$t('header.searchAriaLabel')"
            />
            <button type="submit" :aria-label="$t('header.searchBtn')">{{ $t('header.searchBtn') }}</button>
          </form>

          <div class="actions">
            <RouterLink to="/compare" class="action" :aria-label="$t('header.compareAria')">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 10h14M13 6l4 4-4 4M7 6L3 10l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-if="compare.count" class="badge">{{ compare.count }}</span>
            </RouterLink>
            <RouterLink to="/wishlist" class="action" :aria-label="$t('header.wishlistAria')">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 17S3 13 3 7.5A4 4 0 0110 4.5 4 4 0 0117 7.5C17 13 10 17 10 17z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
              </svg>
              <span v-if="wishlist.count" class="badge">{{ wishlist.count }}</span>
            </RouterLink>
            <RouterLink to="/cart" class="action" :aria-label="$t('header.cartAria')">
              <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2h2l2 9h9l2-6H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="8" cy="16" r="1.25" fill="currentColor"/>
                <circle cx="14" cy="16" r="1.25" fill="currentColor"/>
              </svg>
              <span v-if="cart.count" class="badge">{{ cart.count }}</span>
            </RouterLink>
          </div>

          <button
            class="burger"
            :aria-expanded="open"
            :aria-label="$t('header.menuAria')"
            @click="open = !open"
          >
            <span /><span /><span />
          </button>
        </div>
      </AppContainer>
    </div>

    <nav class="nav" :class="{ open }" :aria-label="$t('header.menuAria')">
      <AppContainer>
        <ul class="nav-list" role="menubar" @mouseleave="openMenu = null">
          <li
            v-for="item in navItems"
            :key="item.to"
            class="nav-item"
            @mouseenter="openMenu = item.children ? item.label : null"
          >
            <RouterLink :to="item.to" @click="open = false">{{ item.label }}</RouterLink>

            <div v-if="item.children && openMenu === item.label" class="mega">
              <ul>
                <li v-for="c in item.children" :key="c.to">
                  <RouterLink :to="c.to" @click="(open = false), (openMenu = null)">
                    {{ c.label }}
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </AppContainer>
    </nav>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: 0 1px 0 rgba(11, 25, 41, 0.04);
  transition: box-shadow 0.2s;
}

.site-header.scrolled {
  box-shadow: 0 2px 24px rgba(11, 25, 41, 0.10);
}

/* TOPBAR */
.topbar {
  background: var(--color-text);
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.01em;
}

.topbar-row {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  height: 34px;
}

.topbar-row .phone {
  font-weight: 600;
  color: #fff;
}

.topbar-row .email {
  color: rgba(255, 255, 255, 0.72);
  transition: color 0.15s;
}

.topbar-row .email:hover {
  color: #fff;
}

.topbar-row .hours {
  margin-left: auto;
}

/* MAIN ROW */
.main-row {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: center;
  padding: var(--space-4) 0;
  gap: var(--space-5);
}

/* LOGO */
.logo {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.logo :deep(img) {
  height: 44px;
  width: auto;
  flex-shrink: 0;
  object-fit: contain;
}

/* SEARCH */
.search {
  display: flex;
  align-items: stretch;
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  max-width: 520px;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}

.search:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.search-icon {
  width: 16px;
  height: 16px;
  margin-left: 12px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  align-self: center;
}

.search input {
  flex: 1;
  padding: 10px 10px;
  font: inherit;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  color: var(--color-text);
  min-width: 0;
}

.search button {
  flex-shrink: 0;
  padding: 0 20px;
  background: var(--color-primary);
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border-left: none;
  transition: background 0.15s;
  line-height: 1;
}

.search button:hover {
  background: var(--color-primary-dark);
}

/* ACTIONS */
.actions {
  display: flex;
  gap: var(--space-2);
}

.action {
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: var(--radius);
  display: grid;
  place-items: center;
  color: var(--color-text-muted);
  transition: background 0.15s, color 0.15s;
}

.action svg {
  width: 20px;
  height: 20px;
}

.action:hover {
  background: var(--color-surface);
  color: var(--color-primary);
}

.action .badge {
  position: absolute;
  top: -3px;
  right: -3px;
  min-width: 17px;
  height: 17px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--color-accent);
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

/* BURGER */
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
}

.burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
  transition: transform 0.2s;
}

/* NAV */
.nav {
  border-top: 1px solid var(--color-border);
  background: var(--color-bg);
  position: relative;
}

.nav::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 40px;
  pointer-events: none;
  background: linear-gradient(to right, transparent, var(--color-bg) 70%);
}

.nav-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 0 var(--space-4);
  padding: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-list::-webkit-scrollbar {
  display: none;
}

.nav-list a {
  white-space: nowrap;
}

.nav-item {
  position: relative;
}

.nav-list a {
  display: inline-flex;
  align-items: center;
  font-size: 13.5px;
  font-weight: 500;
  color: var(--color-text-muted);
  padding: 12px 2px;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
  letter-spacing: 0.01em;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

/* MEGA */
.mega {
  position: absolute;
  top: calc(100% + 4px);
  left: -12px;
  min-width: 260px;
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  padding: var(--space-2) 0;
  z-index: 60;
}

.mega ul {
  display: flex;
  flex-direction: column;
}

.mega a {
  display: block;
  padding: 9px var(--space-4);
  font-size: 13.5px;
  color: var(--color-text);
  border-bottom: none;
  transition: background 0.1s, color 0.1s;
  letter-spacing: 0;
}

.mega a:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .topbar-row .email,
  .topbar-row .hours {
    display: none;
  }

  .burger {
    display: flex;
  }

  .main-row {
    grid-template-columns: auto 1fr auto;
  }

  .search {
    grid-column: 1 / -1;
    grid-row: 2;
    max-width: none;
  }

  .actions {
    display: none;
  }

  .nav {
    display: none;
  }

  .nav.open {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    box-shadow: var(--shadow-lg);
    max-height: 70vh;
    overflow-y: auto;
  }

  .nav-list {
    flex-direction: column;
    gap: 0;
  }

  .nav-list li {
    border-bottom: 1px solid var(--color-border);
  }

  .nav-list a {
    display: block;
    padding: var(--space-3) 0;
    border-bottom: none;
  }

  .mega {
    position: static;
    box-shadow: none;
    border: none;
    border-top: 1px dashed var(--color-border);
    margin: 0;
    padding: 0 0 var(--space-3);
  }
}
</style>
