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
        <div v-for="section in content.sections" :key="section.heading" class="route-section">
          <h2>{{ section.heading }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <ul v-if="section.items">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </div>
        <p v-if="content.sourceNote" class="source-note">{{ content.sourceNote }}</p>
        <PlaceholderNotice :message="content.requiredContent" />
        <NuxtLink class="text-link" to="/">Return to the homepage <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </div>
</template>
