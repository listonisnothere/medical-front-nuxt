import { computed } from 'vue'
import { useHead, useRoute } from '#imports'

const SITE_NAME = 'MedCore Group'
const SUFFIX = ` | ${SITE_NAME}`
const BASE_URL = 'https://www.medcoregroup.kz'
const DEFAULT_LOCALE = 'ru_RU'
const DEFAULT_TWITTER_CARD = 'summary_large_image'
const DEFAULT_OG_IMAGE_WIDTH = '1536'
const DEFAULT_OG_IMAGE_HEIGHT = '1024'
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`

// ── Utility exports ────────────────────────────────────────────────────────

export function buildProductTitle(brand: string, name: string, category: string): string {
  return `${brand} ${name} — купить в Казахстане | ${category}`
}

export function buildProductDescription(opts: {
  name: string
  brand: string
  shortDescription?: string | null
  highlights?: string[]
}): string {
  if (opts.shortDescription) return opts.shortDescription
  const cta = 'Сертификат РК, доставка по Казахстану, гарантия. Запросите КП!'
  const base = `${opts.brand} ${opts.name} — купить в Казахстане. ${cta}`
  if (opts.highlights?.length) {
    return `${opts.brand} ${opts.name}: ${opts.highlights[0]}. ${cta}`.slice(0, 160)
  }
  return base.slice(0, 160)
}

// ── Types ──────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string
  answer: string
}

export interface MetaOptions {
  title: () => string
  description?: () => string
  keywords?: () => string
  canonical?: () => string
  ogImage?: () => string
  ogImageWidth?: () => string
  ogImageHeight?: () => string
  ogType?: () => string
  locale?: () => string
  twitterCard?: () => string
  publishedTime?: () => string
  modifiedTime?: () => string
  author?: () => string
  section?: () => string
  tags?: () => string[]
  noindex?: boolean
  jsonLd?: () => Record<string, unknown> | null
  faqItems?: () => FaqItem[]
  localeUrls?: () => { ru?: string; kk?: string; en?: string }
}

type MetaTag = Record<string, string>
type LinkTag = Record<string, string>
type ScriptTag = Record<string, string>

// ── Composable ─────────────────────────────────────────────────────────────

export function useMeta(options: MetaOptions) {
  const route = useRoute()

  const head = computed(() => {
    const rawTitle = options.title()
    const fullTitle = rawTitle ? `${rawTitle}${SUFFIX}` : SITE_NAME
    const url = options.canonical?.() ?? BASE_URL + route.path
    const ogType = options.ogType?.() ?? 'website'
    const ogImage = options.ogImage?.() || DEFAULT_OG_IMAGE
    const ogImageWidth = options.ogImageWidth?.() ?? DEFAULT_OG_IMAGE_WIDTH
    const ogImageHeight = options.ogImageHeight?.() ?? DEFAULT_OG_IMAGE_HEIGHT
    const locale = options.locale?.() ?? DEFAULT_LOCALE
    const twitterCard = options.twitterCard?.() ?? DEFAULT_TWITTER_CARD
    const description = options.description?.() ?? ''
    const keywords = options.keywords?.() ?? ''

    const meta: MetaTag[] = []

    if (description) {
      meta.push({ name: 'description', content: description })
      meta.push({ property: 'og:description', content: description })
      meta.push({ name: 'twitter:description', content: description })
    }
    if (keywords) meta.push({ name: 'keywords', content: keywords })

    meta.push({ property: 'og:site_name', content: SITE_NAME })
    meta.push({ property: 'og:locale', content: locale })
    meta.push({ property: 'og:title', content: fullTitle })
    meta.push({ property: 'og:type', content: ogType })
    meta.push({ property: 'og:url', content: url })
    meta.push({ property: 'og:image', content: ogImage })
    meta.push({ property: 'og:image:alt', content: fullTitle })
    meta.push({ property: 'og:image:width', content: ogImageWidth })
    meta.push({ property: 'og:image:height', content: ogImageHeight })

    meta.push({ name: 'twitter:card', content: twitterCard })
    meta.push({ name: 'twitter:title', content: fullTitle })
    meta.push({ name: 'twitter:image', content: ogImage })
    meta.push({ name: 'twitter:image:alt', content: fullTitle })

    meta.push({ name: 'robots', content: options.noindex ? 'noindex,nofollow' : 'index,follow' })

    if (ogType === 'article') {
      const publishedTime = options.publishedTime?.()
      const modifiedTime = options.modifiedTime?.()
      const author = options.author?.()
      const section = options.section?.()
      const tags = options.tags?.() ?? []
      if (publishedTime) meta.push({ property: 'article:published_time', content: publishedTime })
      if (modifiedTime) meta.push({ property: 'article:modified_time', content: modifiedTime })
      if (author) meta.push({ property: 'article:author', content: author })
      if (section) meta.push({ property: 'article:section', content: section })
      tags.forEach((tag, i) =>
        meta.push({ key: `article:tag:${i}`, property: 'article:tag', content: tag }),
      )
    }

    const link: LinkTag[] = [{ rel: 'canonical', href: url }]

    if (options.localeUrls) {
      const urls = options.localeUrls()
      const entries: Array<{ lang: string; href: string }> = []
      if (urls.ru) entries.push({ lang: 'ru', href: urls.ru })
      if (urls.kk) entries.push({ lang: 'kk', href: urls.kk })
      if (urls.en) entries.push({ lang: 'en', href: urls.en })
      if (entries.length) {
        entries.push({ lang: 'x-default', href: urls.ru ?? urls.kk ?? urls.en! })
        for (const { lang, href } of entries) {
          link.push({ key: `hreflang-${lang}`, rel: 'alternate', hreflang: lang, href })
        }
      }
    }

    const script: ScriptTag[] = []

    if (options.jsonLd) {
      const data = options.jsonLd()
      if (data) {
        script.push({
          key: 'page-ld-json',
          type: 'application/ld+json',
          innerHTML: JSON.stringify(data),
        })
      }
    }

    if (options.faqItems) {
      const items = options.faqItems()
      if (items.length) {
        script.push({
          key: 'faq-ld-json',
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: items.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }),
        })
      }
    }

    return { title: fullTitle, meta, link, script }
  })

  useHead(head)
}
