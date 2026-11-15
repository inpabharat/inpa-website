<script setup lang="ts">
import { presidentContent } from '~~/content/site/president'
</script>

<template>
  <section class="section section--white president-section" aria-labelledby="president-title">
    <div class="container president-layout">
      <figure class="president-portrait">
        <img v-bind="presidentContent.portrait" alt="">
      </figure>
      <div class="president-message">
        <p class="eyebrow">From the President</p>
        <h2 id="president-title">{{ presidentContent.name }}</h2>
        <p class="profile-role">{{ presidentContent.role }}</p>
        <p class="lead">{{ presidentContent.welcome }}</p>
        <NuxtLink class="text-link" :to="presidentContent.to">Read Full Message <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
