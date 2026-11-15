<script setup lang="ts">
defineProps<{ direction: 'previous' | 'next' }>()
</script>

<template>
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="direction === 'previous' ? 'M12.5 5 7.5 10l5 5' : 'M7.5 5l5 5-5 5'" />
  </svg>
</template>
