<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <p class="placeholder-notice" role="note">
    <span aria-hidden="true">Development status</span>
    {{ message }}
  </p>
</template>
