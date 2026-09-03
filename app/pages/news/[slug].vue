<script setup lang="ts">
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
        <p class="eyebrow eyebrow--light">{{ item?.category ?? 'INPA news' }}</p>
        <h1>{{ item?.title ?? 'News item unavailable' }}</h1>
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
