<script setup lang="ts">
import type { ApiResponse, PublicEventItem } from '../../../shared/types/content'

const { data: response } = await useFetch<ApiResponse<PublicEventItem[]>>('/api/public/events')
const items = computed(() => response.value?.data ?? [])

useSeoMeta({
  title: 'Events',
  description: 'Published upcoming events from the Indian Nuclear Physics Association.',
  robots: () => items.value.length > 0 ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <p class="eyebrow eyebrow--light">Events archive</p>
        <h1>Events</h1>
        <p>Upcoming notices are chronological; past verified records will remain available through the archive.</p>
      </div>
    </section>
    <HomeUpcomingEvents :items="items" />
  </div>
</template>
