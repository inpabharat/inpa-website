<script setup lang="ts">
import { formatIndiaDate } from '~/utils/date'

interface NewsDetail {
  slug: string
  title: string
  summary: string
  body: string
  publishedAt: string | null
  category: string | null
  coverImageKey: string | null
  coverImageAlt: string | null
}

const route = useRoute()
const { data: response } = await useFetch<{ data: NewsDetail | null, meta: { source: string } }>(`/api/public/news/${route.params.slug}`)
const item = computed(() => response.value?.data ?? null)

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: 'News item not found' })
}

useSeoMeta({
  title: () => item.value?.title ?? 'News item unavailable',
  description: () => item.value?.summary ?? 'This news item is not currently available.',
  robots: () => item.value ? 'index, follow' : 'noindex, nofollow',
})
</script>

<template>
  <article>
    <section class="page-hero">
      <div class="container container--reading">
        <h1>{{ item?.title ?? 'News item unavailable' }}</h1>
        <p v-if="item" class="page-hero__meta">
          {{ item.category ?? 'INPA news' }}<template v-if="item.publishedAt"> · <time :datetime="item.publishedAt">{{ formatIndiaDate(item.publishedAt) }}</time></template>
        </p>
        <p>{{ item?.summary ?? 'No verified published record was found for this route.' }}</p>
      </div>
    </section>
    <section class="section">
      <div class="container container--reading prose">
        <img v-if="item?.coverImageKey" class="detail-cover" :src="publicMediaUrl(item.coverImageKey) ?? undefined" :alt="item.coverImageAlt ?? ''" width="960" height="540">
        <p>{{ item?.body }}</p>
        <NuxtLink class="text-link" to="/news">Return to news <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </article>
</template>
