<script setup lang="ts">
import { pendingRoutes } from '~~/content/site/routes'

const route = useRoute()
const contentRouteKey = computed(() => {
  if (route.path === '/') return route.path
  return route.path.replace(/\/+$/, '')
})
const content = computed(() => pendingRoutes[contentRouteKey.value])

if (!content.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

useSeoMeta({
  title: () => content.value?.title ?? 'Page unavailable',
  description: () => content.value?.description ?? 'This public route is not available.',
  robots: () => content.value?.indexable ? 'index, follow' : 'noindex, follow',
})
</script>

<template>
  <ContentPendingPage v-if="content" :content="content" />
</template>
