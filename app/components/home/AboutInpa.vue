<script setup lang="ts">
import { aboutContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white about-section" aria-labelledby="about-title">
    <div class="container about-feature">
      <div class="about-feature__introduction">
        <p class="eyebrow">National scientific community</p>
        <h2 id="about-title">{{ aboutContent.title }}</h2>
        <figure class="about-feature__media">
          <img :src="aboutContent.image.src" :alt="aboutContent.image.alt" width="1599" height="1066">
          <figcaption>{{ aboutContent.image.caption }}</figcaption>
        </figure>
      </div>
      <div>
        <p class="lead">{{ aboutContent.summary }}</p>
        <p class="fact-line">{{ aboutContent.registration }}</p>
        <p class="source-note">Source: {{ aboutContent.source }}</p>
        <p class="content-caveat">A formally approved full About statement is still required.</p>
        <NuxtLink class="text-link" :to="aboutContent.to">Learn More <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
