<script setup lang="ts">
import type { ApiResponse, PublicHomeData } from '../../shared/types/content'

const emptyHome: PublicHomeData = { news: [], events: [], carousel: [] }
const { data: response } = await useFetch<ApiResponse<PublicHomeData>>('/api/public/home')

const home = computed(() => response.value?.data ?? emptyHome)

useSeoMeta({
  title: 'Home',
  description: 'The public-site foundation for the Indian Nuclear Physics Association, advancing nuclear science and connecting researchers.',
  ogTitle: 'Indian Nuclear Physics Association',
  ogDescription: 'Advancing Nuclear Science • Connecting Researchers • Inspiring Future Generations',
  robots: 'index, follow',
})
</script>

<template>
  <div>
    <HomeSiteHero :carousel="home.carousel" />
    <HomePresidentWelcome />
    <HomeLatestNews :items="home.news" />
    <HomeUpcomingEvents :items="home.events" />
    <HomeAboutInpa />
    <HomeFeaturedResearch />
    <HomeNuclearHorizons />
    <HomeStudentResources />
    <HomeInstitutionMap />
    <HomeDistinguishedScientists />
    <HomeMemberHighlights />
    <HomeQuickAccess />
  </div>
</template>
