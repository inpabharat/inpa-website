<script setup lang="ts">
import type { PublicNewsItem } from '../../../shared/types/content'
import { formatIndiaDate } from '~/utils/date'

defineProps<{ items: PublicNewsItem[] }>()
</script>

<template>
  <section class="section section--subtle" aria-labelledby="news-title">
    <div class="container">
      <div class="section-heading-row">
        <SectionHeading id="news-title" eyebrow="Latest news" title="News from the INPA community" intro="Only published, unexpired records are eligible for this section." />
        <NuxtLink class="text-link" to="/news">View news archive <span aria-hidden="true">→</span></NuxtLink>
      </div>
      <div v-if="items.length" class="card-grid card-grid--three">
        <article v-for="item in items" :key="item.slug" class="editorial-card">
          <div class="editorial-card__media" aria-hidden="true">Image</div>
          <p class="meta"><span v-if="item.category">{{ item.category }} · </span>{{ formatIndiaDate(item.publishedAt) }} IST</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.summary }}</p>
          <NuxtLink class="text-link" :to="item.externalUrl ?? `/news/${item.slug}`">Read this news item <span aria-hidden="true">→</span></NuxtLink>
        </article>
      </div>
      <PlaceholderNotice v-else message="No verified published news is available. Local D1 fixtures can demonstrate this layout without becoming production content." />
    </div>
  </section>
</template>
