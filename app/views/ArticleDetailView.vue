<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { marked } from 'marked'
import AppContainer from '@/components/ui/AppContainer.vue'
import Breadcrumbs from '@/components/ui/Breadcrumbs.vue'
import { usePublicationsDataStore } from '@/stores/publicationsData'
import { useMeta } from '@/composables/useMeta'

const route = useRoute()
const store = usePublicationsDataStore()

const article = computed(() =>
  store.items.find(
    (p) => p.type === 'article' && p.slug && p.slug === String(route.params.slug),
  ),
)

const rendered = computed(() => {
  const body = article.value?.body
  return body ? (marked.parse(body) as string) : ''
})

const related = computed(() =>
  store.items
    .filter(
      (p) => p.type === 'article' && p.slug && p.slug !== article.value?.slug,
    )
    .slice(0, 3),
)

const toIso = (date: string) => {
  const m = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : date
}

const keywordsString = (kw: string | string[] | undefined): string => {
  if (!kw) return ''
  return Array.isArray(kw) ? kw.join(', ') : kw
}

useMeta({
  title: () => article.value?.metaTitle ?? article.value?.title ?? 'Статья',
  description: () => article.value?.metaDescription ?? article.value?.excerpt ?? '',
  keywords: () =>
    keywordsString(article.value?.keywords) ||
    (article.value
      ? `${article.value.title}, MedCore Group, медицинское оборудование Казахстан`
      : ''),
  canonical: () => `https://www.medcoregroup.kz${route.path}`,
  ogType: () => 'article',
  ogImage: () => article.value?.ogImage ?? article.value?.image ?? '',
  publishedTime: () =>
    article.value?.publishedAt ?? (article.value ? toIso(article.value.date) : ''),
  modifiedTime: () =>
    article.value?.updatedAt ??
    article.value?.publishedAt ??
    (article.value ? toIso(article.value.date) : ''),
  author: () => article.value?.author ?? 'MedCore Group',
  section: () => article.value?.section ?? 'Блог',
  tags: () => {
    const a = article.value
    if (!a) return []
    if (Array.isArray(a.keywords) && a.keywords.length) return a.keywords
    return a.tags ?? []
  },
  jsonLd: () => {
    if (!article.value) return null
    const a = article.value
    const published = a.publishedAt ?? toIso(a.date)
    const modified = a.updatedAt ?? published
    const kwArr = Array.isArray(a.keywords) ? a.keywords : a.tags ?? []
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: a.metaTitle ?? a.title,
          description: a.metaDescription ?? a.excerpt,
          image: a.ogImage ?? a.image,
          datePublished: published,
          dateModified: modified,
          articleSection: a.section ?? 'Блог',
          keywords: kwArr.join(', '),
          inLanguage: 'ru',
          author: { '@type': 'Organization', name: a.author ?? 'MedCore Group' },
          publisher: {
            '@type': 'Organization',
            name: 'ТОО «MedCore Group»',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.medcoregroup.kz/favicon.svg',
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': 'https://www.medcoregroup.kz' + route.fullPath,
          },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://www.medcoregroup.kz/' },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Новости и публикации',
              item: 'https://www.medcoregroup.kz/news',
            },
            { '@type': 'ListItem', position: 3, name: a.title },
          ],
        },
      ],
    }
  },
})

await useAsyncData('publicationsData', () => store.load())

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found' })
}
</script>

<template>
  <AppContainer v-if="store.loading">
    <div class="loading">{{ $t('article.loading') }}</div>
  </AppContainer>

  <AppContainer v-else-if="article">
    <Breadcrumbs
      :items="[{ label: $t('news.breadcrumb'), to: '/news' }, { label: article.title }]"
    />

    <article class="article">
      <header class="head">
        <time class="date">{{ article.date }}</time>
        <h1>{{ article.title }}</h1>
        <p class="lead">{{ article.excerpt }}</p>
        <div class="meta">
          <span>{{ article.author ?? 'MedCore Group' }}</span>
          <span v-if="article.readTime" aria-hidden="true">·</span>
          <span v-if="article.readTime">~{{ article.readTime }} {{ $t('article.readTime') }}</span>
        </div>
      </header>

      <div class="hero">
        <NuxtImg
          :src="article.image"
          :alt="article.title"
          loading="eager"
          fetchpriority="high"
          format="webp"
          quality="85"
          width="900"
          height="500"
          sizes="100vw md:900px"
        />
      </div>

      <div class="body markdown-body" v-html="rendered" />

      <footer class="back">
        <RouterLink to="/news">{{ $t('article.backToNews') }}</RouterLink>
      </footer>
    </article>

    <section v-if="related.length" class="related">
      <h2>{{ $t('article.readMore') }}</h2>
      <div class="related-grid">
        <RouterLink
          v-for="p in related"
          :key="p.id"
          :to="`/news/${p.slug}`"
          class="card"
        >
          <div class="thumb">
            <NuxtImg :src="p.image" :alt="p.title" loading="lazy" format="webp" quality="75" width="360" height="220" />
          </div>
          <div class="card-body">
            <time>{{ p.date }}</time>
            <h3>{{ p.title }}</h3>
            <p>{{ p.excerpt }}</p>
          </div>
        </RouterLink>
      </div>
    </section>
  </AppContainer>

  <AppContainer v-else>
    <div class="missing">
      <h2>{{ $t('article.notFound') }}</h2>
      <RouterLink to="/news" class="back-link">{{ $t('article.backToList') }}</RouterLink>
    </div>
  </AppContainer>
</template>

<style scoped>
.loading {
  padding: var(--space-9);
  text-align: center;
  color: var(--color-text-muted);
}

.article {
  max-width: 820px;
  margin: 0 auto;
}

.head {
  margin-bottom: var(--space-5);
}

.date {
  display: block;
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

h1 {
  font-size: clamp(26px, 3.5vw, 38px);
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-bottom: var(--space-3);
}

.lead {
  font-size: 18px;
  line-height: 1.55;
  color: var(--color-text-muted);
  margin-bottom: var(--space-4);
}

.meta {
  display: flex;
  gap: var(--space-2);
  font-size: 13px;
  color: var(--color-text-muted);
}

.hero {
  margin-bottom: var(--space-6);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  aspect-ratio: 16 / 8;
}

.hero img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.body {
  font-size: 16px;
  line-height: 1.7;
  color: var(--color-text);
}

.markdown-body :deep(h2) {
  font-size: 24px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 1.8em 0 0.6em;
  color: var(--color-text);
}

.markdown-body :deep(h3) {
  font-size: 19px;
  font-weight: 600;
  margin: 1.4em 0 0.5em;
  color: var(--color-text);
}

.markdown-body :deep(p) {
  margin: 0.9em 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5em;
  margin: 0.8em 0;
}

.markdown-body :deep(li) {
  margin: 0.3em 0;
}

.markdown-body :deep(strong) {
  font-weight: 600;
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
}

.markdown-body :deep(blockquote) {
  border-left: 3px solid var(--color-primary);
  padding-left: 1em;
  color: var(--color-text-muted);
  margin: 1em 0;
}

.back {
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid var(--color-border);
}

.back a {
  color: var(--color-primary);
  font-weight: 500;
}

.related {
  margin-top: var(--space-9);
  padding-top: var(--space-7);
  border-top: 1px solid var(--color-border);
}

.related h2 {
  font-size: 24px;
  margin-bottom: var(--space-5);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg);
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s, transform 0.15s;
}

.card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.thumb {
  aspect-ratio: 16 / 9;
  background: var(--color-surface);
}

.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.card-body time {
  font-size: 12px;
  color: var(--color-text-muted);
}

.card-body h3 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
}

.card-body p {
  font-size: 13px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.missing {
  margin-top: var(--space-9);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.back-link {
  color: var(--color-primary);
  font-weight: 500;
}
</style>
