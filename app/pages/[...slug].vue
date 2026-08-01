<script setup lang="ts">
import { pendingRoutes } from '~~/content/site/routes'

const route = useRoute()
const content = computed(() => pendingRoutes[route.path])

if (!content.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useSeoMeta({
  title: () => content.value?.title ?? 'Page unavailable',
  description: () => content.value?.description ?? 'This public route is not available.',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <ContentPendingPage v-if="content" :content="content" />
</template>
