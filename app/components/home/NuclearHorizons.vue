<script setup lang="ts">
import { nuclearHorizonsContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--subtle" aria-labelledby="horizons-title">
    <div class="container publication-feature">
      <div class="publication-cover" role="img" aria-label="Text-only representation of Nuclear Horizons; the published cover is withheld pending web permission">
        <span>Nuclear Horizons</span>
        <small>{{ nuclearHorizonsContent.descriptor }}<br>Volume 1, Issue 2 · June 2026</small>
      </div>
      <div>
        <p class="eyebrow">Living publication</p>
        <h2 id="horizons-title">{{ nuclearHorizonsContent.title }}</h2>
        <PlaceholderNotice :message="nuclearHorizonsContent.status" />
        <p class="lead">{{ nuclearHorizonsContent.summary }}</p>
        <p><strong>Chief Editor:</strong> {{ nuclearHorizonsContent.chiefEditor }}</p>
        <ul class="publication-links" aria-label="Published Nuclear Horizons issues">
          <li v-for="issue in nuclearHorizonsContent.issues" :key="issue.label"><strong>{{ issue.label }}</strong> — {{ issue.date }}</li>
        </ul>
        <p class="source-note">Download links will be added only after INPA confirms web-distribution permission for the supplied PDFs.</p>
        <NuxtLink class="text-link" :to="nuclearHorizonsContent.archiveTo">View issue metadata <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
