<script setup lang="ts">
import { footerLinks } from '~~/content/site/home'
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div>
        <p class="eyebrow eyebrow--light">Indian Nuclear Physics Association</p>
        <h2>Official contact details are awaiting verification.</h2>
        <p class="site-footer__note">
          Development placeholder — office address, contact channels, social profiles and newsletter action have not been supplied.
        </p>
      </div>
      <nav aria-label="Footer navigation">
        <NuxtLink v-for="item in footerLinks" :key="item.to" :to="item.to">
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
    <div class="container site-footer__legal">
      <p>Copyright notice pending institutional approval.</p>
      <p>Local development foundation — not launch-ready content.</p>
    </div>
  </footer>
</template>
