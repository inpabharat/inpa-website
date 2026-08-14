<script setup lang="ts">
import type { PublicEventItem, PublicNewsItem } from '../../../shared/types/content'
import { youngScientistColloquium } from '~~/content/site/activities'
import { formatIndiaDate } from '~/utils/date'

defineProps<{
  news: PublicNewsItem[]
  events: PublicEventItem[]
}>()
</script>

<template>
  <section class="section updates-section" aria-labelledby="updates-title">
    <div class="container">
      <div class="section-heading-row updates-heading">
        <SectionHeading
          id="updates-title"
          eyebrow="News, events and scientific activity"
          title="What’s happening across INPA"
          intro="Published updates appear alongside established programmes documented in material supplied by INPA."
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
          <ul v-if="news.length" class="updates-list">
            <li v-for="item in news" :key="item.slug">
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
          <ol v-if="events.length" class="updates-list updates-list--events">
            <li v-for="item in events" :key="item.slug">
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

        <aside class="opportunity-panel" aria-labelledby="colloquium-title">
          <p class="eyebrow eyebrow--light">Established scientific programme</p>
          <figure class="opportunity-panel__media">
            <img
              src="/images/young-scientist-colloquium-poster.jpg"
              alt="Official poster for the INPA Young Scientist Colloquium Series"
              width="1080"
              height="1350"
              loading="lazy"
            >
            <figcaption>Official programme poster supplied by INPA.</figcaption>
          </figure>
          <div class="opportunity-panel__body">
            <h3 id="colloquium-title">{{ youngScientistColloquium.title }}</h3>
            <p>{{ youngScientistColloquium.description }}</p>
            <p class="opportunity-panel__record"><strong>Programme archive:</strong> two supplied seminar records from June and July 2026 are now available.</p>
            <NuxtLink class="text-link text-link--light" to="/activities/young-scientist-colloquium">Explore the Colloquium <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
