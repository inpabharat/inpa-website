<script setup lang="ts">
import { studentResourceCategories } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white" aria-labelledby="students-title">
    <div class="container">
      <SectionHeading id="students-title" eyebrow="Resources for students" title="A clear first connection to INPA" intro="Each resource will show its owner and review date; expired opportunities will move out of current listings." />
      <PlaceholderNotice message="Development placeholder — verified resource destinations, owners and last-reviewed dates are required." />
      <ul class="resource-grid">
        <li v-for="(category, index) in studentResourceCategories" :key="category">
          <span class="resource-grid__number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
          <span>{{ category }}</span>
          <small>Content source required</small>
        </li>
      </ul>
      <NuxtLink class="button button--navy" to="/students">Explore the student-resources framework</NuxtLink>
    </div>
  </section>
</template>
