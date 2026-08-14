<script setup lang="ts">
import { presidentContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white president-section" aria-labelledby="president-title">
    <div class="container president-layout">
      <figure class="president-portrait">
        <img src="/images/profile-ak-jain.jpg" alt="Prof. A. K. Jain, President of the Indian Nuclear Physics Association" width="1600" height="2400">
        <figcaption>Prof. A. K. Jain · Photograph supplied for the website; formal credit line pending.</figcaption>
      </figure>
      <div class="president-message">
        <p class="eyebrow">From the President</p>
        <h2 id="president-title">{{ presidentContent.title }}</h2>
        <p class="profile-role">{{ presidentContent.role }}<br>{{ presidentContent.affiliation }}</p>
        <p class="lead">{{ presidentContent.message }}</p>
        <p class="source-note">{{ presidentContent.source }}</p>
        <p class="content-caveat">A final author-approved web version and formal photograph credit are still required.</p>
        <NuxtLink class="text-link" :to="presidentContent.to">Read Full Message <span aria-hidden="true">→</span></NuxtLink>
      </div>
    </div>
  </section>
</template>
