<script setup lang="ts">
import { footerLinks } from '~~/content/site/home'
import { publicContact } from '~~/content/site/bulletin-sources'
import { navigationGroups } from '~~/content/site/navigation'

const footerExploreLinks = navigationGroups.map(group => ({
  label: group.label,
  to: group.links[0]?.to ?? '/',
}))
</script>

<template>
  <footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__identity">
        <p class="eyebrow eyebrow--light">Indian Nuclear Physics Association</p>
        <h2>Connecting People and Enabling Discovery</h2>
        <address class="site-footer__contact">
          <span>{{ publicContact.address }}</span>
          <a :href="`tel:${publicContact.phoneHref}`">{{ publicContact.secretary }}, Secretary — {{ publicContact.phoneDisplay }}</a>
          <a :href="`mailto:${publicContact.email}`">{{ publicContact.email }}</a>
        </address>
        <p class="site-footer__source">{{ publicContact.source }}</p>
        <p class="site-footer__note">{{ publicContact.missing }}</p>
      </div>
      <div class="site-footer__navigation">
        <nav aria-label="Explore INPA">
          <h3>Explore</h3>
          <NuxtLink v-for="item in footerExploreLinks" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>
        <nav aria-label="Association information">
          <h3>Association</h3>
          <NuxtLink v-for="item in footerLinks" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>
      </div>
    </div>
    <div class="container site-footer__legal">
      <p>© 2026 Indian Nuclear Physics Association (INPA). All rights reserved.</p>
      <div class="site-footer__legal-meta">
        <p>Prototype website — selected media permissions and programme details remain pending.</p>
        <p class="site-footer__credit">
          Website design and development:
          <a href="https://www.dr-abhishek.com/" target="_blank" rel="author external noopener noreferrer">Dr Abhishek</a>
        </p>
      </div>
    </div>
  </footer>
</template>
