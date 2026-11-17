<script setup lang="ts">
import type { PublicPublication } from '../../../shared/types/science'
import { currentLeadership, publicContact } from '~~/content/site/bulletin-sources'
import { editorialBoard } from '~~/content/site/editorial-board'

const editorInChief = currentLeadership.editorInChief
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
        <h2 id="editorial-board" class="editorial-title">Editorial Board</h2>

        <div class="editorial-chief">
          <div class="editorial-portrait">
            <img :src="editorInChief.portrait" alt="" width="160" height="200" loading="lazy" decoding="async">
          </div>
          <div class="editorial-profile">
            <h3 class="editor-name">{{ editorInChief.name }}</h3>
            <p class="editor-role">Editor-in-Chief</p>
            <p class="editor-affiliation">
              <span>{{ editorInChief.title }}, {{ editorInChief.department }}</span>
              <span>{{ editorInChief.affiliation }}</span>
              <span>{{ editorInChief.address }}</span>
            </p>
            <a class="text-link editorial-chief__contact" :href="`mailto:${editorInChief.email}`">{{ editorInChief.email }}</a>
          </div>
        </div>

        <ul class="editorial-members" role="list">
          <li v-for="member in editorialBoard" :key="member.name" class="editorial-member">
            <div class="editorial-portrait">
              <img :src="member.portrait" alt="" width="128" height="160" loading="lazy" decoding="async">
            </div>
            <div class="editorial-profile">
              <h3 class="editor-name">{{ member.name }}</h3>
              <p class="editor-role">{{ member.role }}</p>
              <p class="editor-affiliation">
                <span v-for="line in member.affiliation" :key="line">{{ line }}</span>
              </p>
            </div>
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

.editorial-title {
  margin-bottom: clamp(1.25rem, 3vw, 2rem);
  font-size: clamp(2rem, 4vw, 2.8rem);
}

.editorial-chief {
  display: grid;
  align-items: center;
  gap: clamp(1.25rem, 4vw, 2.75rem);
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border-top: 2px solid var(--color-gold-500);
  background: var(--color-surface);
}

.editorial-chief .editorial-portrait {
  width: clamp(7rem, 16vw, 10rem);
}

.editorial-portrait {
  overflow: hidden;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius);
  background: var(--color-border);
}

.editorial-portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
}

.editorial-profile {
  min-width: 0;
  overflow-wrap: anywhere;
}

.editor-name {
  margin-bottom: 0.35rem;
  font-size: clamp(1.1875rem, 2.4vw, 1.5rem);
  line-height: 1.2;
}

.editorial-chief .editor-name {
  font-size: clamp(1.65rem, 4vw, 2.35rem);
}

.editorial-chief__contact {
  display: inline-block;
  margin-top: 0.75rem;
}

.editor-role {
  margin-bottom: 0.5rem;
  color: var(--color-navy-700);
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.45;
}

.editor-affiliation {
  margin-bottom: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.55;
}

.editorial-chief .editor-affiliation {
  font-size: 1rem;
}

.editor-affiliation span {
  display: block;
}

.editorial-members {
  display: grid;
  column-gap: clamp(2rem, 5vw, 4rem);
  padding: 0;
  margin: clamp(1.5rem, 4vw, 2.5rem) 0 0;
  list-style: none;
}

.editorial-member {
  display: grid;
  grid-template-columns: clamp(4.5rem, 17vw, 8rem) minmax(0, 1fr);
  align-items: start;
  gap: clamp(0.875rem, 2.5vw, 1.75rem);
  padding-block: clamp(1rem, 3vw, 1.75rem);
  border-top: 1px solid var(--color-border);
}

@media (min-width: 36rem) {
  .editorial-chief {
    grid-template-columns: auto minmax(0, 1fr);
  }
}

@media (min-width: 52rem) {
  .editorial-members {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
