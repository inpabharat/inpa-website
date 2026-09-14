<script setup lang="ts">
import type { PublicResearch } from '../../../shared/types/science'

const { data: response, error, status, refresh } = await useFetch<{ data: PublicResearch[] }>('/api/public/research')
const items = computed(() => response.value?.data ?? [])

useSeoMeta({
  title: 'Featured research',
  description: 'Curated research features from India’s nuclear-physics community, selected by INPA editors.',
  robots: () => items.value.length ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Scientific highlights</p>
        <h1>Featured research</h1>
        <p>Selected achievements from India’s nuclear-physics community, presented with links to the published research.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <p v-if="status === 'pending'" class="placeholder-notice" role="status">Loading research features…</p>
        <div v-else-if="error" class="research-state" role="alert">
          <h2>Research features could not be loaded</h2>
          <p>Please try again in a moment.</p>
          <button class="button button--navy" type="button" @click="refresh()">Try again</button>
        </div>
        <div v-else-if="items.length" class="research-list">
          <article v-for="item in items" :key="item.id" class="research-card">
            <img
              v-if="item.imageKey"
              :src="publicMediaUrl(item.imageKey) ?? undefined"
              :alt="item.imageAlt ?? ''"
              width="960"
              height="540"
              loading="lazy"
            >
            <div class="research-card__body">
              <p class="eyebrow"><span v-if="item.isFeatured">Featured · </span><time :datetime="item.publishedAt">{{ formatIndiaDate(item.publishedAt) }}</time></p>
              <h2><NuxtLink :to="`/research/${item.slug}`">{{ item.title }}</NuxtLink></h2>
              <p>{{ item.summary }}</p>
              <dl class="research-card__facts">
                <div><dt>Authors</dt><dd>{{ item.authors }}</dd></div>
                <div><dt>Institutions</dt><dd>{{ item.institutions }}</dd></div>
                <div><dt>Journal</dt><dd>{{ item.journal }}</dd></div>
              </dl>
              <NuxtLink class="text-link" :to="`/research/${item.slug}`">Read this research feature <span aria-hidden="true">→</span></NuxtLink>
            </div>
          </article>
        </div>
        <PlaceholderNotice v-else message="No research features are currently published." />
      </div>
    </section>
  </div>
</template>

<style scoped>
.research-list {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.research-card {
  display: grid;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.research-card > img {
  width: 100%;
  height: 100%;
  max-height: 25rem;
  object-fit: cover;
}

.research-card__body,
.research-state {
  padding: clamp(1.25rem, 4vw, 2.5rem);
}

.research-card__body h2 a {
  color: inherit;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.15em;
}

.research-card__facts {
  margin-block: 1.25rem;
}

.research-card__facts div {
  display: grid;
  padding-block: 0.6rem;
  border-top: 1px solid var(--color-border);
  gap: 0.2rem;
}

.research-card__facts dt {
  color: var(--color-navy-700);
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.research-card__facts dd {
  margin: 0;
}

.research-state {
  max-width: 44rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface-subtle);
}

@media (min-width: 52rem) {
  .research-card:has(> img) {
    grid-template-columns: minmax(18rem, 0.8fr) minmax(0, 1.2fr);
  }
}
</style>
