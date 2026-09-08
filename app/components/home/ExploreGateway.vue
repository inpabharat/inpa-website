<script setup lang="ts">
import { dedicatedSections } from '~~/content/site/home'
</script>

<template>
  <section id="explore" class="section explore-gateway" aria-labelledby="explore-inpa-title">
    <div class="container explore-gateway__layout">
      <header>
        <p class="eyebrow">National discovery gateway</p>
        <h2 id="explore-inpa-title">Explore Nuclear Physics in India</h2>
        <p class="section-heading__intro">Find the scientific people, places and possibilities that can turn a question into an experiment, opportunity or collaboration.</p>
      </header>

      <nav class="explore-gateway__links" aria-label="Explore nuclear physics in India">
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
