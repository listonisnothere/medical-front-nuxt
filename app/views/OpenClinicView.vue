<script setup lang="ts">
import { computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { useMeta } from '@/composables/useMeta'
import { useUiStore } from '@/stores/ui'

interface Step {
  title: string
  description: string
  serviceSlug?: string
}

interface FaqItem {
  question: string
  answer: string
}

interface PageContent {
  id: string
  slug: string
  title: string
  h1: string
  intro?: string
  steps: Step[]
  faq: FaqItem[]
  isVisible: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
}

const config = useRuntimeConfig()
const ui = useUiStore()

const DEFAULT_PAGE: PageContent = {
  id: '',
  slug: 'open-clinic',
  title: 'Открыть клинику — MedCore Group',
  h1: 'Откройте клинику с MedCore Group',
  intro:
    'Мы помогаем медицинским предпринимателям открывать клиники под ключ — от проектирования до полного оснащения оборудованием ведущих мировых брендов.',
  steps: [
    {
      title: 'Консультация и анализ потребностей',
      description:
        'Обсуждаем профиль клиники, площадь, специализацию и бюджет. Формируем предварительный перечень оборудования.',
    },
    {
      title: 'Подбор оборудования и коммерческое предложение',
      description:
        'Готовим детальное КП с ценами, сроками поставки и техническими характеристиками по каждой позиции.',
    },
    {
      title: 'Поставка и монтаж',
      description:
        'Осуществляем доставку по всему Казахстану, проводим монтаж и пуско-наладочные работы сертифицированными инженерами.',
    },
    {
      title: 'Обучение персонала и сервисная поддержка',
      description:
        'Проводим обучение сотрудников работе с оборудованием и обеспечиваем гарантийное и постгарантийное обслуживание.',
    },
  ],
  faq: [
    {
      question: 'С чего начать открытие клиники?',
      answer:
        'Начните с консультации с нашим специалистом — мы поможем сформировать оптимальный перечень оборудования под ваш профиль и бюджет.',
    },
    {
      question: 'Какие бренды оборудования вы поставляете?',
      answer:
        'Mindray, GE Healthcare, Philips, SonoScape, Draeger, Siemens Healthineers и другие ведущие мировые производители.',
    },
    {
      question: 'Есть ли рассрочка или лизинг?',
      answer:
        'Да, мы работаем с ведущими лизинговыми компаниями Казахстана. Уточните условия у нашего менеджера.',
    },
  ],
  isVisible: true,
  seoTitle: 'Открыть клинику в Казахстане — оснащение под ключ | MedCore Group',
  seoDescription:
    'MedCore Group помогает открыть медицинскую клинику под ключ: подбор оборудования, поставка, монтаж и обучение персонала по всему Казахстану.',
  seoKeywords: 'открыть клинику Казахстан, оснащение клиники, медицинское оборудование под ключ',
}

const { data: page } = await useAsyncData<PageContent>(
  'page-open-clinic',
  () =>
    $fetch<PageContent>(`${config.public.apiBase}/pages/open-clinic`).catch(() => DEFAULT_PAGE),
  { default: () => DEFAULT_PAGE },
)

const BASE = 'https://www.medcoregroup.kz'

const steps = computed(() => (page.value?.steps ?? []) as Step[])
const faqItems = computed(() => (page.value?.faq ?? []) as FaqItem[])

useMeta({
  title: () => page.value?.seoTitle ?? page.value?.h1 ?? 'Открыть клинику',
  description: () => page.value?.seoDescription ?? page.value?.intro ?? '',
  keywords: () => page.value?.seoKeywords ?? '',
  canonical: () => `${BASE}/open-clinic`,
  faqItems: () => faqItems.value,
  jsonLd: () => {
    if (!page.value) return null
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: `${BASE}/` },
            { '@type': 'ListItem', position: 2, name: 'Открыть клинику' },
          ],
        },
        {
          '@type': 'HowTo',
          name: 'Как открыть клинику в Казахстане',
          description: page.value.intro,
          step: steps.value.map((s, i) => ({
            '@type': 'HowToStep',
            position: i + 1,
            name: s.title,
            text: s.description,
          })),
        },
      ],
    }
  },
})
</script>

<template>
  <AppContainer v-if="page">
    <div class="page">
      <Breadcrumbs :items="[{ label: 'Открыть клинику' }]" />

      <header class="hero">
        <div class="hero-badge">Оснащение под ключ</div>
        <SectionHeading :level="1" class="hero-h1">{{ page.h1 }}</SectionHeading>
        <p v-if="page.intro" class="hero-intro">{{ page.intro }}</p>
        <div class="hero-actions">
          <button type="button" class="btn btn--primary" @click="ui.openQuote()">
            Получить расчёт под клинику
          </button>
          <RouterLink to="/catalog" class="btn btn--secondary">Смотреть оборудование</RouterLink>
        </div>
      </header>

      <section v-if="steps.length" class="steps-section">
        <SectionHeading :level="2">Этапы открытия клиники</SectionHeading>
        <ol class="steps-list">
          <li v-for="(step, i) in steps" :key="i" class="step-item">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="step-body">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.description }}</p>
              <RouterLink
                v-if="step.serviceSlug"
                :to="`/services/${step.serviceSlug}`"
                class="service-chip"
              >
                Услуга MedCore →
              </RouterLink>
            </div>
          </li>
        </ol>
      </section>

      <section class="cta-section">
        <div class="cta-card">
          <div class="cta-text">
            <h2 class="cta-title">Готовы оснастить вашу клинику?</h2>
            <p class="cta-sub">Бесплатный расчёт стоимости оснащения — в течение 24 часов</p>
          </div>
          <button type="button" class="btn btn--primary btn--lg" @click="ui.openQuote()">
            Получить коммерческое предложение
          </button>
        </div>
      </section>

      <section v-if="faqItems.length" class="faq-section">
        <SectionHeading :level="2">Часто задаваемые вопросы</SectionHeading>
        <div class="faq-list">
          <details v-for="(item, i) in faqItems" :key="i" class="faq-item">
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

/* Hero */
.hero {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-8) var(--space-7);
  background: var(--color-surface, #f8f7f4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 14px;
  background: #e8f0fd;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 700;
  border-radius: 999px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hero-h1 {
  margin: 0;
}

.hero-intro {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text-muted);
  max-width: 72ch;
  margin: 0;
}

.hero-actions {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-2);
}

/* Buttons */
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

.btn--lg {
  padding: 14px 32px;
  font-size: 15px;
}

/* Steps */
.steps-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  counter-reset: none;
}

.step-item {
  display: flex;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-6);
  background: #fff;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.15s;
}

.step-item:hover {
  border-color: var(--color-primary);
}

.step-number {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.step-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.step-desc {
  font-size: 14px;
  line-height: 1.65;
  color: var(--color-text-muted);
  margin: 0;
}

.service-chip {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 14px;
  background: #f0f4ff;
  color: var(--color-primary);
  font-size: 12px;
  font-weight: 600;
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.15s;
}

.service-chip:hover {
  background: var(--color-primary-soft, #e8f0fd);
}

/* CTA block */
.cta-section {
  display: flex;
  flex-direction: column;
}

.cta-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-6);
  padding: var(--space-7) var(--space-8);
  background: linear-gradient(135deg, #1a3a6b 0%, #0f6bbd 100%);
  border-radius: var(--radius-lg);
  flex-wrap: wrap;
}

.cta-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cta-title {
  font-family: var(--font-display);
  font-size: clamp(18px, 2.5vw, 26px);
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.cta-sub {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.75);
  margin: 0;
}

.cta-card .btn--primary {
  background: #fff;
  color: var(--color-primary);
  flex-shrink: 0;
}

.cta-card .btn--primary:hover {
  filter: brightness(0.95);
}

/* FAQ */
.faq-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-top: 0;
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

@media (max-width: 640px) {
  .hero {
    padding: var(--space-6) var(--space-5);
  }

  .cta-card {
    padding: var(--space-6);
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
