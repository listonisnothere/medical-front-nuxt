// https://nuxt.com/docs/api/configuration/nuxt-config
const SITE_URL = 'https://www.medcoregroup.kz'
const DESCRIPTION =
  'MedCore Group — поставщик медицинского оборудования: УЗИ, КТ, МРТ, наркозно-дыхательные аппараты, мониторы пациента, оснащение клиник в Казахстане.'

// Backend origin used by Nitro to proxy /uploads and /sitemap.xml in production.
const BACKEND_ORIGIN = process.env.NUXT_BACKEND_ORIGIN ?? 'http://localhost:3001'

// Webmaster verification tokens — set via env, never commit values.
const GSC_VERIFICATION = process.env.NUXT_GSC_VERIFICATION ?? ''
const YANDEX_VERIFICATION = process.env.NUXT_YANDEX_VERIFICATION ?? ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true,

  modules: ['@pinia/nuxt', '@nuxt/image', '@nuxt/fonts', '@nuxtjs/sitemap'],

  image: {
    domains: ['www.medcoregroup.kz'],
    // Backend-proxied uploads come through Nitro as /uploads/**
    // NuxtImg uses the default (ipx) provider for them, no extra config needed.
  },

  site: {
    url: SITE_URL,
    name: 'MedCore Group',
  },

  sitemap: {
    // Disable auto-discovery; all URLs are provided via sources below.
    autoDiscoverSources: false,
    exclude: ['/cart', '/wishlist', '/compare', '/search', '/admin/**'],
    sitemaps: {
      pages: {
        sources: ['/api/_sitemap/pages'],
      },
      products: {
        sources: ['/api/_sitemap/products'],
      },
      news: {
        sources: ['/api/_sitemap/news'],
      },
    },
  },

  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', weights: ['700', '800'], styles: ['normal'] },
      { name: 'DM Sans', provider: 'google', weights: ['400', '500', '600', '700'], styles: ['normal'] },
    ],
    defaults: { preload: true },
  },

  css: ['@/assets/main.css'],

  runtimeConfig: {
    public: {
      // Used by both server (SSR) and browser. Override in prod via NUXT_PUBLIC_API_BASE.
      apiBase: 'http://localhost:3001/api/v1',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      title: 'MedCore Group',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: DESCRIPTION },
        {
          name: 'keywords',
          content:
            'медицинское оборудование, УЗИ аппараты, КТ, МРТ, Mindray, GE Healthcare, наркозные аппараты, мониторы пациента, оснащение клиник, Казахстан, MedCore Group',
        },
        { name: 'author', content: 'ТОО «MedCore Group»' },
        { name: 'geo.region', content: 'KZ-VOS' },
        { name: 'geo.placename', content: 'Усть-Каменогорск, Казахстан' },
        { name: 'geo.position', content: '49.9785;82.6143' },
        { name: 'ICBM', content: '49.9785, 82.6143' },
        { property: 'og:site_name', content: 'MedCore Group' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'MedCore Group' },
        { property: 'og:description', content: DESCRIPTION },
        { property: 'og:url', content: SITE_URL + '/' },
        { property: 'og:image', content: SITE_URL + '/og-default.png' },
        { property: 'og:image:width', content: '1536' },
        { property: 'og:image:height', content: '1024' },
        { property: 'og:image:alt', content: 'MedCore Group' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@MedCoreGroup' },
        { name: 'twitter:title', content: 'MedCore Group' },
        { name: 'twitter:description', content: DESCRIPTION },
        { name: 'twitter:image', content: SITE_URL + '/og-default.png' },
        ...(GSC_VERIFICATION ? [{ name: 'google-site-verification', content: GSC_VERIFICATION }] : []),
        ...(YANDEX_VERIFICATION ? [{ name: 'yandex-verification', content: YANDEX_VERIFICATION }] : []),
        { name: 'theme-color', content: '#1f5fbf' },
        { name: 'msapplication-TileColor', content: '#1f5fbf' },
      ],
      link: [
        { rel: 'canonical', href: SITE_URL + '/' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'alternate icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'preconnect', href: 'https://placehold.co' },
        { rel: 'preconnect', href: 'https://yandex.ru' },
      ],
      script: [
        {
          key: 'google-ads-gtag',
          async: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=AW-18279922208',
        },
        {
          key: 'google-ads-config',
          innerHTML: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18279922208');
`,
        },
        {
          type: 'application/ld+json',
          'data-seo': 'ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['Organization', 'MedicalOrganization', 'LocalBusiness'],
            name: 'ТОО «MedCore Group»',
            alternateName: 'MedCore Group',
            taxID: '250540020756',
            url: SITE_URL,
            logo: { '@type': 'ImageObject', url: SITE_URL + '/og-logo.png' },
            telephone: '+77752540351',
            email: 'MedCore_Group@mail.ru',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Алматы',
              addressRegion: 'Алматы',
              addressCountry: 'KZ',
            },
            geo: { '@type': 'GeoCoordinates', latitude: 43.222, longitude: 76.8512 },
            areaServed: ['KZ', 'RU', 'UZ', 'AE'],
            sameAs: [],
          }),
        },
      ],
    },
  },

  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
        },
      },
      '/uploads/**': { proxy: `${BACKEND_ORIGIN}/uploads/**` },
    },
  },
})
