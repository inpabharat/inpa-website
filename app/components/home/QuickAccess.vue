<script setup lang="ts">
import { quickLinks } from '~~/content/site/home'
</script>

<template>
  <section class="section quick-section" aria-labelledby="quick-title">
    <div class="container">
      <SectionHeading id="quick-title" eyebrow="Quick access" title="Find essential INPA information" />
      <nav class="quick-grid" aria-label="Quick access links">
        <NuxtLink v-for="item in quickLinks" :key="item.to" :to="item.to">
          <span class="quick-grid__icon" aria-hidden="true">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </nav>
      <p class="quick-section__note">Membership and donations remain informational or externally directed only; no account or payment system is included.</p>
    </div>
  </section>
</template>
