const GOOGLE_ADS_ID = 'AW-18279922208'
const QUOTE_CONVERSION_ID = `${GOOGLE_ADS_ID}/JatICMa9ysccEKD0xYxE`
const WHATSAPP_CONVERSION_ID = `${GOOGLE_ADS_ID}/yKTiCMO9ysccEKD0xYxE`

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function hasGtag() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

export function trackGoogleAdsQuoteConversion() {
  if (!hasGtag()) return

  window.gtag?.('event', 'conversion', {
    send_to: QUOTE_CONVERSION_ID,
    value: 1.0,
    currency: 'USD',
  })
}

export function trackGoogleAdsWhatsAppConversion(url: string) {
  if (typeof window === 'undefined') return

  let navigated = false
  const navigate = () => {
    if (navigated) return
    navigated = true
    window.location.href = url
  }

  if (!hasGtag()) {
    navigate()
    return
  }

  window.gtag?.('event', 'conversion', {
    send_to: WHATSAPP_CONVERSION_ID,
    value: 1.0,
    currency: 'USD',
    event_callback: navigate,
  })

  window.setTimeout(navigate, 1000)
}
