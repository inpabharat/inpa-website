<script setup lang="ts">
import { presidentContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white president-section" aria-labelledby="president-title">
    <div class="container split-feature">
      <figure class="president-portrait">
        <img src="/images/profile-ak-jain.jpg" alt="Prof. A. K. Jain, President of the Indian Nuclear Physics Association" width="1600" height="1600">
        <figcaption>Prof. A. K. Jain · Photograph supplied for the website; formal credit line pending.</figcaption>
      </figure>
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
