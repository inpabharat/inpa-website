<script setup lang="ts">
import { bulletinSources } from '~~/content/site/bulletin-sources'

const issues = [...bulletinSources].reverse()

useSeoMeta({
  title: 'Nuclear Horizons archive',
  description: 'Browse and download published issues of Nuclear Horizons from the Indian Nuclear Physics Association.',
  robots: 'index, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Publication archive</p>
        <h1>Nuclear Horizons archive</h1>
        <p>Read or download every published issue of INPA’s official bulletin.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="issue-grid">
          <PublicationIssueCard v-for="issue in issues" :key="issue.id" :issue="issue" />
        </div>
      </div>
    </section>
  </div>
</template>
