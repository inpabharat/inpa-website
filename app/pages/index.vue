<script setup lang="ts">
import type { ApiResponse, PublicHomeData } from '../../shared/types/content'

const emptyHome: PublicHomeData = { news: [], events: [], carousel: [] }
const { data: response } = await useFetch<ApiResponse<PublicHomeData>>('/api/public/home')

const home = computed(() => response.value?.data ?? emptyHome)
const homepage = ref<HTMLElement | null>(null)
useScrollReveal(homepage)
const requestUrl = useRequestURL()
const socialImageUrl = `${requestUrl.origin}/og.png`

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
