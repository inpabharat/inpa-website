<script setup lang="ts">
import { nuclearHorizonsContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--subtle" aria-labelledby="horizons-title">
    <div class="container publication-feature">
      <img
        class="publication-cover-image"
        src="/images/publications/nuclear-horizons-volume-1-issue-2.jpg"
        alt="Cover of Nuclear Horizons, Volume 1, Issue 2, June 2026"
        width="992"
        height="1403"
      >
      <div>
        <p class="eyebrow">Living publication</p>
        <h2 id="horizons-title">{{ nuclearHorizonsContent.title }}</h2>
        <p class="lead">{{ nuclearHorizonsContent.summary }}</p>
        <p><strong>Chief Editor:</strong> {{ nuclearHorizonsContent.chiefEditor }}</p>
        <p class="source-note">The January and June 2026 issues are available in the publication archive.</p>
        <div class="science-publications__actions">
          <a class="button button--navy" href="/publications/nuclear-horizons-volume-1-issue-2.pdf" download>Download latest issue</a>
          <NuxtLink class="text-link" to="/nuclear-horizons">Explore Nuclear Horizons <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
