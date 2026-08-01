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
    },
  },
  routeRules: {
    '/': {
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
      },
    },
    '/about/**': { prerender: true },
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
