// Loads the synstudio chat widget only after the browser is idle (or on first
// user interaction), so it never blocks LCP or TTI on the initial page load.
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined') return

  function loadWidget() {
    if ((window as any).__synstudioLoaded) return
    ;(window as any).__synstudioLoaded = true
    ;(window as any).convergoConfig = {
      botId: 'ce62fbca-0994-45b0-8fe6-5a2807ee0d65',
      botName: 'MedCoreGroup Ассистент',
      welcomeMessage: 'Здравствуйте, как я могу вам помочь?',
      themeColor: '#3b82f6',
      apiUrl: 'https://api.synstudio.kz/api/v1/',
    }
    const s = document.createElement('script')
    s.src = 'https://synstudio.kz/widget.js'
    s.async = true
    document.body.appendChild(s)
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadWidget, { timeout: 4000 })
  } else {
    // Safari fallback: load after first interaction
    const events = ['mousemove', 'touchstart', 'keydown', 'scroll'] as const
    function onInteraction() {
      loadWidget()
      events.forEach((e) => window.removeEventListener(e, onInteraction))
    }
    events.forEach((e) => window.addEventListener(e, onInteraction, { passive: true }))
    // Hard fallback after 5 s in case user doesn't interact at all
    setTimeout(loadWidget, 5000)
  }
})
