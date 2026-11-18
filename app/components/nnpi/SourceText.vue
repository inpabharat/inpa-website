<script setup lang="ts">
import type { NnpiText } from '~~/content/site/nnpi'

defineProps<{ text: NnpiText }>()

function opensNewTab(href?: string): boolean {
  return /^(https?:)?\/\//i.test(href ?? '')
}
</script>

<template>
  <template v-if="typeof text === 'string'">{{ text }}</template>
  <template v-else>
    <component
      :is="run.href ? 'a' : run.bold ? 'strong' : run.italic ? 'em' : 'span'"
      v-for="(run, index) in text"
      :key="index"
      :href="run.href"
      :target="opensNewTab(run.href) ? '_blank' : undefined"
      :rel="opensNewTab(run.href) ? 'noopener noreferrer' : undefined"
      :class="{ 'nnpi-source-link': run.href, 'nnpi-source-italic': run.italic && run.bold }"
    >{{ run.text }}</component>
  </template>
</template>

<style scoped>
.nnpi-source-link { text-decoration-thickness: 1px; text-underline-offset: 0.2em; }
.nnpi-source-italic { font-style: italic; }
</style>
