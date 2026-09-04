export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: false,
  },
  runtimeConfig: {
    cfAccessTeamDomain: '',
    cfAccessAud: '',
    devAuthBypass: false,
    public: {
      siteUrl: 'http://localhost:3000',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-IN' },
      titleTemplate: '%s · Indian Nuclear Physics Association',
      link: [
        { rel: 'icon', type: 'image/jpeg', href: '/images/inpa-logo.jpg' },
      ],
      meta: [
        { name: 'theme-color', content: '#09243d' },
        { name: 'color-scheme', content: 'light' },
      ],
    },
  },
  nitro: {
    preset: 'cloudflare_module',
    prerender: {
      crawlLinks: false,
      routes: [
        '/about',
        '/about/committees',
        '/about/constitution',
        '/about/executive-council',
        '/about/presidents-message',
        '/nuclear-horizons',
        '/nuclear-horizons/archive',
      ],
    },
  },
  routeRules: {
    '/': {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
      },
    },
    '/about/**': { prerender: true },
    '/nuclear-horizons': { prerender: true },
    '/nuclear-horizons/**': { prerender: true },
    '/membership': { prerender: true },
    '/privacy': { prerender: true },
    '/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/api/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
  },
})
