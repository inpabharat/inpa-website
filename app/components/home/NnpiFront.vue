<script setup lang="ts">
import { strategicVision } from '~~/content/site/home'
</script>

<template>
  <section class="nnpi-front" aria-labelledby="nnpi-front-title">
    <div class="container nnpi-front__layout">
      <div class="nnpi-front__content">
        <p class="eyebrow eyebrow--light">National framework</p>
        <h2 id="nnpi-front-title">{{ strategicVision.nnpi.title }}</h2>
        <p class="nnpi-front__descriptor">{{ strategicVision.nnpi.descriptor }}</p>
      </div>
      <NuxtLink class="button button--gold" :to="strategicVision.nnpi.to">
        Explore NNPI <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>
  </section>
</template>
