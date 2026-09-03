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
        <div v-for="section in content.sections" :id="section.id" :key="section.heading" class="route-section">
          <h2>{{ section.heading }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <ul v-if="section.items">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </div>
        <p v-if="content.sourceNote" class="source-note">{{ content.sourceNote }}</p>
        <section v-if="content.requiredContent" class="route-section route-section--availability" aria-labelledby="availability-heading">
          <h2 id="availability-heading">Further information</h2>
          <p>{{ content.requiredContent }}</p>
        </section>
        <NuxtLink class="text-link" to="/">Return to the homepage <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </div>
</template>
