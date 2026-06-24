const BACKEND_ORIGIN = (process.env.NUXT_BACKEND_ORIGIN ?? 'http://localhost:3001').replace(/\/$/, '')
const PAGE_LIMIT = 100

type ProductsResponse =
  | { data?: ProductSitemapItem[]; totalPages?: number }
  | ProductSitemapItem[]

type ProductSitemapItem = {
  id?: string | number
  slug?: string | number
  updatedAt?: string
}

function apiUrl(path: string, query: Record<string, string | number> = {}) {
  const base = BACKEND_ORIGIN.endsWith('/api/v1') ? BACKEND_ORIGIN : `${BACKEND_ORIGIN}/api/v1`
  const url = new URL(`${base}/${path}`)
  for (const [key, value] of Object.entries(query)) url.searchParams.set(key, String(value))
  return url.toString()
}

export default defineEventHandler(async () => {
  try {
    const list: ProductSitemapItem[] = []

    for (let page = 1; page <= 100; page += 1) {
      const res = await $fetch<ProductsResponse>(
        apiUrl('products', { page, limit: PAGE_LIMIT }),
        { timeout: 10000 },
      )
      const batch = Array.isArray(res) ? res : (res?.data ?? [])
      list.push(...batch)

      const totalPages = Array.isArray(res) ? page : (res.totalPages ?? page)
      if (page >= totalPages || batch.length < PAGE_LIMIT) break
    }

    return list
      .filter((p) => p.slug ?? p.id)
      .map((p) => ({
        loc: `/product/${p.slug ?? p.id}`,
        priority: 0.8,
        changefreq: 'weekly' as const,
        ...(p.updatedAt ? { lastmod: p.updatedAt.slice(0, 10) } : {}),
      }))
  } catch {
    return []
  }
})
