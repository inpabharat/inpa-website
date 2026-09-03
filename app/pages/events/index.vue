<script setup lang="ts">
import type { ApiResponse, PublicEventItem } from '../../../shared/types/content'
import { formatIndiaDate } from '~/utils/date'

const { data: response } = await useFetch<ApiResponse<PublicEventItem[]>>('/api/public/events')
const items = computed(() => response.value?.data ?? [])
const { data: archiveResponse } = await useFetch<ApiResponse<PublicEventItem[]>>('/api/public/events/archive')
const archivedItems = computed(() => archiveResponse.value?.data ?? [])

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
    <section class="section section--subtle" aria-labelledby="past-events-title">
      <div class="container">
        <SectionHeading id="past-events-title" eyebrow="Archive" title="Past events" intro="Verified past events remain available for the scientific record." />
        <ol v-if="archivedItems.length" class="timeline timeline--light">
          <li v-for="item in archivedItems" :key="item.slug" class="timeline__item">
            <time :datetime="item.startAt">{{ formatIndiaDate(item.startAt) }}</time>
            <div><p v-if="item.status !== 'published'" class="status-chip">{{ item.status }}</p><h3>{{ item.title }}</h3><p>{{ item.summary }}</p><NuxtLink class="text-link" :to="item.externalUrl ?? `/events/${item.slug}`">Event record <span aria-hidden="true">→</span></NuxtLink></div>
          </li>
        </ol>
        <PlaceholderNotice v-else message="No past event records have been published." />
      </div>
    </section>
  </div>
</template>
