<script setup lang="ts">
import { strategicVision } from '~~/content/site/home'
</script>

<template>
  <section class="nnpi-front" aria-labelledby="nnpi-front-title">
    <div class="container nnpi-front__layout">
      <div class="nnpi-front__identity" aria-hidden="true">
        <span class="nnpi-front__monogram">NNPI</span>
      </div>

      <div class="nnpi-front__content">
        <div class="nnpi-front__heading">
          <div>
            <p class="eyebrow eyebrow--light">National framework</p>
            <h2 id="nnpi-front-title">{{ strategicVision.nnpi.title }}</h2>
          </div>
        </div>

        <p class="nnpi-front__descriptor">{{ strategicVision.nnpi.descriptor }}</p>
        <p class="nnpi-front__summary">{{ strategicVision.nnpi.summary }}</p>

        <ol class="nnpi-front__pillars" aria-label="NNPI pathway from science to action">
          <li v-for="pillar in strategicVision.nnpi.pillars" :key="pillar">
            <strong>{{ pillar }}</strong>
          </li>
        </ol>

        <div class="nnpi-front__footer">
          <NuxtLink class="button button--gold" :to="strategicVision.nnpi.to">
            Explore NNPI <span aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
