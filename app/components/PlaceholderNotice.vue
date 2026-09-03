<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <p class="placeholder-notice" role="note">
    {{ message }}
  </p>
</template>
