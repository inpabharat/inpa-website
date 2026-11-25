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
        <h1 id="hero-title">{{ heroContent.title }}</h1>
        <!-- The motto stays on every page as the footer statement; the hero leads with what INPA does. -->
        <p class="hero__tagline">{{ heroContent.tagline }}</p>
        <div class="hero__actions" aria-label="Featured destinations">
          <NuxtLink
            v-for="(action, index) in heroContent.actions"
            :key="action.to"
            :class="index === 0 ? 'button button--gold' : index === 1 ? 'button button--outline-light' : 'text-link text-link--light hero__text-action'"
            :to="action.to"
          >
            {{ action.label }}<span v-if="index > 1" aria-hidden="true"> →</span>
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
