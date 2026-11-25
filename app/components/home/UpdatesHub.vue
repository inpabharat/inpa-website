<script setup lang="ts">
import type { PublicEventItem, PublicNewsItem } from '../../../shared/types/content'
import { formatEventDate, formatIndiaDate } from '~/utils/date'

const props = defineProps<{
  news: PublicNewsItem[]
  events: PublicEventItem[]
}>()

const visibleNews = computed(() => props.news.slice(0, 2))
const visibleEvents = computed(() => props.events.slice(0, 2))
const hasNews = computed(() => visibleNews.value.length > 0)
const hasEvents = computed(() => visibleEvents.value.length > 0)

// Name only what is actually shown, and never frame an empty list as a panel of its own.
const sectionTitle = computed(() => {
  if (hasNews.value && hasEvents.value) return 'News and upcoming events'
  if (hasNews.value) return 'Latest news'
  if (hasEvents.value) return 'Upcoming events'
  return 'News and events'
})
</script>

<template>
  <section class="section updates-section" aria-labelledby="updates-title">
    <div class="container">
      <div class="section-heading-row updates-heading">
        <SectionHeading
          id="updates-title"
          :title="sectionTitle"
        />
      </div>

      <div v-if="!hasNews && !hasEvents" class="updates-empty">
        <p>No new announcements or upcoming events are listed right now.</p>
        <div class="updates-empty__links">
          <NuxtLink class="text-link" to="/events#past-events-title">Browse past events</NuxtLink>
          <NuxtLink class="text-link" to="/nuclear-horizons">Read Nuclear Horizons</NuxtLink>
        </div>
      </div>

      <div v-else class="updates-grid" :class="{ 'updates-grid--single': !(hasNews && hasEvents) }">
        <section v-if="hasNews" class="updates-panel" :aria-labelledby="hasEvents ? 'latest-news-title' : 'updates-title'">
          <div class="updates-panel__heading">
            <div>
              <h3 v-if="hasEvents" id="latest-news-title">Latest news</h3>
            </div>
            <NuxtLink to="/news" aria-label="View the news archive">View all <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <ul class="updates-list">
            <li v-for="item in visibleNews" :key="item.slug">
              <p class="meta"><span v-if="item.category">{{ item.category }} · </span>{{ formatIndiaDate(item.publishedAt) }} IST</p>
              <h4>{{ item.title }}</h4>
              <p>{{ item.summary }}</p>
              <NuxtLink :to="item.externalUrl ?? `/news/${item.slug}`">Read news <span aria-hidden="true">→</span></NuxtLink>
            </li>
          </ul>
        </section>

        <section v-if="hasEvents" class="updates-panel" :aria-labelledby="hasNews ? 'upcoming-events-title' : 'updates-title'">
          <div class="updates-panel__heading">
            <div>
              <h3 v-if="hasNews" id="upcoming-events-title">Upcoming events</h3>
            </div>
            <NuxtLink to="/events" aria-label="View the events archive">View all <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <ol class="updates-list updates-list--events">
            <li v-for="item in visibleEvents" :key="item.slug">
              <time :datetime="item.startAt">{{ formatEventDate(item.startAt, item.timezone) }}</time>
              <div>
                <p v-if="item.status !== 'published'" class="status-chip">{{ item.status }}</p>
                <h4>{{ item.title }}</h4>
                <p>{{ item.summary }}</p>
                <p class="meta">{{ item.isOnline ? 'Online' : (item.locationName ?? 'Location awaiting confirmation') }} · {{ item.timezone }}</p>
                <NuxtLink :to="`/events/${item.slug}`">Event details <span aria-hidden="true">→</span></NuxtLink>
              </div>
            </li>
          </ol>
        </section>

      </div>
    </div>
  </section>
</template>
