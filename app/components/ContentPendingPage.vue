<script setup lang="ts">
import type { PendingRouteContent } from '~~/content/site/routes'

defineProps<{ content: PendingRouteContent }>()
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">{{ content.eyebrow }}</p>
        <h1>{{ content.title }}</h1>
        <p>{{ content.description }}</p>
      </div>
    </section>
    <section class="section">
      <div class="container container--reading">
        <PlaceholderNotice :message="content.requiredContent" />
        <h2>Content readiness</h2>
        <p>This route is intentionally available as a clearly labelled foundation. It contains no invented institutional or scientific facts.</p>
        <NuxtLink class="text-link" to="/">Return to the homepage <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </div>
</template>
