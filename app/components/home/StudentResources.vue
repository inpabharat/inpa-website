<script setup lang="ts">
import { studentResourceCategories } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white" aria-labelledby="students-title">
    <div class="container">
      <SectionHeading id="students-title" eyebrow="Resources for students" title="A clear first connection to INPA" intro="Each resource will show its owner and review date; expired opportunities will move out of current listings." />
      <PlaceholderNotice message="Resources will be added here after their owners, destinations and review dates are confirmed." />
      <ul class="resource-grid">
        <li v-for="(category, index) in studentResourceCategories" :key="category">
          <span class="resource-grid__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <span>{{ category }}</span>
          <small>Awaiting an approved resource</small>
        </li>
      </ul>
      <NuxtLink class="button button--navy" to="/students">Explore student resources</NuxtLink>
    </div>
  </section>
</template>
