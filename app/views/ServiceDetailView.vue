<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useServicesDataStore } from '@/stores/servicesData'
import { useMeta } from '@/composables/useMeta'
import { useUiStore } from '@/stores/ui'

const route = useRoute()
const { tm } = useI18n()
const ui = useUiStore()
const store = useServicesDataStore()

await useAsyncData('servicesData', () => store.load())

const service = computed(() => store.items.find((s) => s.slug === route.params.slug))

if (!service.value) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found' })
}

useMeta({
  title: () => service.value?.title ?? 'Услуга',
  description: () =>
    service.value?.description
      ? `${service.value.description} Оставьте заявку — специалист MedCore Group свяжется с вами в течение 30 минут.`
      : '',
  keywords: () =>
    service.value
      ? `${service.value.title}, услуги MedCore Group, ${service.value.title.toLowerCase()} медицинского оборудования, Казахстан`
      : '',
  jsonLd: () => {
    if (!service.value) return null
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: service.value.title,
          description: service.value.description,
          provider: {
            '@type': 'Organization',
            name: 'ТОО «MedCore Group»',
            url: 'https://www.medcoregroup.kz',
          },
          areaServed: { '@type': 'Country', name: 'Казахстан' },
          serviceType: 'Медицинское оборудование',
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            { '@type': 'ListItem', position: 2, name: 'Услуги', item: 'https://www.medcoregroup.kz/services' },
            { '@type': 'ListItem', position: 3, name: service.value.title },
          ],
        },
      ],
    }
  },
})

const related = computed(() => store.items.filter((s) => s.slug !== route.params.slug).slice(0, 3))

const detailsMap = computed(() => tm('serviceDetail.detailsMap') as Record<string, string[]>)
</script>

<template>
  <AppContainer v-if="store.loading">
    <div class="loading">{{ $t('serviceDetail.loading') }}</div>
  </AppContainer>

  <AppContainer v-else-if="service">
    <div class="page">
      <Breadcrumbs
        :items="[{ label: $t('services.breadcrumb'), to: '/services' }, { label: service.title }]"
      />

      <div class="hero">
        <div class="icon-wrap">{{ service.icon }}</div>
        <div>
          <SectionHeading :eyebrow="$t('serviceDetail.eyebrow')" :level="1">{{ service.title }}</SectionHeading>
          <p class="lead">{{ service.description }}</p>
        </div>
      </div>

      <div class="body">
        <div class="content">
          <h2>{{ $t('serviceDetail.whatIncluded') }}</h2>
          <ul class="list">
            <li v-for="item in detailsMap[service.slug] ?? []" :key="item">
              <span class="check">✓</span> {{ item }}
            </li>
          </ul>

          <div class="cta">
            <p>{{ $t('serviceDetail.ctaText') }}</p>
            <BaseButton variant="primary" size="lg" @click="ui.openQuote()">
              {{ $t('serviceDetail.ctaBtn') }}
            </BaseButton>
          </div>
        </div>

        <aside class="sidebar">
          <div class="contact-card">
            <h3>{{ $t('serviceDetail.contactTitle') }}</h3>
            <a href="tel:+77752540351" class="phone">+7 775 254 03 51</a>
            <a href="mailto:info@medcoregroup.kz" class="email">info@medcoregroup.kz</a>
            <p class="hours">{{ $t('serviceDetail.hours') }}</p>
          </div>

          <div class="other-services">
            <h4>{{ $t('serviceDetail.otherServices') }}</h4>
            <ul>
              <li v-for="s in related" :key="s.slug">
                <RouterLink :to="`/services/${s.slug}`">
                  <span class="s-icon">{{ s.icon }}</span> {{ s.title }}
                </RouterLink>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-9);
  text-align: center;
  color: var(--color-text-muted);
}
.page {
  margin-top: var(--space-7);
}
.hero {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
  margin-bottom: var(--space-7);
}
.icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  display: grid;
  place-items: center;
  font-size: 32px;
  flex-shrink: 0;
}
.lead {
  font-size: 17px;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 640px;
  margin-top: var(--space-2);
}
.body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-8);
  align-items: start;
}
.content h2 {
  font-size: 22px;
  margin-bottom: var(--space-4);
}
.list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-7);
}
.list li {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  font-size: 16px;
  line-height: 1.5;
}
.check {
  color: var(--color-primary);
  font-weight: 700;
  flex-shrink: 0;
}
.cta {
  background: var(--color-text);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.cta p {
  color: rgba(255, 255, 255, 0.7) !important;
}
.cta p {
  font-size: 16px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}
.contact-card {
  background: var(--color-primary);
  color: #fff;
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.contact-card h3 {
  font-size: 18px;
  color: #fff;
}
.phone {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.email {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}
.hours {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}
.other-services {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
}
.other-services h4 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-3);
}
.other-services ul {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.other-services a {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 14px;
  color: var(--color-text);
  padding: var(--space-2) 0;
  transition: color 0.15s;
}
.other-services a:hover {
  color: var(--color-primary);
}
.s-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
}
@media (max-width: 900px) {
  .body {
    grid-template-columns: 1fr;
  }
  .hero {
    flex-direction: column;
    gap: var(--space-4);
  }
}
</style>
