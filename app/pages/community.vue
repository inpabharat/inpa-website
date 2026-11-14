<script setup lang="ts">
import { communityHighlights } from '~~/content/site/home'

const { inauguration, items: photos } = communityHighlights

useSeoMeta({
  title: 'Community Highlights',
  description: inauguration.summary,
  robots: 'index, follow',
})
</script>

<template>
  <div>
    <header class="page-hero">
      <div class="container container--reading">
        <h1>Community Highlights</h1>
      </div>
    </header>

    <article class="section" aria-labelledby="inauguration-title">
      <div class="container container--reading">
        <p class="meta"><time :datetime="inauguration.datetime">{{ inauguration.date }}</time> · {{ inauguration.location }}</p>
        <h2 id="inauguration-title">{{ inauguration.title }}</h2>
        <p class="prose">{{ inauguration.summary }}</p>

        <div class="community-photos">
          <figure v-for="photo in photos" :key="photo.image">
            <img :src="photo.image" :alt="photo.alt" width="1599" height="1066" loading="lazy">
            <figcaption>{{ photo.caption }}</figcaption>
          </figure>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.community-photos {
  display: grid;
  gap: 1.5rem;
  margin-top: 2rem;
}

.community-photos figure {
  min-width: 0;
  margin: 0;
}

.community-photos img {
  width: 100%;
  height: auto;
}

.community-photos figcaption {
  margin-top: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (min-width: 42rem) {
  .community-photos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
