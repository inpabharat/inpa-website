<script setup lang="ts">
import type { PublicCarouselItem } from '../../../shared/types/content'
import { heroContent } from '~~/content/site/home'

defineProps<{ carousel: PublicCarouselItem[] }>()
const animationPaused = ref(false)
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <HomeNucleusSimulation :paused="animationPaused" />
    <div class="container hero__content">
      <div class="hero__copy" :class="{ 'hero__copy--full': !carousel.length }">
        <p class="eyebrow eyebrow--light">Official digital home</p>
        <h1 id="hero-title">{{ heroContent.title }}</h1>
        <p class="hero__mission">{{ heroContent.mission }}</p>
        <p class="hero__tagline">{{ heroContent.tagline }}</p>
        <div class="hero__actions" aria-label="Featured destinations">
          <NuxtLink
            v-for="(action, index) in heroContent.actions"
            :key="action.to"
            :class="['button', index === 0 ? 'button--gold' : 'button--outline-light']"
            :to="action.to"
          >
            {{ action.label }}
          </NuxtLink>
        </div>
        <button
          class="hero__motion-control"
          type="button"
          @click="animationPaused = !animationPaused"
        >
          {{ animationPaused ? 'Resume background animation' : 'Pause background animation' }}
        </button>
      </div>

      <aside v-if="carousel.length" class="hero__feature" aria-label="Featured updates">
        <HomeHeroSlideshow :items="carousel" />
      </aside>

      <ul class="hero__focus-list" aria-label="INPA priorities">
        <li v-for="item in heroContent.focusAreas" :key="item">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>
