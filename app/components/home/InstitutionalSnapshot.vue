<script setup lang="ts">
import { aboutContent } from '~~/content/site/home'
import { presidentContent } from '~~/content/site/president'
</script>

<template>
  <section class="section section--white institutional-snapshot" aria-labelledby="institutional-snapshot-title">
    <div class="container institutional-snapshot__layout">
      <div class="institutional-snapshot__about">
        <h2 id="institutional-snapshot-title">A national community for nuclear physics</h2>
        <p class="lead">{{ aboutContent.summary }}</p>
        <p class="fact-line">{{ aboutContent.registration }}</p>
        <NuxtLink class="text-link" to="/about">About INPA <span aria-hidden="true">→</span></NuxtLink>
      </div>

      <aside class="institutional-snapshot__president" aria-labelledby="snapshot-president-title">
        <figure>
          <img
            v-bind="presidentContent.portrait"
            alt=""
            loading="lazy"
          >
        </figure>
        <div>
          <h3 id="snapshot-president-title">{{ presidentContent.name }}</h3>
          <p class="profile-role">{{ presidentContent.affiliation }}<br>{{ presidentContent.role }}</p>
          <p>{{ presidentContent.welcome }}</p>
          <NuxtLink class="text-link" :to="presidentContent.to">Read the President’s Message <span aria-hidden="true">→</span></NuxtLink>
        </div>
      </aside>
    </div>
  </section>
</template>
