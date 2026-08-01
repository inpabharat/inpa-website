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
        <p class="eyebrow eyebrow--light">{{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}</p>
        <h1>{{ error.statusCode }}</h1>
        <p>{{ error.statusCode === 404 ? 'The requested public route is not available.' : 'The request could not be completed safely.' }}</p>
        <button class="button button--gold" type="button" @click="returnHome">Return home</button>
      </div>
    </section>
  </NuxtLayout>
</template>
