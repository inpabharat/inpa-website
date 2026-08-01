<script setup lang="ts">
import { nuclearHorizonsContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--subtle" aria-labelledby="horizons-title">
    <div class="container publication-feature">
      <div class="publication-cover" role="img" aria-label="Development placeholder for an approved Nuclear Horizons issue cover">
        <span>Nuclear Horizons</span>
        <small>Approved issue cover required</small>
      </div>
      <div>
        <p class="eyebrow">Living publication</p>
        <h2 id="horizons-title">{{ nuclearHorizonsContent.title }}</h2>
        <PlaceholderNotice :message="nuclearHorizonsContent.status" />
        <p class="lead">{{ nuclearHorizonsContent.summary }}</p>
        <ul class="publication-links" aria-label="Nuclear Horizons content slots">
          <li>Editorial — awaiting approved content</li>
          <li>Featured review — awaiting approved content</li>
          <li>Most-read article — hidden until supported by verified analytics</li>
          <li>Submit Manuscript — approved external route required</li>
        </ul>
        <NuxtLink class="text-link" :to="nuclearHorizonsContent.archiveTo">Browse the archive framework <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
