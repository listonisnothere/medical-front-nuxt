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
  )

  // ── Service landing pages (from local data) ──────────────────────────────
  for (const s of services) {
    urls.push({ loc: `/services/${s.slug}`, priority: 0.7, changefreq: 'monthly' })
  }

  // ── Dynamic pages — try backend, fall back gracefully ───────────────────
  try {
    const [catRes, cityRes, brandRes, pageRes] = await Promise.all([
      $fetch<{ data?: { slug: string }[] }>(`${BACKEND_ORIGIN}/api/v1/categories`, { timeout: 5000 }),
      $fetch<{ slug: string; isVisible: boolean }[]>(`${BACKEND_ORIGIN}/api/v1/cities`, { timeout: 5000 }),
      $fetch<{ slug: string; isVisible: boolean }[]>(`${BACKEND_ORIGIN}/api/v1/brands`, { timeout: 5000 }),
      $fetch<{ slug: string; isVisible: boolean }[]>(`${BACKEND_ORIGIN}/api/v1/pages`, { timeout: 5000 }).catch(() => []),
    ])
    const cats = (Array.isArray(catRes) ? catRes : (catRes?.data ?? [])) as { slug: string }[]
    const cities = (Array.isArray(cityRes) ? cityRes : []) as { slug: string; isVisible: boolean }[]
    const brands = (Array.isArray(brandRes) ? brandRes : []) as { slug: string; isVisible: boolean }[]
    const pages = (Array.isArray(pageRes) ? pageRes : []) as { slug: string; isVisible: boolean }[]
    const visibleCities = cities.filter((c) => c.isVisible)

    for (const cat of cats) {
      if (!cat.slug) continue
      urls.push({ loc: `/catalog/${cat.slug}`, priority: 0.8, changefreq: 'weekly' })
      for (const city of visibleCities) {
        urls.push({ loc: `/catalog/${cat.slug}/${city.slug}`, priority: 0.7, changefreq: 'monthly' })
      }
    }

    for (const brand of brands.filter((b) => b.isVisible)) {
      urls.push({ loc: `/brands/${brand.slug}`, priority: 0.7, changefreq: 'monthly' })
    }

    for (const page of pages.filter((p) => p.isVisible)) {
      urls.push({ loc: `/${page.slug}`, priority: 0.8, changefreq: 'monthly' })
    }
  } catch {
    // Backend unavailable — skip dynamic pages
  }

  return urls
})
