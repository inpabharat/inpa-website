<script setup lang="ts">
import type { PublicPublication } from '../../../shared/types/science'
import { currentLeadership } from '~~/content/site/bulletin-sources'

const { data: response, error } = await useFetch<{ data: PublicPublication[] }>('/api/public/publications')
const latestIssue = computed(() => response.value?.data[0] ?? null)
</script>

<template>
  <section class="section section--subtle" aria-labelledby="horizons-title">
    <div v-if="latestIssue" class="container publication-feature">
      <img
        class="publication-cover-image"
        :src="publicMediaUrl(latestIssue.coverImageKey) ?? undefined"
        :alt="latestIssue.coverImageAlt"
        width="992"
        height="1403"
        loading="lazy"
      >
      <div>
        <p class="eyebrow">Official INPA bulletin</p>
        <h2 id="horizons-title">{{ latestIssue.title }}</h2>
        <p class="lead">{{ latestIssue.summary }}</p>
        <p><strong>Editor-in-Chief:</strong> {{ currentLeadership.editorInChief.name }}, {{ currentLeadership.editorInChief.affiliation }}</p>
        <p><strong>Latest issue:</strong> {{ latestIssue.issueLabel }} · {{ formatIssueMonth(latestIssue.publicationDate) }}</p>
        <div class="science-publications__actions">
          <a class="button button--navy" :href="publicMediaUrl(latestIssue.pdfKey) ?? undefined" download>Download latest issue</a>
          <NuxtLink class="text-link" to="/nuclear-horizons">Explore Nuclear Horizons <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </div>
    </div>
    <div v-else class="container">
      <SectionHeading id="horizons-title" eyebrow="Official INPA bulletin" title="Nuclear Horizons" />
      <PlaceholderNotice :message="error ? 'The latest issue could not be loaded.' : 'No issue is currently published.'" />
    </div>
  </section>
</template>
