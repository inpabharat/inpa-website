<script setup lang="ts">
import type { PublicPublication, PublicResearch } from '../../../shared/types/science'

const [{ data: publicationResponse, error: publicationError }, { data: researchResponse, error: researchError }] = await Promise.all([
  useFetch<{ data: PublicPublication[] }>('/api/public/publications'),
  useFetch<{ data: PublicResearch[] }>('/api/public/research'),
])

const latestIssue = computed(() => publicationResponse.value?.data[0] ?? null)
const featuredResearch = computed(() => researchResponse.value?.data.find(item => item.isFeatured) ?? null)
</script>

<template>
  <section class="section science-publications" aria-labelledby="science-publications-title">
    <div class="container">
      <SectionHeading
        id="science-publications-title"
        eyebrow="Science and publications"
        title="Research at the centre of INPA"
        intro="Explore a selected Indian research achievement and the latest issue of INPA’s official bulletin."
      />

      <div class="science-publications__grid">
        <article class="science-publications__research">
          <template v-if="featuredResearch">
            <p class="eyebrow eyebrow--light">Featured research</p>
            <h3>{{ featuredResearch.title }}</h3>
            <p>{{ featuredResearch.summary }}</p>
            <dl class="science-publications__metadata">
              <div><dt>Authors</dt><dd>{{ featuredResearch.authors }}</dd></div>
              <div><dt>Institutions</dt><dd>{{ featuredResearch.institutions }}</dd></div>
              <div><dt>Journal</dt><dd>{{ featuredResearch.journal }}</dd></div>
            </dl>
            <NuxtLink class="text-link text-link--light" :to="`/research/${featuredResearch.slug}`">Read the research feature <span aria-hidden="true">→</span></NuxtLink>
          </template>
          <template v-else>
            <p class="eyebrow eyebrow--light">Featured research</p>
            <h3>Research spotlight</h3>
            <p>{{ researchError ? 'The research feature could not be loaded.' : 'No research feature is currently selected.' }}</p>
            <NuxtLink class="text-link text-link--light" to="/research">Browse published research features <span aria-hidden="true">→</span></NuxtLink>
          </template>
        </article>

        <article class="science-publications__bulletin">
          <template v-if="latestIssue">
            <div class="science-publications__issue">
              <img
                :src="publicMediaUrl(latestIssue.coverImageKey) ?? undefined"
                :alt="latestIssue.coverImageAlt"
                width="248"
                height="351"
                loading="lazy"
              >
              <div>
                <p class="eyebrow">Official INPA bulletin</p>
                <h3>{{ latestIssue.title }}</h3>
                <p>{{ latestIssue.summary }}</p>
                <p><strong>Latest issue:</strong> {{ latestIssue.issueLabel }} · {{ formatIssueMonth(latestIssue.publicationDate) }}</p>
              </div>
            </div>
            <div class="science-publications__actions">
              <a class="text-link" :href="publicMediaUrl(latestIssue.pdfKey) ?? undefined" download>Download latest issue <span aria-hidden="true">↓</span></a>
              <NuxtLink class="text-link" to="/nuclear-horizons">Explore Nuclear Horizons <span aria-hidden="true">→</span></NuxtLink>
              <NuxtLink class="text-link" to="/nuclear-horizons/archive">Issue archive <span aria-hidden="true">→</span></NuxtLink>
            </div>
          </template>
          <template v-else>
            <p class="eyebrow">Official INPA bulletin</p>
            <h3>Nuclear Horizons</h3>
            <p>{{ publicationError ? 'The latest issue could not be loaded.' : 'No issue is currently published.' }}</p>
            <NuxtLink class="text-link" to="/nuclear-horizons">Visit Nuclear Horizons <span aria-hidden="true">→</span></NuxtLink>
          </template>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.science-publications__bulletin {
  container-type: inline-size;
}

.science-publications__research,
.science-publications__bulletin {
  overflow-wrap: anywhere;
}

.science-publications__issue {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
  gap: 1.25rem;
}

.science-publications__issue > div {
  min-width: 0;
}

.science-publications__issue img {
  display: block;
  width: 8.5rem;
  max-width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
}

/* Use the card's available width, not the viewport shared with research. */
@container (min-width: 28rem) {
  .science-publications__issue {
    grid-template-columns: 8.5rem minmax(0, 1fr);
  }
}
</style>
