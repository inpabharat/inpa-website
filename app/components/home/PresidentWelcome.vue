<script setup lang="ts">
import { presidentContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white" aria-labelledby="president-title">
    <div class="container split-feature">
      <div class="portrait-placeholder" role="img" aria-label="Development placeholder for the approved President photograph">
        <span>Approved portrait required</span>
      </div>
      <div>
        <p class="eyebrow">President’s welcome</p>
        <h2 id="president-title">{{ presidentContent.title }}</h2>
        <p class="profile-role">{{ presidentContent.role }}<br>{{ presidentContent.affiliation }}</p>
        <PlaceholderNotice :message="presidentContent.status" />
        <p class="lead">{{ presidentContent.message }}</p>
        <p class="source-note">{{ presidentContent.source }}</p>
        <NuxtLink class="text-link" :to="presidentContent.to">Read Full Message <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
