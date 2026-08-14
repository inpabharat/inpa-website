<script setup lang="ts">
import { strategicVision } from '~~/content/site/home'
</script>

<template>
  <section class="section vision-section" aria-labelledby="strategic-vision-title">
    <div class="container">
      <header class="section-heading vision-heading">
        <p class="eyebrow">{{ strategicVision.eyebrow }}</p>
        <h2 id="strategic-vision-title">{{ strategicVision.title }}</h2>
        <p class="section-heading__intro">{{ strategicVision.introduction }}</p>
      </header>

      <div class="vision-flow">
        <div class="vision-flow__verticals">
          <template v-for="item in strategicVision.verticals" :key="item.title">
            <NuxtLink v-if="item.to" class="vision-card" :to="item.to">
              <span class="vision-card__mark" aria-hidden="true">{{ item.mark }}</span>
              <span class="vision-card__status">{{ item.status }}</span>
              <strong>{{ item.title }}</strong>
              <span>{{ item.summary }}</span>
            </NuxtLink>
            <article v-else class="vision-card vision-card--planned">
              <span class="vision-card__mark" aria-hidden="true">{{ item.mark }}</span>
              <span class="vision-card__status">{{ item.status }}</span>
              <strong>{{ item.title }}</strong>
              <span>{{ item.summary }}</span>
            </article>
          </template>
        </div>
        <div class="nnpi-brief">
          <div>
            <p class="eyebrow eyebrow--light">{{ strategicVision.nnpi.descriptor }}</p>
            <h3>{{ strategicVision.nnpi.title }}</h3>
            <p>{{ strategicVision.nnpi.summary }}</p>
            <NuxtLink class="text-link text-link--light" :to="strategicVision.nnpi.to">Explore the developing framework <span aria-hidden="true">→</span></NuxtLink>
          </div>
          <ul aria-label="NNPI framework elements">
            <li v-for="pillar in strategicVision.nnpi.pillars" :key="pillar">{{ pillar }}</li>
          </ul>
        </div>
      </div>
      <p class="source-note vision-source">{{ strategicVision.source }}</p>
    </div>
  </section>
</template>
