const candidatePrivacyHeaders = {
  'Cache-Control': 'private, no-store',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
}

export default defineNuxtConfig({
  compatibilityDate: '2026-07-30',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  css: ['~/assets/css/main.css', '~/assets/css/motion.css'],
  typescript: {
    strict: true,
    typeCheck: false,
  },
  runtimeConfig: {
    cfAccessTeamDomain: '',
    cfAccessAud: '',
    devAuthBypass: false,
    public: {
      siteUrl: 'https://inpa-website.inpa-website.workers.dev',
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en-IN' },
      titleTemplate: '%s · Indian Nuclear Physics Association',
      link: [
        { rel: 'icon', type: 'image/png', href: '/inpa-favicon.png' },
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
        '/about/executive-council',
        '/about/presidents-message',
      ],
    },
  },
  routeRules: {
    '/': {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=60, must-revalidate',
      },
    },
    '/about/**': { prerender: true },
    '/nuclear-horizons': { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } },
    '/nuclear-horizons/**': { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } },
    '/research': { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } },
    '/research/**': { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } },
    '/activities/young-scientist-colloquium': { headers: { 'Cache-Control': 'public, max-age=0, must-revalidate' } },
    '/community': { prerender: true },
    '/membership': { prerender: true },
    '/privacy': { prerender: true },
    '/jobs': { headers: candidatePrivacyHeaders },
    '/jobs/**': { headers: candidatePrivacyHeaders },
    '/api/public/candidates': { headers: candidatePrivacyHeaders },
    '/api/public/candidates/**': { headers: candidatePrivacyHeaders },
    '/api/admin/candidates': { headers: candidatePrivacyHeaders },
    '/api/admin/candidates/**': { headers: candidatePrivacyHeaders },
    '/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/api/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
  },
})
