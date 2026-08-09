<script setup lang="ts">
import type { ApiResponse, PublicHomeData } from '../../shared/types/content'

const emptyHome: PublicHomeData = { news: [], events: [], carousel: [] }
const { data: response } = await useFetch<ApiResponse<PublicHomeData>>('/api/public/home')

const home = computed(() => response.value?.data ?? emptyHome)

useSeoMeta({
  title: 'Home',
  description: 'Indian Nuclear Physics Association — advancing fundamental and applied nuclear science for a self-reliant India.',
  ogTitle: 'Indian Nuclear Physics Association',
  ogDescription: 'Advancing Fundamental and Applied Nuclear Science for a Self-Reliant India',
  robots: 'index, follow',
})
</script>

<template>
  <div>
    <HomeSiteHero :carousel="home.carousel" />
    <HomeAudiencePathways />
    <HomeUpdatesHub :news="home.news" :events="home.events" />
    <HomeAboutInpa />
    <HomeFeaturedResearch />
    <HomeNuclearHorizons />
    <HomeStudentResources />
    <HomeInstitutionMap />
    <HomeDistinguishedScientists />
    <HomeMemberHighlights />
    <HomePresidentWelcome />
    <HomeQuickAccess />
  </div>
</template>
