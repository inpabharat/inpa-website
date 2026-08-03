<script setup lang="ts">
import { footerLinks } from '~~/content/site/home'
import { publicContact } from '~~/content/site/bulletin-sources'
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <p class="eyebrow eyebrow--light">Indian Nuclear Physics Association</p>
        <h2>Contact INPA</h2>
        <p><a :href="`mailto:${publicContact.email}`">{{ publicContact.email }}</a></p>
        <p class="site-footer__note">{{ publicContact.missing }}</p>
      </div>
      <nav aria-label="Footer navigation">
        <NuxtLink v-for="item in footerLinks" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
    <div class="container site-footer__legal">
      <p>© 2026 Indian Nuclear Physics Association (INPA). All rights reserved.</p>
      <p>Local development site — official office and media permissions remain pending.</p>
    </div>
  </footer>
</template>
