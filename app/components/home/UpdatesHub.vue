<script setup lang="ts">
import type { PublicEventItem, PublicNewsItem } from '../../../shared/types/content'
import { formatIndiaDate } from '~/utils/date'

const props = defineProps<{
  news: PublicNewsItem[]
  events: PublicEventItem[]
}>()

const visibleNews = computed(() => props.news.slice(0, 2))
const visibleEvents = computed(() => props.events.slice(0, 2))
</script>

<template>
  <section class="section updates-section" aria-labelledby="updates-title">
    <div class="container">
      <div class="section-heading-row updates-heading">
        <SectionHeading
          id="updates-title"
          eyebrow="Current activity"
          title="News and upcoming events"
          intro="A concise view of verified announcements and the next dates in the INPA calendar."
        />
        <NuxtLink class="text-link" to="/news">View all updates <span aria-hidden="true">→</span></NuxtLink>
      </div>

      <div class="updates-grid">
        <section class="updates-panel" aria-labelledby="latest-news-title">
          <div class="updates-panel__heading">
            <div>
              <p class="eyebrow">Latest news</p>
              <h3 id="latest-news-title">From the community</h3>
            </div>
            <NuxtLink to="/news" aria-label="View the news archive">View all <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <ul v-if="visibleNews.length" class="updates-list">
            <li v-for="item in visibleNews" :key="item.slug">
              <p class="meta"><span v-if="item.category">{{ item.category }} · </span>{{ formatIndiaDate(item.publishedAt) }} IST</p>
              <h4>{{ item.title }}</h4>
              <p>{{ item.summary }}</p>
              <NuxtLink :to="item.externalUrl ?? `/news/${item.slug}`">Read news <span aria-hidden="true">→</span></NuxtLink>
            </li>
          </ul>
          <PlaceholderNotice v-else message="No verified published news is available. Local development fixtures may be used to demonstrate the layout." />
        </section>

        <section class="updates-panel" aria-labelledby="upcoming-events-title">
          <div class="updates-panel__heading">
            <div>
              <p class="eyebrow">Upcoming events</p>
              <h3 id="upcoming-events-title">Dates to follow</h3>
            </div>
            <NuxtLink to="/events" aria-label="View the events archive">View all <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <ol v-if="visibleEvents.length" class="updates-list updates-list--events">
            <li v-for="item in visibleEvents" :key="item.slug">
              <time :datetime="item.startAt">{{ formatIndiaDate(item.startAt) }}</time>
              <div>
                <p v-if="item.status !== 'published'" class="status-chip">{{ item.status }}</p>
                <h4>{{ item.title }}</h4>
                <p>{{ item.summary }}</p>
                <p class="meta">{{ item.isOnline ? 'Online' : (item.locationName ?? 'Location awaiting confirmation') }} · {{ item.timezone }}</p>
                <NuxtLink :to="item.externalUrl ?? `/events/${item.slug}`">Event details <span aria-hidden="true">→</span></NuxtLink>
              </div>
            </li>
          </ol>
          <PlaceholderNotice v-else message="No verified upcoming events are published. A development-only seed can demonstrate the layout locally." />
        </section>

      </div>
    </div>
  </section>
</template>
