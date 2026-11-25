<script setup lang="ts">
import { formatEventDate } from '~/utils/date'
interface EventDetail {
  slug: string
  title: string
  summary: string
  body: string
  status: string
  startAt: string
  timezone: string
  externalUrl: string | null
  speaker: string | null
  speakerAffiliation: string | null
  posterPdfKey: string | null
  coverImageKey: string | null
  coverImageAlt: string | null
}

const route = useRoute()
const { data: response } = await useFetch<{ data: EventDetail | null, meta: { source: string } }>(`/api/public/events/${route.params.slug}`)
const item = computed(() => response.value?.data ?? null)

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Event not found' })
}

useSeoMeta({
  title: () => item.value?.title ?? 'Event unavailable',
  description: () => item.value?.summary ?? 'This event is not currently available.',
  robots: () => item.value ? 'index, follow' : 'noindex, nofollow',
})
</script>

<template>
  <article>
    <section class="page-hero">
      <div class="container container--reading">
        <h1>{{ item?.title ?? 'Event unavailable' }}</h1>
        <p v-if="item" class="page-hero__meta">
          <span v-if="item.status !== 'published'" class="page-hero__status">{{ item.status }} · </span><time :datetime="item.startAt">{{ formatEventDate(item.startAt, item.timezone) }}</time>
        </p>
        <p>{{ item?.summary ?? 'No verified published record was found for this route.' }}</p>
      </div>
    </section>
    <section class="section">
      <div class="container container--reading prose">
        <template v-if="item">
          <img v-if="item.coverImageKey" class="detail-cover" :src="publicMediaUrl(item.coverImageKey) ?? undefined" :alt="item.coverImageAlt ?? ''" width="960" height="540">
          <p><strong>When:</strong> <time :datetime="item.startAt">{{ formatEventDate(item.startAt, item.timezone) }}</time></p>
          <p><strong>Event timezone:</strong> {{ item.timezone }}</p>
          <p v-if="item.speaker || item.speakerAffiliation"><strong>Speaker:</strong> {{ [item.speaker, item.speakerAffiliation].filter(Boolean).join(' · ') }}</p>
          <p>{{ item.body }}</p>
          <p v-if="item.posterPdfKey"><a class="text-link" :href="publicMediaUrl(item.posterPdfKey) ?? undefined" target="_blank" rel="noopener noreferrer">View seminar PDF <span aria-hidden="true">↗</span></a></p>
          <p v-if="item.externalUrl"><NuxtLink class="text-link" :to="item.externalUrl">External event link <span aria-hidden="true">→</span></NuxtLink></p>
        </template>
        <NuxtLink class="text-link" to="/events">Return to events <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </article>
</template>
