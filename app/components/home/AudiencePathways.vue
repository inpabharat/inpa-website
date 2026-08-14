<script setup lang="ts">
import { audiencePathways } from '~~/content/site/home'
</script>

<template>
  <section class="audience-section" aria-labelledby="audience-title">
    <div class="container audience-layout">
      <div class="audience-introduction">
        <p class="eyebrow">Start here</p>
        <h2 id="audience-title">What brings you to INPA?</h2>
      </div>
      <nav class="audience-grid" aria-label="Explore INPA by audience">
        <NuxtLink v-for="item in audiencePathways" :key="item.to" :to="item.to">
          <span class="audience-grid__eyebrow">{{ item.eyebrow }}</span>
          <strong>{{ item.title }}</strong>
          <span>{{ item.summary }}</span>
          <span class="audience-grid__action">Explore <span aria-hidden="true">→</span></span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>
