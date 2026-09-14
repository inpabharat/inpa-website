<script setup lang="ts">
import type { PublicResearch } from '../../../shared/types/science'

const route = useRoute()
const slug = computed(() => String(route.params.slug))
const { data: response, error } = await useFetch<{ data: PublicResearch }>(() => `/api/public/research/${encodeURIComponent(slug.value)}`)
const item = computed(() => response.value?.data ?? null)

if (error.value || !item.value) {
  throw createError({ statusCode: 404, statusMessage: 'Research feature not found' })
}

const bodyParagraphs = computed(() => item.value?.body.split(/\r?\n\s*\r?\n/).map(paragraph => paragraph.trim()).filter(Boolean) ?? [])

useSeoMeta({
  title: () => item.value?.title ?? 'Research feature',
  description: () => item.value?.summary ?? 'A research feature from the Indian Nuclear Physics Association.',
  robots: 'index, follow',
  ogType: 'article',
  ogImage: () => publicMediaUrl(item.value?.imageKey) ?? undefined,
  ogImageAlt: () => item.value?.imageAlt ?? undefined,
})
</script>

<template>
  <article v-if="item">
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Research feature · <time :datetime="item.publishedAt">{{ formatIndiaDate(item.publishedAt) }}</time></p>
        <h1>{{ item.title }}</h1>
        <p>{{ item.summary }}</p>
      </div>
    </section>

    <section class="section">
      <div class="container research-detail">
        <figure v-if="item.imageKey" class="research-detail__figure">
          <img :src="publicMediaUrl(item.imageKey) ?? undefined" :alt="item.imageAlt ?? ''" width="1200" height="675">
          <figcaption v-if="item.imageCredit">{{ item.imageCredit }}</figcaption>
        </figure>

        <div class="research-detail__content">
          <dl class="research-detail__facts">
            <div><dt>Authors</dt><dd>{{ item.authors }}</dd></div>
            <div><dt>Institutions</dt><dd>{{ item.institutions }}</dd></div>
            <div><dt>Journal</dt><dd>{{ item.journal }}</dd></div>
            <div><dt>Published</dt><dd><time :datetime="item.publishedAt">{{ formatIndiaDate(item.publishedAt) }}</time></dd></div>
          </dl>

          <div class="prose research-detail__body">
            <p v-for="(paragraph, index) in bodyParagraphs" :key="index">{{ paragraph }}</p>
          </div>

          <div class="research-detail__actions">
            <a class="button button--navy" :href="item.doi" target="_blank" rel="noopener noreferrer">Open the published paper <span aria-hidden="true">↗</span></a>
            <NuxtLink class="text-link" to="/research">Browse all research features <span aria-hidden="true">→</span></NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.research-detail {
  display: grid;
  align-items: start;
  gap: clamp(2rem, 6vw, 5rem);
}

.research-detail__figure {
  margin: 0;
}

.research-detail__figure img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
}

.research-detail__figure figcaption {
  margin-top: 0.65rem;
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.research-detail__facts {
  margin: 0 0 2rem;
}

.research-detail__facts div {
  display: grid;
  padding-block: 0.75rem;
  border-top: 1px solid var(--color-border);
  gap: 0.25rem;
}

.research-detail__facts dt {
  color: var(--color-navy-700);
  font-size: 0.78rem;
  font-weight: 750;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.research-detail__facts dd {
  margin: 0;
}

.research-detail__body {
  white-space: normal;
}

.research-detail__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 2rem;
  gap: 0.75rem 1.5rem;
}

@media (min-width: 58rem) {
  .research-detail:has(.research-detail__figure) {
    grid-template-columns: minmax(20rem, 0.9fr) minmax(0, 1.1fr);
  }
}
</style>
