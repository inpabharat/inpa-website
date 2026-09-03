<script setup lang="ts">
import { nuclearHorizonsContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--subtle" aria-labelledby="horizons-title">
    <div class="container publication-feature">
      <div class="publication-cover" role="img" aria-label="Text-only representation of Nuclear Horizons, Volume 1, Issue 2">
        <span>Nuclear Horizons</span>
        <small>{{ nuclearHorizonsContent.descriptor }}<br>Volume 1, Issue 2 · June 2026</small>
      </div>
      <div>
        <p class="eyebrow">Living publication</p>
        <h2 id="horizons-title">{{ nuclearHorizonsContent.title }}</h2>
        <p class="lead">{{ nuclearHorizonsContent.summary }}</p>
        <p><strong>Chief Editor:</strong> {{ nuclearHorizonsContent.chiefEditor }}</p>
        <p class="source-note">Issue records and future approved downloads are kept on the dedicated publication and archive pages.</p>
        <NuxtLink class="text-link" to="/nuclear-horizons">Explore Nuclear Horizons <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
