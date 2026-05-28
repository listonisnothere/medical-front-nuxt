const GA4_ID = 'G-XXXXXXXXXX' // replace with actual Measurement ID from Google Analytics

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let loaded = false

export function loadGA4() {
  if (loaded || typeof window === 'undefined' || typeof document === 'undefined') return
  const SRC = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`
  for (const script of Array.from(document.scripts)) {
    if (script.src.includes(GA4_ID)) {
      loaded = true
      return
    }
  }

  window.dataLayer = window.dataLayer ?? []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer!.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA4_ID, { send_page_view: false })

  const tag = document.createElement('script')
  tag.async = true
  tag.src = SRC
  const first = document.getElementsByTagName('script')[0]
  first?.parentNode?.insertBefore(tag, first)

  loaded = true
}

export function trackGA4PageView(path: string, title: string) {
  window.gtag?.('event', 'page_view', { page_path: path, page_title: title })
}

export function trackGA4Event(name: string, params?: Record<string, unknown>) {
  window.gtag?.('event', name, params)
}
