<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import QuoteModal from '@/components/ui/QuoteModal.vue'
import CookieBanner from '@/components/ui/CookieBanner.vue'
import { useConsent } from '@/composables/useConsent'
import { loadYandexMetrika } from '@/composables/useYandexMetrika'
import { loadGA4 } from '@/composables/useGA4'

const { consent } = useConsent()
const i18n = useI18n()

function loadAnalytics() {
  loadYandexMetrika()
  loadGA4()
}

onMounted(() => {
  const stored = localStorage.getItem('locale')
  if (stored === 'ru' || stored === 'kk') i18n.locale.value = stored

  if (consent.value === 'accepted') loadAnalytics()
})

watch(consent, (value) => {
  if (value === 'accepted') loadAnalytics()
})
</script>

<template>
  <a href="#main-content" class="skip-link">Перейти к содержимому</a>
  <SiteHeader />
  <main id="main-content" aria-label="Основное содержимое">
    <NuxtPage />
  </main>
  <SiteFooter />
  <QuoteModal />
  <CookieBanner />
</template>

<style>
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.skip-link:focus {
  position: fixed;
  top: 0;
  left: 0;
  width: auto;
  height: auto;
  padding: 12px 20px;
  background: #1f5fbf;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  z-index: 9999;
  text-decoration: none;
  border-radius: 0 0 6px 0;
}
</style>
