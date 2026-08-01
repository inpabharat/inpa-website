<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { data: session } = await useFetch<{ data: { email: string, source: string } }>('/api/admin/session')

useSeoMeta({
  title: 'Editor dashboard foundation',
  robots: 'noindex, nofollow, noarchive',
})
</script>

<template>
  <div>
    <section class="page-hero">
      <div class="container container--reading">
        <p class="eyebrow eyebrow--light">Protected editor surface</p>
        <h1>Editor dashboard foundation</h1>
        <p>Authenticated as {{ session?.data.email }} via {{ session?.data.source }}.</p>
      </div>
    </section>
    <section class="section">
      <div class="container container--reading">
        <PlaceholderNotice message="Cloudflare Access has not been configured. The production boundary intentionally refuses access until an INPA-owned Access application and allowlist exist." />
        <h2>Prepared scope</h2>
        <p>The boundary and audit identity are ready for the later news, event, carousel and R2 editor workflows. No administrative mutation endpoint is exposed in this foundation.</p>
      </div>
    </section>
  </div>
</template>
