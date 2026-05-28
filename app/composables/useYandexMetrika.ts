const METRIKA_ID = 109307843
const SRC = `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`

type YmFn = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number }

declare global {
  interface Window {
    ym?: YmFn
  }
}

let loaded = false

export function loadYandexMetrika() {
  if (loaded || typeof window === 'undefined' || typeof document === 'undefined') return
  for (const script of Array.from(document.scripts)) {
    if (script.src === SRC) {
      loaded = true
      return
    }
  }

  const stub: YmFn = function (...args: unknown[]) {
    ;(stub.a = stub.a || []).push(args)
  }
  stub.l = Date.now()
  window.ym = window.ym ?? stub

  const tag = document.createElement('script')
  tag.async = true
  tag.src = SRC
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(tag, first)

  window.ym?.(METRIKA_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  })

  loaded = true
}

export function isYandexMetrikaLoaded() {
  return loaded
}
