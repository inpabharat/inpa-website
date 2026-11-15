<script setup lang="ts">
import { youngScientistColloquium } from '~~/content/site/activities'
import type { ApiResponse, PublicColloquiumProgramme } from '~~/shared/types/content'
import { formatEventDate } from '~/utils/date'

const { data: response, error } = await useFetch<ApiResponse<PublicColloquiumProgramme>>('/api/public/colloquium')
const sections = computed(() => [
  { id: 'colloquium-upcoming-title', title: 'Upcoming seminars', seminars: response.value?.data.upcoming ?? [] },
  { id: 'colloquium-archive-title', title: 'Programme archive', seminars: response.value?.data.archive ?? [] },
].filter(section => section.seminars.length))

useSeoMeta({
  title: youngScientistColloquium.title,
  description: youngScientistColloquium.description,
  robots: 'index, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <h1>{{ youngScientistColloquium.title }}</h1>
        <p>{{ youngScientistColloquium.description }}</p>
      </div>
    </section>

    <div class="section section--white">
      <div class="container colloquium-layout">
        <section aria-labelledby="colloquium-participate-title">
          <p class="eyebrow">Participate</p>
          <h2 id="colloquium-participate-title">A platform for early-career science</h2>
          <p class="lead">{{ youngScientistColloquium.callToAction }}</p>
          <p><strong>Coordinator:</strong> {{ youngScientistColloquium.coordinator }}<br><strong>Joint coordinator:</strong> {{ youngScientistColloquium.jointCoordinator }}</p>
          <div class="colloquium-actions">
            <a class="button button--navy" :href="youngScientistColloquium.speakerForm" target="_blank" rel="noopener noreferrer">Submit speaker interest <span aria-hidden="true">↗</span></a>
            <a class="button button--outline-navy" :href="youngScientistColloquium.programmePoster" target="_blank">View programme poster <span aria-hidden="true">↗</span></a>
          </div>
          <p class="source-note">Contact: <a :href="`mailto:${youngScientistColloquium.email}`">{{ youngScientistColloquium.email }}</a></p>
        </section>

        <aside class="colloquium-note" aria-label="Programme status">
          <strong>Seminar schedule</strong>
          <p v-if="error">The seminar schedule is temporarily unavailable.</p>
          <p v-else-if="response?.data.upcoming.length">Upcoming seminars and past records are listed below.</p>
          <p v-else>No upcoming seminar has been announced.</p>
        </aside>
      </div>

      <section v-for="section in sections" :key="section.id" class="container colloquium-archive" :aria-labelledby="section.id">
        <h2 :id="section.id">{{ section.title }}</h2>
        <div class="colloquium-seminars">
          <article v-for="seminar in section.seminars" :key="seminar.slug">
            <p v-if="seminar.seminarLabel" class="eyebrow">{{ seminar.seminarLabel }}</p>
            <p v-if="seminar.status === 'postponed' || seminar.status === 'cancelled'" class="status-chip">{{ seminar.status }}</p>
            <time :datetime="seminar.startAt">{{ formatEventDate(seminar.startAt, seminar.timezone) }} {{ seminar.timezone === 'Asia/Kolkata' ? 'IST' : seminar.timezone }}</time>
            <h3>{{ seminar.title }}</h3>
            <p v-if="seminar.speaker || seminar.speakerAffiliation">
              <strong v-if="seminar.speaker">{{ seminar.speaker }}</strong><br v-if="seminar.speaker && seminar.speakerAffiliation">{{ seminar.speakerAffiliation }}
            </p>
            <div class="colloquium-actions">
              <NuxtLink v-if="response?.meta.source === 'd1'" class="text-link" :to="`/events/${seminar.slug}`">Event details <span aria-hidden="true">→</span></NuxtLink>
              <a v-if="seminar.posterPdfKey" class="text-link" :href="publicMediaUrl(seminar.posterPdfKey) ?? undefined" target="_blank" rel="noopener noreferrer">View seminar PDF <span aria-hidden="true">↗</span></a>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>
