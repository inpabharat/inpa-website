<script setup lang="ts">
import { primaryNavigation } from '~~/content/site/navigation'
</script>

<template>
  <header class="site-header">
    <div class="container site-header__inner">
      <NuxtLink class="wordmark" to="/" aria-label="Indian Nuclear Physics Association home">
        <span class="wordmark__mark" aria-hidden="true">INPA</span>
        <span class="wordmark__text">Indian Nuclear Physics Association</span>
      </NuxtLink>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <NuxtLink v-for="item in primaryNavigation" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>

      <details class="mobile-nav">
        <summary>Menu</summary>
        <nav aria-label="Mobile navigation">
          <NuxtLink v-for="item in primaryNavigation" :key="item.to" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </nav>
      </details>
    </div>
  </header>
</template>
