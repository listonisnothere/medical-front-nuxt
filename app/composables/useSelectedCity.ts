import { computed, ref } from 'vue'
import { useCitiesDataStore } from '@/stores/citiesData'

const CITY_COOKIE = 'mcg_city'
const CONFIRM_COOKIE = 'mcg_city_confirmed'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

// Transliteration map for CDN geo-header city name → city slug
const TRANSLIT: Record<string, string> = {
  almaty: 'almaty', 'алматы': 'almaty',
  astana: 'astana', 'астана': 'astana', 'nur-sultan': 'astana', 'нур-султан': 'astana',
  shymkent: 'shymkent', 'шымкент': 'shymkent', 'chimkent': 'shymkent',
  aktobe: 'aktobe', 'актобе': 'aktobe', 'aktyubinsk': 'aktobe',
  oskemen: 'oskemen', 'усть-каменогорск': 'oskemen', 'ust-kamenogorsk': 'oskemen',
  taraz: 'taraz', 'тараз': 'taraz', 'zhambyl': 'taraz',
  semej: 'semej', 'семей': 'semej', 'semipalatinsk': 'semej',
  pavlodar: 'pavlodar', 'павлодар': 'pavlodar',
  uralsk: 'uralsk', 'уральск': 'uralsk', 'oral': 'uralsk',
  aktau: 'aktau', 'актау': 'aktau', 'shevchenko': 'aktau',
  kyzylorda: 'kyzylorda', 'кызылорда': 'kyzylorda',
  petropavlovsk: 'petropavlovsk', 'петропавловск': 'petropavlovsk',
}

function normalizeGeoCity(raw: string): string | null {
  const lower = raw.trim().toLowerCase()
  return TRANSLIT[lower] ?? null
}

export function useSelectedCity() {
  const citiesStore = useCitiesDataStore()
  const cityCookie = useCookie(CITY_COOKIE, { maxAge: COOKIE_MAX_AGE, sameSite: 'lax' as const })
  const confirmCookie = useCookie(CONFIRM_COOKIE, { maxAge: COOKIE_MAX_AGE, sameSite: 'lax' as const })
  const route = useRoute()
  const router = useRouter()

  // Detect geo from CDN headers (SSR only)
  const geoDetectedSlug = ref<string | null>(null)
  if (import.meta.server) {
    const headers = useRequestHeaders(['cf-ipcity', 'x-vercel-ip-city', 'x-real-city'])
    const rawCity = headers['cf-ipcity'] ?? headers['x-vercel-ip-city'] ?? headers['x-real-city'] ?? ''
    if (rawCity) {
      geoDetectedSlug.value = normalizeGeoCity(rawCity)
    }
  }

  const isAutoDetected = computed(
    () => !!geoDetectedSlug.value && !cityCookie.value && !confirmCookie.value,
  )

  const selectedCitySlug = computed<string>(() => {
    if (cityCookie.value) return cityCookie.value
    if (geoDetectedSlug.value) return geoDetectedSlug.value
    return citiesStore.items.find((c) => c.isDefault)?.slug ?? 'almaty'
  })

  const selectedCity = computed(
    () => citiesStore.items.find((c) => c.slug === selectedCitySlug.value && c.isVisible) ?? null,
  )

  function setSelectedCity(slug: string, opts?: { silent?: boolean }) {
    cityCookie.value = slug
    confirmCookie.value = '1'

    if (opts?.silent) return

    const cat = route.params.category as string | undefined
    if (cat) {
      // On catalog pages — navigate to city variant
      router.push(`/catalog/${cat}/${slug}`)
    }
  }

  function dismissGeoBar() {
    confirmCookie.value = '1'
  }

  return {
    selectedCitySlug,
    selectedCity,
    setSelectedCity,
    isAutoDetected,
    geoDetectedSlug,
    dismissGeoBar,
  }
}
