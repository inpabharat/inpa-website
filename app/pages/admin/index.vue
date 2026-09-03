<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: session } = await useFetch<{ data: { email: string, source: string } }>('/api/admin/session')

useSeoMeta({
  title: 'INPA editor',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Protected content management</p>
        <h1>INPA editor</h1>
        <p>Authenticated as {{ session?.data.email }} via {{ session?.data.source }}.</p>
      </div>
    </section>
    <section class="section">
      <div class="container container--reading">
        <h2>Content management</h2>
        <p>News, events and homepage features will be managed here. Administrative publishing controls remain unavailable until the editor workflow has completed its acceptance and access-control tests.</p>
      </div>
    </section>
  </div>
</template>
