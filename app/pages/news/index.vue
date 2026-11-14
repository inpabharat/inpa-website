<script setup lang="ts">
import type { ApiResponse, PublicNewsItem } from '../../../shared/types/content'

const { data: response } = await useFetch<ApiResponse<PublicNewsItem[]>>('/api/public/news')
const items = computed(() => response.value?.data ?? [])

useSeoMeta({
  title: 'News',
  description: 'Published news from the Indian Nuclear Physics Association.',
  robots: () => items.value.length > 0 ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container">
        <h1>Latest news</h1>
      </div>
    </section>
    <HomeLatestNews :items="items" />
  </div>
</template>
