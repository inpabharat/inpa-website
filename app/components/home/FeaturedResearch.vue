<script setup lang="ts">
import type { PublicResearch } from '../../../shared/types/science'

const { data: response, error } = await useFetch<{ data: PublicResearch[] }>('/api/public/research')
const item = computed(() => response.value?.data.find(entry => entry.isFeatured) ?? null)
</script>

<template>
  <section class="section research-section" aria-labelledby="research-title">
    <div class="container">
      <SectionHeading id="research-title" eyebrow="Featured research" title="Research spotlight" intro="A selected achievement from India’s nuclear-physics community." />
      <article v-if="item" class="research-spotlight">
        <div v-if="item.imageKey" class="featured-research__media">
          <img :src="publicMediaUrl(item.imageKey) ?? undefined" :alt="item.imageAlt ?? ''" width="960" height="540" loading="lazy">
          <p v-if="item.imageCredit" class="meta">{{ item.imageCredit }}</p>
        </div>
        <div>
          <p class="eyebrow eyebrow--light">Selected research</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
          <dl class="metadata-list">
            <div><dt>Authors</dt><dd>{{ item.authors }}</dd></div>
            <div><dt>Institutions</dt><dd>{{ item.institutions }}</dd></div>
            <div><dt>Journal</dt><dd>{{ item.journal }}</dd></div>
          </dl>
          <NuxtLink class="text-link text-link--light" :to="`/research/${item.slug}`">Read the research feature <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </article>
      <PlaceholderNotice v-else :message="error ? 'The featured research item could not be loaded.' : 'No research feature is currently selected.'" />
    </div>
  </section>
</template>

<style scoped>
.research-spotlight {
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.featured-research__media img {
  display: block;
  width: 100%;
  height: auto;
}

@media (min-width: 52rem) {
  .research-spotlight {
    grid-template-columns: minmax(16rem, 0.8fr) minmax(0, 1.2fr);
  }
}
</style>
