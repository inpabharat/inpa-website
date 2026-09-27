<script setup lang="ts">
import type { ApiResponse, PublicHomeData } from '../../shared/types/content'
import { getCanonicalUrl } from '~~/shared/utils/public-seo'
import { heroContent } from '~~/content/site/home'

const emptyHome: PublicHomeData = { news: [], events: [], carousel: [] }
const { data: response } = await useFetch<ApiResponse<PublicHomeData>>('/api/public/home')

const home = computed(() => response.value?.data ?? emptyHome)
const homepage = ref<HTMLElement | null>(null)
useScrollReveal(homepage)
const config = useRuntimeConfig()
const siteUrl = getCanonicalUrl(config.public.siteUrl, '/')!
const socialImageUrl = new URL('/og.png', siteUrl).href

useHead({
  script: [{
    key: 'inpa-organization',
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: heroContent.title,
      alternateName: 'INPA',
      url: siteUrl,
      logo: new URL('/images/inpa-logo.jpg', siteUrl).href,
    }),
  }],
})

useSeoMeta({
  title: 'Home',
  description: 'Indian Nuclear Physics Association — advancing fundamental and applied nuclear science for a self-reliant India.',
  ogTitle: 'Indian Nuclear Physics Association',
  ogDescription: 'Advancing Fundamental and Applied Nuclear Science for a Self-Reliant India',
  ogImage: socialImageUrl,
  ogImageAlt: 'Indian Nuclear Physics Association — advancing fundamental and applied nuclear science for a self-reliant India',
  twitterCard: 'summary_large_image',
  twitterImage: socialImageUrl,
  robots: 'index, follow',
})
</script>

<template>
  <div id="digital-hub" ref="homepage">
    <HomeSiteHero :carousel="home.carousel" />
    <HomeNnpiFront />
    <HomeExploreGateway />
    <HomeInstitutionalSnapshot />
    <HomeUpdatesHub :news="home.news" :events="home.events" />
    <HomeSciencePublications />
    <HomeCommunityHighlights />
  </div>
</template>
