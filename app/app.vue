<script setup lang="ts">
import { getCanonicalUrl } from '~~/shared/utils/public-seo'

const route = useRoute()
const config = useRuntimeConfig()
useHead(() => {
  const canonical = getCanonicalUrl(config.public.siteUrl, route.path)
  return { link: canonical ? [{ rel: 'canonical', href: canonical }] : [] }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
