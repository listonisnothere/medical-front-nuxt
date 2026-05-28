<script setup lang="ts">
import { ref } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useMeta } from '@/composables/useMeta'
import api from '@/composables/useApi'

useMeta({
  title: () => 'Контакты',
  description: () =>
    'Контакты ТОО «MedCore Group»: 070004, ВКО, г. Усть-Каменогорск, пр. Ауэзова, 14/1. Тел: +7 775 254 03 51. Email: MedCore_Group@mail.ru. Оставьте заявку — перезвоним!',
  keywords: () =>
    'контакты MedCore Group, ТОО MedCore Group, БИН 250540020756, купить медоборудование Усть-Каменогорск, +7 775 254 03 51, MedCore_Group@mail.ru',
  jsonLd: () => ({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalOrganization', 'LocalBusiness'],
        name: 'ТОО «MedCore Group»',
        alternateName: 'MedCore Group',
        taxID: '250540020756',
        telephone: '+77752540351',
        email: 'MedCore_Group@mail.ru',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'проспект Ауэзова, 14/1',
          addressLocality: 'Усть-Каменогорск',
          addressRegion: 'Восточно-Казахстанская область',
          postalCode: '070004',
          addressCountry: 'KZ',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
        ],
        currenciesAccepted: 'KZT',
        priceRange: '₸₸₸',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: '/' },
          { '@type': 'ListItem', position: 2, name: 'Контакты' },
        ],
      },
    ],
  }),
})

const form = ref({ name: '', phone: '', message: '' })
const sent = ref(false)
const loading = ref(false)

const submit = async (e: Event) => {
  e.preventDefault()
  loading.value = true
  try {
    await api.post('/contacts', {
      name: form.value.name,
      phone: form.value.phone,
      message: form.value.message || undefined,
    })
  } catch {
    // show success regardless — best-effort lead capture
  } finally {
    loading.value = false
  }
  sent.value = true
  form.value = { name: '', phone: '', message: '' }
}
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('contacts.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('contacts.eyebrow')" :level="1">{{ $t('contacts.title') }}</SectionHeading>

      <div class="map" :aria-label="$t('contacts.title')">
        <iframe
          src="https://yandex.ru/map-widget/v1/?text=%D0%A3%D1%81%D1%82%D1%8C-%D0%9A%D0%B0%D0%BC%D0%B5%D0%BD%D0%BE%D0%B3%D0%BE%D1%80%D1%81%D0%BA%2C%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%90%D1%83%D1%8D%D0%B7%D0%BE%D0%B2%D0%B0%2C%2014%2F1&z=17"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          :title="$t('contacts.title')"
        />
      </div>

      <div class="grid">
        <div class="info">
          <div class="card">
            <h4>{{ $t('contacts.legalAddress') }}</h4>
            <p>{{ $t('contacts.addressText') }}</p>
          </div>
          <div class="card">
            <h4>{{ $t('contacts.phone') }}</h4>
            <a href="tel:+77752540351">+7 775 254 03 51</a>
          </div>
          <div class="card">
            <h4>{{ $t('contacts.email') }}</h4>
            <a href="mailto:MedCore_Group@mail.ru">MedCore_Group@mail.ru</a>
          </div>
          <div class="card">
            <h4>{{ $t('contacts.workingHours') }}</h4>
            <p>{{ $t('contacts.workingHoursText') }}<br />{{ $t('contacts.workingWeekend') }}</p>
          </div>
          <div class="card">
            <h4>{{ $t('contacts.requisites') }}</h4>
            <p>{{ $t('contacts.requisitesText') }}</p>
          </div>
        </div>

        <form class="form" @submit="submit">
          <h3>{{ $t('contacts.formTitle') }}</h3>
          <p class="hint">{{ $t('contacts.formHint') }}</p>

          <label>
            <span>{{ $t('contacts.labelName') }}</span>
            <input v-model="form.name" type="text" required :placeholder="$t('contacts.placeholderName')" />
          </label>
          <label>
            <span>{{ $t('contacts.labelPhone') }}</span>
            <input v-model="form.phone" type="tel" required :placeholder="$t('contacts.placeholderPhone')" />
          </label>
          <label>
            <span>{{ $t('contacts.labelMessage') }}</span>
            <textarea v-model="form.message" rows="4" :placeholder="$t('contacts.placeholderMessage')" />
          </label>

          <BaseButton variant="primary" size="lg" :disabled="loading">
            {{ loading ? $t('contacts.submitting') : $t('contacts.submit') }}
          </BaseButton>

          <p v-if="sent" class="success">{{ $t('contacts.successMessage') }}</p>
        </form>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-7);
}

.map {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 7;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--color-border);
  margin-bottom: var(--space-6);
  background: var(--color-surface);
}

.map iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: var(--space-7);
  align-items: start;
}

.info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.info .card {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-4);
  transition: border-color 0.2s;
}

.info .card:hover {
  border-color: var(--color-primary);
}

.info h4 {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
  font-weight: 600;
}

.info p,
.info a {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text);
}

.info a {
  color: var(--color-primary);
}

.form {
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-7);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  box-shadow: var(--shadow);
}

.form h3 {
  font-size: 22px;
}

.hint {
  color: var(--color-text-muted);
  font-size: 14px;
  margin-bottom: var(--space-2);
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-muted);
}

input,
textarea {
  font: inherit;
  font-size: 15px;
  padding: 11px 14px;
  background: #fff;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

.success {
  margin-top: var(--space-2);
  padding: var(--space-3);
  background: var(--color-primary-soft);
  color: var(--color-primary-dark);
  border-radius: var(--radius-sm);
  font-size: 14px;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .info {
    grid-template-columns: 1fr;
  }
}
</style>
