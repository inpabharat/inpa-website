<script setup lang="ts">
import { aboutContent, presidentContent } from '~~/content/site/home'
</script>

<template>
  <section class="section section--white institutional-snapshot" aria-labelledby="institutional-snapshot-title">
    <div class="container institutional-snapshot__layout">
      <div class="institutional-snapshot__about">
        <p class="eyebrow">About the association</p>
        <h2 id="institutional-snapshot-title">A national community for nuclear physics</h2>
        <p class="lead">{{ aboutContent.summary }}</p>
        <p class="fact-line">{{ aboutContent.registration }}</p>
        <p class="source-note">Source: {{ aboutContent.source }}</p>
        <NuxtLink class="text-link" to="/about">About INPA <span aria-hidden="true">→</span></NuxtLink>
      </div>

      <aside class="institutional-snapshot__president" aria-labelledby="snapshot-president-title">
        <figure>
          <img
            src="/images/profile-ak-jain.jpg"
            alt="Prof. A. K. Jain, President of the Indian Nuclear Physics Association"
            width="1600"
            height="1600"
            loading="lazy"
          >
          <figcaption>Prof. A. K. Jain, President, Indian Nuclear Physics Association.</figcaption>
        </figure>
        <div>
          <p class="eyebrow">From the President</p>
          <h3 id="snapshot-president-title">{{ presidentContent.title }}</h3>
          <p class="profile-role">{{ presidentContent.role }}<br>{{ presidentContent.affiliation }}</p>
          <p>{{ presidentContent.message }}</p>
          <NuxtLink class="text-link" :to="presidentContent.to">Read the President’s Message <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </aside>
    </div>
  </section>
</template>
