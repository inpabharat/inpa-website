<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

function returnHome(): void {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <section class="page-hero">
      <div class="container container--reading">
        <h1>{{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}</h1>
        <p class="page-hero__meta">Error {{ error.statusCode }}</p>
        <p>{{ error.statusCode === 404 ? 'The requested public route is not available.' : 'The request could not be completed safely.' }}</p>
        <button class="button button--gold" type="button" @click="returnHome">Return home</button>
      </div>
    </section>
  </NuxtLayout>
</template>
