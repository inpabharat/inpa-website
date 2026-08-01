<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  intro?: string
}>()
</script>

<template>
  <header class="section-heading">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p v-if="intro" class="section-heading__intro">{{ intro }}</p>
  </header>
</template>
