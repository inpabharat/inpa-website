<script setup lang="ts">
import { aboutContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white" aria-labelledby="about-title">
    <div class="container editorial-band">
      <div>
        <p class="eyebrow">National scientific community</p>
        <h2 id="about-title">{{ aboutContent.title }}</h2>
      </div>
      <div>
        <PlaceholderNotice :message="aboutContent.status" />
        <p class="lead">{{ aboutContent.summary }}</p>
        <p class="fact-line">{{ aboutContent.registration }}</p>
        <p class="source-note">Source: {{ aboutContent.source }}</p>
        <NuxtLink class="text-link" :to="aboutContent.to">Learn More <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
