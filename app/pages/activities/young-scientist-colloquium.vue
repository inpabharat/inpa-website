<script setup lang="ts">
import { youngScientistColloquium } from '~~/content/site/activities'

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
        <p class="eyebrow eyebrow--light">Scientific programme</p>
        <h1>{{ youngScientistColloquium.title }}</h1>
        <p>{{ youngScientistColloquium.description }}</p>
      </div>
    </section>

    <main class="section section--white">
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
          <strong>Programme record</strong>
          <p>The supplied materials establish this as a recurring INPA activity. A verified date and poster for the next seminar have not yet been supplied.</p>
        </aside>
      </div>

      <div class="container colloquium-archive" aria-labelledby="colloquium-archive-title">
        <p class="eyebrow">Past seminars</p>
        <h2 id="colloquium-archive-title">Programme archive</h2>
        <div class="colloquium-seminars">
          <article v-for="seminar in youngScientistColloquium.seminars" :key="seminar.datetime">
            <p class="eyebrow">{{ seminar.sequence }}</p>
            <time :datetime="seminar.datetime">{{ seminar.date }}</time>
            <h3>{{ seminar.title }}</h3>
            <p><strong>{{ seminar.speaker }}</strong><br>{{ seminar.affiliation }}</p>
            <a class="text-link" :href="seminar.poster" target="_blank">View seminar poster <span aria-hidden="true">↗</span></a>
          </article>
        </div>
        <p class="source-note">{{ youngScientistColloquium.sourceNote }}</p>
      </div>
    </main>
  </div>
</template>
