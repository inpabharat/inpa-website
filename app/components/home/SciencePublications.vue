<script setup lang="ts">
import type { PublicPublication, PublicResearch } from '../../../shared/types/science'

const [{ data: publicationResponse, error: publicationError }, { data: researchResponse, error: researchError }] = await Promise.all([
  useFetch<{ data: PublicPublication[] }>('/api/public/publications'),
  useFetch<{ data: PublicResearch[] }>('/api/public/research'),
])

const latestIssue = computed(() => publicationResponse.value?.data[0] ?? null)
// Prefer the editor's featured pick; otherwise show the most recent published feature.
const featuredResearch = computed(() => {
  const items = researchResponse.value?.data ?? []
  return items.find(item => item.isFeatured) ?? items[0] ?? null
})
// With no research to show, the bulletin takes the full row instead of sitting beside an empty panel.
// A failed research request hides the panel too; the research page carries its own error state.
const showResearch = computed(() => !researchError.value && Boolean(featuredResearch.value))
const sectionIntro = computed(() => showResearch.value
  ? 'Explore a selected Indian research achievement and the latest issue of INPA’s official bulletin.'
  : 'The latest issue of Nuclear Horizons, INPA’s official bulletin, with ideas, research perspectives and community news.')
</script>

<template>
  <section class="section science-publications" aria-labelledby="science-publications-title">
    <div class="container">
      <SectionHeading
        id="science-publications-title"
        title="Research at the centre of INPA"
        :intro="sectionIntro"
      />

      <div class="science-publications__grid" :class="{ 'science-publications__grid--single': !showResearch }">
        <article v-if="showResearch && featuredResearch" class="science-publications__research">
          <h3>{{ featuredResearch.title }}</h3>
          <p>{{ featuredResearch.summary }}</p>
          <dl class="science-publications__metadata">
            <div><dt>Authors</dt><dd>{{ featuredResearch.authors }}</dd></div>
            <div><dt>Institutions</dt><dd>{{ featuredResearch.institutions }}</dd></div>
            <div><dt>Journal</dt><dd>{{ featuredResearch.journal }}</dd></div>
          </dl>
          <NuxtLink class="text-link text-link--light" :to="`/research/${featuredResearch.slug}`">Read the research feature <span aria-hidden="true">→</span></NuxtLink>
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
                <h3>{{ latestIssue.title }}</h3>
                <p class="science-publications__kind">INPA’s official bulletin</p>
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
            <h3>Nuclear Horizons</h3>
            <p class="science-publications__kind">INPA’s official bulletin</p>
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

.science-publications__kind {
  margin-top: -0.35rem;
  color: var(--color-navy-700);
  font-weight: 650;
}

/* Use the card's available width, not the viewport shared with research. */
@container (min-width: 28rem) {
  .science-publications__issue {
    grid-template-columns: 8.5rem minmax(0, 1fr);
  }
}

/* Alone on its row, the bulletin gives the cover room and keeps the text to a reading measure. */
@container (min-width: 48rem) {
  .science-publications__issue {
    grid-template-columns: 12rem minmax(0, 40rem);
    gap: 2.5rem;
    align-items: center;
  }

  .science-publications__issue img {
    width: 12rem;
  }

  /* Line the links up under the text column, not under the cover. */
  .science-publications__actions {
    padding-left: 14.5rem;
  }
}
</style>
