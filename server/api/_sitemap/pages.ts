import { services } from '../../../app/data/services'

const BACKEND_ORIGIN = process.env.NUXT_BACKEND_ORIGIN ?? 'http://localhost:3001'

export default defineEventHandler(async () => {
  const urls: { loc: string; changefreq?: string; priority?: number; lastmod?: string }[] = []

  // ── Static pages ────────────────────────────────────────────────────────
  urls.push(
    { loc: '/', priority: 1.0, changefreq: 'weekly' },
    { loc: '/catalog', priority: 0.9, changefreq: 'daily' },
    { loc: '/news', priority: 0.7, changefreq: 'daily' },
    { loc: '/services', priority: 0.8, changefreq: 'monthly' },
    { loc: '/brands', priority: 0.7, changefreq: 'monthly' },
    { loc: '/about', priority: 0.6, changefreq: 'monthly' },
    { loc: '/contacts', priority: 0.6, changefreq: 'monthly' },
    { loc: '/in-stock', priority: 0.8, changefreq: 'daily' },
    { loc: '/open-clinic', priority: 0.7, changefreq: 'monthly' },
  )

  // ── Service landing pages (from local data) ──────────────────────────────
  for (const s of services) {
    urls.push({ loc: `/services/${s.slug}`, priority: 0.7, changefreq: 'monthly' })
  }

  // ── Dynamic pages — try backend, fall back gracefully ───────────────────
  try {
    const [catRes, pageRes] = await Promise.all([
      $fetch<{ data?: { slug: string }[] }>(`${BACKEND_ORIGIN}/api/v1/categories`, { timeout: 5000 }),
      $fetch<{ slug: string; isVisible: boolean }[]>(`${BACKEND_ORIGIN}/api/v1/pages`, { timeout: 5000 }).catch(() => []),
    ])
    const cats = (Array.isArray(catRes) ? catRes : (catRes?.data ?? [])) as { slug: string }[]
    const pages = (Array.isArray(pageRes) ? pageRes : []) as { slug: string; isVisible: boolean }[]
    const excludedPageSlugs = new Set(['privacy', 'cart', 'wishlist', 'compare', 'search'])
    const existingLocs = new Set(urls.map((url) => url.loc))

    for (const cat of cats) {
      if (!cat.slug) continue
      const loc = `/catalog/${cat.slug.toLowerCase()}`
      if (!existingLocs.has(loc)) {
        urls.push({ loc, priority: 0.8, changefreq: 'weekly' })
        existingLocs.add(loc)
      }
    }

    for (const page of pages.filter((p) => p.isVisible)) {
      if (!page.slug || excludedPageSlugs.has(page.slug)) continue
      const loc = `/${page.slug}`
      if (existingLocs.has(loc)) continue
      urls.push({ loc, priority: 0.8, changefreq: 'monthly' })
      existingLocs.add(loc)
    }
  } catch {
    // Backend unavailable — skip dynamic pages
  }

  return urls
})
