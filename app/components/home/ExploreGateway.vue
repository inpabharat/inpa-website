<script setup lang="ts">
import { dedicatedSections } from '~~/content/site/home'
</script>

<template>
  <section id="explore" class="section explore-gateway" aria-labelledby="explore-inpa-title">
    <div class="container explore-gateway__layout">
      <header>
        <p class="eyebrow">Explore INPA</p>
        <h2 id="explore-inpa-title">Detailed resources, without crowding the homepage</h2>
        <p class="section-heading__intro">Continue to the dedicated area for learning resources, publication records, governance information or India’s major centres and facilities.</p>
      </header>

      <nav class="explore-gateway__links" aria-label="Dedicated INPA sections">
        <NuxtLink v-for="item in dedicatedSections" :key="item.to" :to="item.to">
          <span class="explore-gateway__mark" aria-hidden="true">{{ item.mark }}</span>
          <span>
            <strong>{{ item.title }}</strong>
            <small>{{ item.summary }}</small>
          </span>
          <span aria-hidden="true">→</span>
        </NuxtLink>
      </nav>
    </div>
  </section>
</template>
