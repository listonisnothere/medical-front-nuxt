export default defineNuxtRouteMiddleware((to) => {
  const cityParam = to.params.city
  if (!cityParam) return
  const raw = String(cityParam)
  const lower = raw.toLowerCase()
  if (lower !== raw) {
    return navigateTo(
      { path: to.path.replace(`/${raw}`, `/${lower}`), query: to.query },
      { redirectCode: 301 },
    )
  }
})
