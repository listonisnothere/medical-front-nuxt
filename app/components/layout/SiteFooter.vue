<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import AppContainer from '../ui/AppContainer.vue'
import api from '@/composables/useApi'

const { t } = useI18n()

const email = ref('')
const subscribed = ref(false)
const subscribing = ref(false)
const subscribe = async (e: Event) => {
  e.preventDefault()
  if (!email.value) return
  subscribing.value = true
  try {
    await api.post('/newsletter/subscribe', { email: email.value })
  } catch {
    // show success regardless
  } finally {
    subscribing.value = false
  }
  subscribed.value = true
  email.value = ''
  setTimeout(() => (subscribed.value = false), 3500)
}

const cols = computed(() => [
  {
    title: t('footer.colCompany'),
    links: [
      { to: '/about', label: t('footer.linkAbout') },
      { to: '/news', label: t('footer.linkNews') },
      { to: '/brands', label: t('footer.linkBrands') },
      { to: '/contacts', label: t('footer.linkContacts') },
      { to: '/privacy', label: t('footer.linkPrivacy') },
    ],
  },
  {
    title: t('footer.colCatalog'),
    links: [
      { to: '/catalog', label: t('footer.linkAllEquipment') },
      { to: '/in-stock', label: t('footer.linkInStock') },
      { to: '/catalog/sale', label: t('footer.linkSpecials') },
      { to: '/catalog/ultrasound', label: t('footer.linkUltrasound') },
      { to: '/catalog/anesthesia', label: t('footer.linkAnesthesia') },
      { to: '/catalog/monitors', label: t('footer.linkMonitors') },
    ],
  },
  {
    title: t('footer.colServices'),
    links: [
      { to: '/services/consulting', label: t('footer.linkConsulting') },
      { to: '/services/design', label: t('footer.linkDesign') },
      { to: '/services/equipment', label: t('footer.linkEquipment') },
      { to: '/services/service', label: t('footer.linkService') },
      { to: '/services/training', label: t('footer.linkTraining') },
      { to: '/services/leasing', label: t('footer.linkLeasing') },
    ],
  },
])
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <AppContainer>
        <div class="subscribe-row">
          <div class="subscribe-copy">
            <span class="subscribe-eyebrow">{{ $t('footer.stayUpdated') }}</span>
            <h3>{{ $t('footer.subscribeTitle') }}</h3>
            <p>{{ $t('footer.subscribeDesc') }}</p>
          </div>
          <form class="subscribe-form" @submit="subscribe">
            <input
              v-model="email"
              type="email"
              required
              :placeholder="$t('footer.emailPlaceholder')"
              aria-label="E-mail"
            />
            <button type="submit" :disabled="subscribing">
              {{ subscribed ? $t('footer.subscribeDone') : subscribing ? $t('footer.subscribing') : $t('footer.subscribeBtn') }}
            </button>
          </form>
        </div>
      </AppContainer>
    </div>

    <div class="footer-main">
      <AppContainer>
        <div class="grid">
          <div class="brand">
            <RouterLink to="/" class="footer-logo" aria-label="MedCore Group">
              <NuxtImg
                src="~/assets/images/og-logo.png"
                alt="MedCore Group"
                format="webp"
                width="140"
                height="93"
              />
            </RouterLink>
            <p class="brand-desc">{{ $t('footer.brandDesc') }}</p>
            <div class="contacts">
              <a href="tel:+77752540351">
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 2h2.5l1 3-1.5 1.5a10 10 0 004.5 4.5L11 9.5l3 1V13a2 2 0 01-2 2A13 13 0 011 4a2 2 0 012-2z" stroke="currentColor" stroke-width="1.2"/></svg>
                +7 775 254 03 51
              </a>
              <a href="mailto:info@medcoregroup.kz">
                <svg viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M1 5l7 5 7-5" stroke="currentColor" stroke-width="1.2"/></svg>
                info@medcoregroup.kz
              </a>
              <span class="addr">
                <svg viewBox="0 0 16 16" fill="none"><path d="M8 1C5.8 1 4 2.8 4 5c0 3.3 4 9 4 9s4-5.7 4-9c0-2.2-1.8-4-4-4z" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="5" r="1.5" stroke="currentColor" stroke-width="1.2"/></svg>
                {{ $t('footer.address') }}
              </span>
              <a href="https://www.instagram.com/med_core_group/" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" stroke-width="1.2"/><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/><circle cx="11.5" cy="4.5" r="0.75" fill="currentColor"/></svg>
                Instagram
              </a>
            </div>
          </div>

          <nav v-for="col in cols" :key="col.title" class="col" :aria-label="col.title">
            <h4>{{ col.title }}</h4>
            <ul>
              <li v-for="link in col.links" :key="link.to">
                <RouterLink :to="link.to">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </AppContainer>
    </div>

    <div class="footer-bottom">
      <AppContainer>
        <div class="legal">
          <span>{{ $t('footer.legal') }}</span>
          <span class="legal-center">{{ $t('footer.copyright') }}</span>
          <RouterLink to="/privacy">{{ $t('footer.linkPrivacy') }}</RouterLink>
        </div>
      </AppContainer>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: var(--space-9);
}

/* TOP — subscribe */
.footer-top {
  background: #1a4f9c;
  padding: var(--space-7) 0;
}

.subscribe-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-7);
  align-items: center;
}

.subscribe-eyebrow {
  display: inline-block;
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 700;
  color: #c8881a;
  margin-bottom: var(--space-2);
}

.subscribe-copy h3 {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
  margin-bottom: var(--space-2);
}

.subscribe-copy p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);
}

.subscribe-form {
  display: flex;
  gap: 0;
  min-width: 340px;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.subscribe-form input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  outline: none;
  padding: 12px 16px;
  font: inherit;
  font-size: 14px;
  color: #fff;
}

.subscribe-form input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.subscribe-form button {
  padding: 12px 22px;
  background: #c8881a;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: background 0.15s;
}

.subscribe-form button:hover:not(:disabled) {
  background: #a96d0f;
}

/* MAIN */
.footer-main {
  background: #0b1929;
  padding: var(--space-8) 0 var(--space-7);
}

.grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr;
  gap: var(--space-7);
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: var(--space-4);
}

.footer-logo :deep(img) {
  height: 40px;
  width: auto;
  object-fit: contain;
}

.brand-desc {
  font-size: 13.5px;
  line-height: 1.65;
  color: #64748b;
  margin-bottom: var(--space-4);
}

.contacts {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: 13.5px;
}

.contacts a,
.contacts .addr {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #94a3b8;
  transition: color 0.15s;
}

.contacts a:hover {
  color: #fff;
}

.contacts svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  opacity: 0.6;
}

.col h4 {
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.col ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col a {
  font-size: 13.5px;
  color: #64748b;
  transition: color 0.15s;
  line-height: 1.4;
}

.col a:hover {
  color: #94a3b8;
}

/* BOTTOM */
.footer-bottom {
  background: #060e1a;
  padding: var(--space-4) 0;
}

.legal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  font-size: 12.5px;
  color: #334155;
}

.legal-center {
  color: #475569;
}

.legal a {
  color: #475569;
  transition: color 0.15s;
}

.legal a:hover {
  color: #94a3b8;
}

@media (max-width: 1024px) {
  .subscribe-row {
    grid-template-columns: 1fr;
  }
  .subscribe-form {
    min-width: 0;
  }
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
  }
}

@media (max-width: 540px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .legal {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
