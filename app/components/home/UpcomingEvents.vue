<script setup lang="ts">
import type { PublicEventItem } from '../../../shared/types/content'
import { formatIndiaDate } from '~/utils/date'
import { publicMediaUrl } from '~/utils/media'

defineProps<{ items: PublicEventItem[] }>()
</script>

<template>
  <section class="section section--navy" aria-labelledby="events-title">
    <div class="container">
      <div class="section-heading-row">
        <SectionHeading id="events-title" eyebrow="Upcoming events" title="What’s ahead" intro="Events are ordered chronologically and rendered in the stated event timezone." />
        <NuxtLink class="text-link text-link--light" to="/events">View event archive <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <ol v-if="items.length" class="timeline">
        <li v-for="item in items" :key="item.slug" class="timeline__item">
          <time :datetime="item.startAt">{{ formatIndiaDate(item.startAt) }}</time>
          <div>
            <img v-if="item.coverImageKey" class="timeline__image" :src="publicMediaUrl(item.coverImageKey) ?? undefined" :alt="item.coverImageAlt ?? ''" width="720" height="405" loading="lazy">
            <p v-if="item.status !== 'published'" class="status-chip">{{ item.status }}</p>
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
            <p class="meta meta--light">{{ item.isOnline ? 'Online' : (item.locationName ?? 'Location awaiting confirmation') }} · {{ item.timezone }}</p>
            <NuxtLink class="text-link text-link--light" :to="item.externalUrl ?? `/events/${item.slug}`">Event details <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </li>
      </ol>
      <PlaceholderNotice v-else message="No upcoming events have been published." />
    </div>
  </section>
</template>
