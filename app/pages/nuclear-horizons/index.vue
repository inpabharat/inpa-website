<script setup lang="ts">
import type { PublicPublication } from '../../../shared/types/science'
import { currentLeadership, publicContact } from '~~/content/site/bulletin-sources'

const { data: response, error, status, refresh } = await useFetch<{ data: PublicPublication[] }>('/api/public/publications')
const latestIssue = computed(() => response.value?.data[0] ?? null)

useSeoMeta({
  title: 'Nuclear Horizons',
  description: 'Read the latest issue of Nuclear Horizons, the official bulletin of the Indian Nuclear Physics Association.',
  robots: () => latestIssue.value ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Official INPA publication</p>
        <h1>Nuclear Horizons</h1>
        <p>A platform for scientific ideas, research perspectives and news from India’s nuclear-physics community.</p>
      </div>
    </section>

    <section class="section">
      <div class="container publication-page-intro">
        <div>
          <p class="eyebrow">Latest issue</p>
          <h2>Ideas, research and community news</h2>
          <p class="lead">Nuclear Horizons is a bulletin of the Indian Nuclear Physics Association.</p>
          <dl class="publication-facts">
            <div><dt>Chief Editor</dt><dd>{{ currentLeadership.chiefEditor.name }}, {{ currentLeadership.chiefEditor.affiliation }}</dd></div>
            <div><dt>Publication contact</dt><dd><a :href="`mailto:${publicContact.email}`">{{ publicContact.email }}</a></dd></div>
          </dl>
          <div class="publication-actions">
            <NuxtLink class="text-link" to="/nuclear-horizons/archive">Browse the issue archive <span aria-hidden="true">→</span></NuxtLink>
            <NuxtLink class="text-link" to="/contact">Ask about submitting a manuscript <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>

        <p v-if="status === 'pending'" class="placeholder-notice" role="status">Loading the latest issue…</p>
        <div v-else-if="error" class="publication-state" role="alert">
          <h2>The latest issue could not be loaded</h2>
          <p>Please try again. Published issues remain available through the archive when the service is restored.</p>
          <button class="button button--navy" type="button" @click="refresh()">Try again</button>
        </div>
        <PublicationIssueCard v-else-if="latestIssue" :issue="latestIssue" />
        <PlaceholderNotice v-else message="No Nuclear Horizons issue is currently published." />
      </div>
    </section>
  </div>
</template>

<style scoped>
.publication-actions {
  display: grid;
  justify-items: start;
  gap: 0.6rem;
}

.publication-state {
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border: 1px solid var(--color-border);
  background: var(--color-surface-subtle);
}
</style>
