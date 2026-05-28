const BACKEND_ORIGIN = process.env.NUXT_BACKEND_ORIGIN ?? 'http://localhost:3001'

export default defineEventHandler(async () => {
  try {
    const res = await $fetch<{ data?: { id: string | number; updatedAt?: string }[] }>(
      `${BACKEND_ORIGIN}/api/v1/products`,
      { query: { limit: 2000 }, timeout: 10000 },
    )
    const list = (Array.isArray(res) ? res : (res?.data ?? [])) as {
      id: string | number
      updatedAt?: string
    }[]
    return list.map((p) => ({
      loc: `/product/${p.id}`,
      priority: 0.8,
      changefreq: 'weekly' as const,
      ...(p.updatedAt ? { lastmod: p.updatedAt.slice(0, 10) } : {}),
    }))
  } catch {
    return []
  }
})
