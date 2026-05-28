<script setup lang="ts">
import { ref, computed } from 'vue'
import AppContainer from '@/components/ui/AppContainer.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { usePublicationsDataStore } from '@/stores/publicationsData'
import { useMeta } from '@/composables/useMeta'

useMeta({
  title: () => 'Новости и публикации',
  description: () =>
    'Статьи о медицинском оборудовании, новинки рынка медтехники и публикации о компании MedCore Group в СМИ. Экспертные материалы для специалистов здравоохранения.',
  keywords: () =>
    'новости медицинского оборудования, статьи о медтехнике, медицина Казахстан, MedCore Group блог, обзоры медоборудования',
  jsonLd: () => {
    const articles = store.items.filter((p) => p.type === 'article' && p.slug).slice(0, 10)
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            { '@type': 'ListItem', position: 2, name: 'Новости и публикации' },
          ],
        },
        ...(articles.length ? [{
          '@type': 'ItemList',
          name: 'Статьи о медицинском оборудовании',
          itemListElement: articles.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `https://www.medcoregroup.kz/news/${a.slug}`,
            name: a.title,
          })),
        }] : []),
      ],
    }
  },
})
const store = usePublicationsDataStore()

const tab = ref<'article' | 'media'>('article')
const items = computed(() => store.items.filter((p) => p.type === tab.value))

await useAsyncData('publicationsData', () => store.load())
</script>

<template>
  <AppContainer>
    <div class="page">
      <Breadcrumbs :items="[{ label: $t('news.breadcrumb') }]" />
      <SectionHeading :eyebrow="$t('news.eyebrow')">
        {{ $t('news.title') }}
        <template #sub>{{ $t('news.sub') }}</template>
      </SectionHeading>

      <div class="tabs">
        <button :class="{ active: tab === 'article' }" @click="tab = 'article'">{{ $t('news.tabArticles') }}</button>
        <button :class="{ active: tab === 'media' }" @click="tab = 'media'">{{ $t('news.tabMedia') }}</button>
      </div>

      <div v-if="store.loading" class="loading">{{ $t('news.loading') }}</div>
      <div v-else class="grid">
        <component
          v-for="p in items"
          :is="p.slug ? 'RouterLink' : 'article'"
          :key="p.id"
          :to="p.slug ? `/news/${p.slug}` : undefined"
          class="card"
        >
          <div class="thumb">
            <NuxtImg :src="p.image" :alt="p.title" loading="lazy" format="webp" quality="75" width="360" height="220" />
          </div>
          <div class="body">
            <time class="date">{{ p.date }}</time>
            <h3>{{ p.title }}</h3>
            <p>{{ p.excerpt }}</p>
          </div>
        </component>
      </div>
    </div>
  </AppContainer>
</template>

<style scoped>
.page {
  margin-top: var(--space-7);
}
.loading {
  padding: var(--space-7);
  text-align: center;
  color: var(--color-text-muted);
}
.tabs {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
  border-bottom: 2px solid var(--color-border);
}
.tabs button {
  padding: var(--space-3) var(--space-5);
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-muted);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: color 0.15s, border-color 0.15s;
}
.tabs button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-5);
}
.card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: #fff;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  text-decoration: none;
  color: inherit;
  display: block;
}
a.card {
  cursor: pointer;
}
.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow);
  transform: translateY(-3px);
}
.thumb {
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: var(--color-surface);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.card:hover .thumb img {
  transform: scale(1.04);
}
.body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.date {
  font-size: 11.5px;
  color: var(--color-accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
h3 {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text);
}
p {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
}
</style>
