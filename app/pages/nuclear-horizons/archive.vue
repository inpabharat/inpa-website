<script setup lang="ts">
import type { PublicPublication } from '../../../shared/types/science'

const { data: response, error, status, refresh } = await useFetch<{ data: PublicPublication[] }>('/api/public/publications')
const issues = computed(() => response.value?.data ?? [])

useSeoMeta({
  title: 'Nuclear Horizons archive',
  description: 'Browse and download published issues of Nuclear Horizons from the Indian Nuclear Physics Association.',
  robots: () => issues.value.length ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Publication archive</p>
        <h1>Nuclear Horizons archive</h1>
        <p>Browse published issues and download each complete bulletin as a PDF.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p v-if="status === 'pending'" class="placeholder-notice" role="status">Loading published issues…</p>
        <div v-else-if="error" class="archive-state" role="alert">
          <h2>The archive could not be loaded</h2>
          <p>Please try again in a moment.</p>
          <button class="button button--navy" type="button" @click="refresh()">Try again</button>
        </div>
        <div v-else-if="issues.length" class="issue-grid">
          <PublicationIssueCard v-for="issue in issues" :key="issue.id" :issue="issue" heading-level="h2" />
        </div>
        <PlaceholderNotice v-else message="No Nuclear Horizons issues are currently published." />
      </div>
    </section>
  </div>
</template>

<style scoped>
.archive-state {
  max-width: 44rem;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border: 1px solid var(--color-border);
  background: var(--color-surface-subtle);
}
</style>
