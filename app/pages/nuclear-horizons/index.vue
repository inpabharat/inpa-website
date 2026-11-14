<script setup lang="ts">
import type { PublicPublication } from '../../../shared/types/science'
import { currentLeadership, publicContact } from '~~/content/site/bulletin-sources'
import { editorialBoard } from '~~/content/site/editorial-board'

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
            <div>
              <dt>Editor-in-Chief</dt>
              <dd>
                {{ currentLeadership.editorInChief.name }}<br>
                {{ currentLeadership.editorInChief.title }}<br>
                {{ currentLeadership.editorInChief.department }}<br>
                {{ currentLeadership.editorInChief.affiliation }}<br>
                {{ currentLeadership.editorInChief.address }}<br>
                <a :href="`mailto:${currentLeadership.editorInChief.email}`">{{ currentLeadership.editorInChief.email }}</a>
              </dd>
            </div>
            <div><dt>Publication contact</dt><dd><a :href="`mailto:${publicContact.email}`">{{ publicContact.email }}</a></dd></div>
          </dl>
          <div class="publication-actions">
            <NuxtLink class="text-link" to="/nuclear-horizons/archive">Browse the issue archive <span aria-hidden="true">→</span></NuxtLink>
            <NuxtLink class="text-link" to="/contact">Ask about submitting a manuscript <span aria-hidden="true">→</span></NuxtLink>
            <a class="text-link" href="#editorial-board">Meet the editorial board <span aria-hidden="true">↓</span></a>
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

    <section class="section section--subtle" aria-labelledby="editorial-board">
      <div class="container">
        <h2 id="editorial-board">Editorial Board</h2>

        <ul class="editorial-members" role="list">
          <li v-for="member in editorialBoard" :key="member.name">
            <h3 class="editor-name">{{ member.name }}</h3>
            <p class="editor-role">{{ member.role }}</p>
            <p class="editor-affiliation">
              <span v-for="line in member.affiliation" :key="line">{{ line }}</span>
            </p>
          </li>
        </ul>
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

.editor-name {
  margin-bottom: 0.25rem;
  color: var(--color-navy-950);
  font-family: var(--font-sans);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: normal;
  line-height: 1.35;
}

.editor-role {
  margin-bottom: 0.4rem;
  color: var(--color-navy-700);
  font-weight: 600;
}

.editor-affiliation {
  margin-bottom: 0;
  color: var(--color-text-muted);
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.editor-affiliation span {
  display: block;
}

.editorial-members {
  display: grid;
  gap: 1.25rem 2rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.editorial-members li {
  min-width: 0;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

@media (min-width: 40rem) {
  .editorial-members {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 64rem) {
  .editorial-members {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
