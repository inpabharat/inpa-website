<script setup lang="ts">
import { strategicVision } from '~~/content/site/home'
</script>

<template>
  <section class="nnpi-front" aria-labelledby="nnpi-front-title">
    <div class="container nnpi-front__layout">
      <div class="nnpi-front__identity" aria-hidden="true">
        <span class="nnpi-front__monogram">NNPI</span>
        <span class="nnpi-front__line" />
        <span class="nnpi-front__direction">Vision → coordinated action</span>
      </div>

      <div class="nnpi-front__content">
        <div class="nnpi-front__heading">
          <div>
            <p class="eyebrow eyebrow--light">Developing national framework</p>
            <h2 id="nnpi-front-title">{{ strategicVision.nnpi.title }}</h2>
          </div>
          <span class="nnpi-front__status">Framework in development</span>
        </div>

        <p class="nnpi-front__descriptor">{{ strategicVision.nnpi.descriptor }}</p>
        <p class="nnpi-front__summary">{{ strategicVision.nnpi.summary }}</p>

        <ol class="nnpi-front__pillars" aria-label="NNPI framework elements">
          <li v-for="(pillar, index) in strategicVision.nnpi.pillars" :key="pillar">
            <span aria-hidden="true">0{{ index + 1 }}</span>
            <strong>{{ pillar }}</strong>
          </li>
        </ol>

        <div class="nnpi-front__footer">
          <NuxtLink class="button button--gold" :to="strategicVision.nnpi.to">
            Explore NNPI <span aria-hidden="true">→</span>
          </NuxtLink>
          <p>{{ strategicVision.source }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
