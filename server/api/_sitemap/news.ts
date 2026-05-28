import { publications as fallback } from '../../../app/data/publications'

const BACKEND_ORIGIN = process.env.NUXT_BACKEND_ORIGIN ?? 'http://localhost:3001'

export default defineEventHandler(async () => {
  let list: { slug?: string; date?: string; updatedAt?: string }[] = []

  try {
    const res = await $fetch<{ data?: typeof list }>(
      `${BACKEND_ORIGIN}/api/v1/publications`,
      { query: { limit: 1000 }, timeout: 5000 },
    )
    const fetched = Array.isArray(res) ? res : (res?.data ?? [])
    // If backend items lack slugs (not yet implemented), fall back to local data
    const withSlugs = fetched.filter((p) => p.slug)
    list = withSlugs.length ? withSlugs : fallback
  } catch {
    list = fallback
  }

  return list
    .filter((p) => p.slug)
    .map((p) => ({
      loc: `/news/${p.slug}`,
      priority: 0.6,
      changefreq: 'monthly' as const,
      ...(p.updatedAt
        ? { lastmod: p.updatedAt.slice(0, 10) }
        : p.date
          ? { lastmod: isoDate(p.date) }
          : {}),
    }))
})

function isoDate(d: string): string {
  const [day, month, year] = d.split('.')
  if (!day || !month || !year) return d
  return `${year}-${month}-${day}`
}
