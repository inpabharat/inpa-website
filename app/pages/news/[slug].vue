<script setup lang="ts">
interface NewsDetail {
  slug: string
  title: string
  summary: string
  body: string
  publishedAt: string | null
  category: string | null
}

const route = useRoute()
const { data: response } = await useFetch<{ data: NewsDetail | null, meta: { source: string } }>(`/api/public/news/${route.params.slug}`)
const item = computed(() => response.value?.data ?? null)

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
        <p v-if="item">{{ item.body }}</p>
        <PlaceholderNotice v-else message="This may be an unpublished item, a missing record, or a local development session without a D1 binding." />
        <NuxtLink class="text-link" to="/news">Return to news <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </section>
  </article>
</template>
